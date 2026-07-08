import { z } from 'zod';

// Note: role is restricted to CUSTOMER/PROVIDER here on purpose.
// Nobody should be able to register themselves as ADMIN through the public API -
// the admin account is created via the seed script instead (see prisma/seed.ts).
const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CUSTOMER', 'PROVIDER'], {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be CUSTOMER or PROVIDER',
    }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
});

export const authValidation = {
  registerSchema,
  loginSchema,
};
