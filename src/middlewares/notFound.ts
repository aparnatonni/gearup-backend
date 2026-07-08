import { NextFunction, Request, Response } from 'express';

// Runs when a request hits a route that doesn't exist at all
// (e.g. GET /api/blah). Registered right before globalErrorHandler.
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    errorDetails: { path: req.originalUrl },
  });
};

export default notFound;
