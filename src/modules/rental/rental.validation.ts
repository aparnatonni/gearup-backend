import { z } from 'zod';

const createRentalSchema = z.object({
  body: z
    .object({
      startDate: z.string().datetime({ message: 'startDate must be a valid ISO date' }),
      endDate: z.string().datetime({ message: 'endDate must be a valid ISO date' }),
      items: z
        .array(
          z.object({
            gearItemId: z.string().uuid(),
            quantity: z.number().int().positive(),
          }),
        )
        .min(1, 'At least one gear item is required'),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: 'endDate must be after startDate',
      path: ['endDate'],
    }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED']),
  }),
});

export const rentalValidation = {
  createRentalSchema,
  updateStatusSchema,
};
