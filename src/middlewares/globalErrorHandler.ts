import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';

// This is the LAST middleware in the chain (registered in app.ts after all routes).
// Every error in the app - thrown AppErrors, Zod validation errors, Prisma errors,
// or anything unexpected - funnels through here and comes out in one consistent shape.
// This satisfies mandatory requirement #2: structured JSON error responses.
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorDetails: unknown = err;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = { message: err.message };
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err?.code === 'P2002') {
    // Prisma unique constraint violation (e.g. duplicate email)
    statusCode = 400;
    message = 'Duplicate value';
    errorDetails = { fields: err.meta?.target };
  } else if (err?.code === 'P2025') {
    // Prisma "record not found" on update/delete
    statusCode = 404;
    message = 'Resource not found';
    errorDetails = { message: err.meta?.cause };
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = { message: err.message };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
