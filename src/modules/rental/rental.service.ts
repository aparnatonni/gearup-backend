import { RentalStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import AppError from '../../errors/AppError';

type TCreateRentalPayload = {
  startDate: string;
  endDate: string;
  items: { gearItemId: string; quantity: number }[];
};

const daysBetween = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

// This is the state machine: the ONLY legal transitions out of each status.
// Anything not listed here is rejected. This is what stops a provider from,
// say, jumping straight from PLACED to RETURNED, or confirming a cancelled order.
const ALLOWED_TRANSITIONS: Record<RentalStatus, RentalStatus[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CANCELLED'], // PAID happens automatically via the Stripe webhook, not this endpoint
  PAID: ['PICKED_UP'],
  PICKED_UP: ['RETURNED'],
  RETURNED: [],
  CANCELLED: [],
};

const createRentalOrder = async (customerId: string, payload: TCreateRentalPayload) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  const days = daysBetween(startDate, endDate);

  // A transaction here means: if ANY step fails (e.g. item 2 of 3 is out of
  // stock), NOTHING is written - you never end up with a half-created order.
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const rentalItemsData = [];

    for (const item of payload.items) {
      const gear = await tx.gearItem.findUnique({ where: { id: item.gearItemId } });

      if (!gear) throw new AppError(404, `Gear item ${item.gearItemId} not found`);
      if (!gear.available) throw new AppError(400, `"${gear.name}" is not currently available`);
      if (gear.quantity < item.quantity) {
        throw new AppError(400, `Only ${gear.quantity} unit(s) of "${gear.name}" available`);
      }

      const lineTotal = gear.pricePerDay * item.quantity * days;
      totalAmount += lineTotal;

      rentalItemsData.push({
        gearItemId: gear.id,
        quantity: item.quantity,
        priceAtRental: gear.pricePerDay, // snapshot, protects order history from future price changes
      });
    }

    const order = await tx.rentalOrder.create({
      data: {
        customerId,
        startDate,
        endDate,
        totalAmount,
        items: { create: rentalItemsData },
      },
      include: { items: { include: { gearItem: true } } },
    });

    return order;
  }, { maxWait: 10000, timeout: 20000 });
};

const getMyRentalOrders = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { customerId },
    include: { items: { include: { gearItem: true } }, payment: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getRentalOrderById = async (id: string, userId: string, role: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id },
    include: { items: { include: { gearItem: true } }, payment: true, customer: { select: { id: true, name: true, email: true } } },
  });
  if (!order) throw new AppError(404, 'Rental order not found');

  // Customers can only see their own orders. Providers/admins are checked
  // separately in the provider-orders service below.
  if (role === 'CUSTOMER' && order.customerId !== userId) {
    throw new AppError(403, 'You do not have access to this order');
  }
  return order;
};

// --- Provider side ---

// A provider should only see orders that include at least one of THEIR gear items.
const getProviderOrders = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { items: { some: { gearItem: { providerId } } } },
    include: { items: { include: { gearItem: true } }, customer: { select: { id: true, name: true, email: true } }, payment: true },
    orderBy: { createdAt: 'desc' },
  });
};

const updateOrderStatus = async (orderId: string, providerId: string, newStatus: RentalStatus) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: { items: { include: { gearItem: true } } },
  });
  if (!order) throw new AppError(404, 'Rental order not found');

  const ownsAnItem = order.items.some((item) => item.gearItem.providerId === providerId);
  if (!ownsAnItem) throw new AppError(403, 'You do not have any gear in this order');

  const legalNextStates = ALLOWED_TRANSITIONS[order.status];
  if (!legalNextStates.includes(newStatus)) {
    throw new AppError(
      400,
      `Cannot move order from ${order.status} to ${newStatus}. Allowed: ${legalNextStates.join(', ') || 'none'}`,
    );
  }

  return prisma.rentalOrder.update({ where: { id: orderId }, data: { status: newStatus } });
};

export const rentalService = {
  createRentalOrder,
  getMyRentalOrders,
  getRentalOrderById,
  getProviderOrders,
  updateOrderStatus,
};