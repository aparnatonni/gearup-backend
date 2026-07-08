import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    gearItemId: z.string().uuid('Invalid gear item id'),
    rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
    comment: z.string().max(1000).optional(),
  }),
});

export const reviewValidation = {
  createReviewSchema,
};
