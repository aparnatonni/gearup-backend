import { z } from 'zod';

const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'SUSPENDED']),
  }),
});

export const adminValidation = {
  updateUserStatusSchema,
};
