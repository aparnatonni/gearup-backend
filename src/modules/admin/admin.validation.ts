import { z } from 'zod';

const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'SUSPENDED']),
  }),
});

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid category id'),
  }),
});

const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category id'),
  }),
});

export const adminValidation = {
  updateUserStatusSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};
