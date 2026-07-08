import Stripe from 'stripe';
import { prisma } from '../../config/prisma';
import { stripe } from '../../config/stripe';
import config from '../../config';
import AppError from '../../errors/AppError';

// Customer must own a CONFIRMED order (provider already accepted it) before
// they can pay for it - you can't pay for something that hasn't been confirmed.
const createPaymentSession = async (customerId: string, rentalOrderId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: { payment: true },
  });

  if (!order) throw new AppError(404, 'Rental order not found');
  if (order.customerId !== customerId) throw new AppError(403, 'This is not your order');
  if (order.status !== 'CONFIRMED') {
    throw new AppError(400, `Order must be CONFIRMED before payment. Current status: ${order.status}`);
  }
  if (order.payment) throw new AppError(400, 'A payment already exists for this order');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `GearUp Rental Order #${order.id.slice(0, 8)}` },
          unit_amount: Math.round(order.totalAmount * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    success_url: `${config.clientUrl}/payment/success?rentalId=${order.id}`,
    cancel_url: `${config.clientUrl}/payment/cancel?rentalId=${order.id}`,
    metadata: { rentalOrderId: order.id },
  });

  await prisma.payment.create({
    data: {
      transactionId: session.id,
      rentalOrderId: order.id,
      amount: order.totalAmount,
      method: 'STRIPE',
      status: 'PENDING',
    },
  });

  return { checkoutUrl: session.url };
};

// This is called ONLY from the webhook handler (see payment.controller.ts),
// never directly by the client. That's what makes it trustworthy - Stripe's
// signature proves the event genuinely came from Stripe, not from someone
// hitting your API pretending payment succeeded.
const confirmPaymentFromWebhook = async (session: Stripe.Checkout.Session) => {
  const rentalOrderId = session.metadata?.rentalOrderId;
  if (!rentalOrderId) return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { transactionId: session.id },
      data: { status: 'COMPLETED', paidAt: new Date() },
    }),
    prisma.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: 'PAID' },
    }),
  ]);
};

const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { rentalOrder: { customerId } },
    include: { rentalOrder: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getPaymentById = async (id: string, customerId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { rentalOrder: true },
  });
  if (!payment) throw new AppError(404, 'Payment not found');
  if (payment.rentalOrder.customerId !== customerId) {
    throw new AppError(403, 'You do not have access to this payment');
  }
  return payment;
};

export const paymentService = {
  createPaymentSession,
  confirmPaymentFromWebhook,
  getMyPayments,
  getPaymentById,
};
