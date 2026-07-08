import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { categoryService } from './category.service';

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories();
  sendResponse(res, 200, {
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const categoryController = {
  getAllCategories,
};
