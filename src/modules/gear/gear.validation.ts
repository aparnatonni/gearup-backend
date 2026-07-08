import { z } from 'zod';

const createGearSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    brand: z.string().min(1, 'Brand is required'),
    pricePerDay: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be greater than 0'),
    quantity: z.number({ invalid_type_error: 'Quantity must be a number' }).int().positive('Quantity must be at least 1'),
    categoryId: z.string().uuid('Invalid category id'),
    images: z.array(z.string().url('Each image must be a valid URL')).optional().default([]),
  }),
});

// Every field optional on update - you're only sending what changed
const updateGearSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    brand: z.string().min(1).optional(),
    pricePerDay: z.number().positive().optional(),
    quantity: z.number().int().positive().optional(),
    categoryId: z.string().uuid().optional(),
    available: z.boolean().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

export const gearValidation = {
  createGearSchema,
  updateGearSchema,
};
