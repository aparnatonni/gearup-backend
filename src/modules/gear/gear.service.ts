import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import AppError from '../../errors/AppError';

type TGearFilters = {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  available?: string;
  search?: string;
  page?: string;
  limit?: string;
};

// Builds the Prisma "where" clause conditionally - only add a filter if the
// query param was actually sent. This is the standard pattern for "filterable"
// list endpoints instead of writing a separate query for every combination.
const getAllGear = async (filters: TGearFilters): Promise<any> => {
  const where: Prisma.GearItemWhereInput = {};

  if (filters.category) where.categoryId = filters.category;
  if (filters.brand) where.brand = { equals: filters.brand, mode: 'insensitive' };
  if (filters.available) where.available = filters.available === 'true';
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters.minPrice || filters.maxPrice) {
    where.pricePerDay = {};
    if (filters.minPrice) where.pricePerDay.gte = Number(filters.minPrice);
    if (filters.maxPrice) where.pricePerDay.lte = Number(filters.maxPrice);
  }

  const hasPagination = filters.page !== undefined || filters.limit !== undefined;
  if (!hasPagination) {
    return prisma.gearItem.findMany({
      where,
      include: { category: true, provider: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  const pageRaw = filters.page !== undefined ? Number(filters.page) : 1;
  const limitRaw = filters.limit !== undefined ? Number(filters.limit) : 10;
  if (!Number.isInteger(pageRaw) || pageRaw < 1 || !Number.isInteger(limitRaw) || limitRaw < 1 || limitRaw > 50) {
    throw new AppError(400, 'Invalid pagination parameters');
  }
  const page = pageRaw;
  const limit = limitRaw;

  const [items, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      include: { category: true, provider: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.gearItem.count({ where }),
  ]);

  return { items, meta: { page, limit, total } };
};

const getGearById = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, name: true } },
      reviews: { include: { customer: { select: { id: true, name: true } } } },
    },
  });
  if (!gear) throw new AppError(404, 'Gear item not found');
  return gear;
};

// --- Provider-only operations below ---

const createGear = async (providerId: string, payload: Prisma.GearItemUncheckedCreateInput) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new AppError(400, 'Category does not exist');

  return prisma.gearItem.create({
    data: { ...payload, providerId },
  });
};

// The ownership check is the important part here: a provider can only ever
// touch gear where providerId matches their own id from the JWT.
const assertOwnership = async (gearId: string, providerId: string) => {
  const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
  if (!gear) throw new AppError(404, 'Gear item not found');
  if (gear.providerId !== providerId) {
    throw new AppError(403, 'You do not own this gear item');
  }
  return gear;
};

const updateGear = async (gearId: string, providerId: string, payload: Prisma.GearItemUpdateInput) => {
  await assertOwnership(gearId, providerId);
  return prisma.gearItem.update({ where: { id: gearId }, data: payload });
};

const deleteGear = async (gearId: string, providerId: string) => {
  await assertOwnership(gearId, providerId);
  const [rentalItemCount, reviewCount] = await Promise.all([
    prisma.rentalItem.count({ where: { gearItemId: gearId } }),
    prisma.review.count({ where: { gearItemId: gearId } }),
  ]);
  if (rentalItemCount > 0 || reviewCount > 0) {
    throw new AppError(409, 'This gear has rental history and cannot be deleted. Set available=false instead.');
  }
  return prisma.gearItem.delete({ where: { id: gearId } });
};

const getProviderGear = async (providerId: string) => {
  return prisma.gearItem.findMany({
    where: { providerId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const gearService = {
  getAllGear,
  getGearById,
  createGear,
  updateGear,
  deleteGear,
  getProviderGear,
};
