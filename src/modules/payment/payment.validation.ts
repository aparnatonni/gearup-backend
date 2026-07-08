import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid('Invalid rental order id'),
  }),
});

export const paymentValidation = {
  createPaymentSchema,
};
