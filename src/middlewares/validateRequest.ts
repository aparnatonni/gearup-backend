import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

// Usage in a route file:
//   router.post('/register', validateRequest(registerSchema), authController.register)
//
// The schema itself expects an object shaped like { body: {...} } (see auth.validation.ts)
// so the same middleware can validate body, query, and params all at once if needed.
const validateRequest = (schema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });

export default validateRequest;
