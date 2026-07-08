import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReview(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
};
