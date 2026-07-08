import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../../config/stripe';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { paymentService } from './payment.service';

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentSession(req.user!.id, req.body.rentalOrderId);
  sendResponse(res, 200, {
    success: true,
    message: 'Payment session created successfully',
    data: result,
  });
});

// This route is NOT called by your frontend/Postman directly - it's called
// by Stripe's servers whenever a checkout session completes. Stripe signs
// every webhook request; we verify that signature before trusting anything
// in the payload. This is what makes "confirm" safe instead of something
// anyone could fake by POSTing a fake success payload.
const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, config.stripeWebhookSecret as string);
  } catch (err) {
    throw new AppError(400, `Webhook signature verification failed`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await paymentService.confirmPaymentFromWebhook(session);
  }

  res.status(200).json({ received: true });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getMyPayments(req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentById(req.params.id, req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

export const paymentController = {
  createPaymentSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};
