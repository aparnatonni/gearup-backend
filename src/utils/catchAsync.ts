import { NextFunction, Request, RequestHandler, Response } from 'express';

// Wraps an async controller so any thrown error (or rejected promise)
// is forwarded to next(), which Express routes into globalErrorHandler.
// Without this, every controller would need its own try/catch block.
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
