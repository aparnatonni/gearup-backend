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
};

// Builds the Prisma "where" clause conditionally - only add a filter if the
// query param was actually sent. This is the standard pattern for "filterable"
// list endpoints instead of writing a separate query for every combination.
const getAllGear = async (filters: TGearFilters) => {
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

  return prisma.gearItem.findMany({
    where,
    include: { category: true, provider: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
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
