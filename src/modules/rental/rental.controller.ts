import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { rentalService } from './rental.service';

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.createRentalOrder(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Rental order placed successfully',
    data: result,
  });
});

const getMyRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getMyRentalOrders(req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Rental orders retrieved successfully',
    data: result,
  });
});

const getRentalOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getRentalOrderById(req.params.id, req.user!.id, req.user!.role);
  sendResponse(res, 200, {
    success: true,
    message: 'Rental order retrieved successfully',
    data: result,
  });
});

export const rentalController = {
  createRentalOrder,
  getMyRentalOrders,
  getRentalOrderById,
};
