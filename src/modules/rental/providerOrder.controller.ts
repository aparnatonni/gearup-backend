import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { rentalService } from './rental.service';

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getProviderOrders(req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Incoming orders retrieved successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.updateOrderStatus(req.params.id, req.user!.id, req.body.status);
  sendResponse(res, 200, {
    success: true,
    message: `Order status updated to ${result.status}`,
    data: result,
  });
});

export const providerOrderController = {
  getProviderOrders,
  updateOrderStatus,
};
