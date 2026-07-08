import { UserStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import AppError from '../../errors/AppError';

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === 'ADMIN') throw new AppError(400, 'Cannot change status of an admin account');

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const getAllGear = async () => {
  return prisma.gearItem.findMany({
    include: { category: true, provider: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getAllRentalOrders = async () => {
  return prisma.rentalOrder.findMany({
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: { include: { gearItem: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentalOrders,
};
