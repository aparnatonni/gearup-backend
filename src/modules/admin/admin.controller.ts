import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsers();
  sendResponse(res, 200, { success: true, message: 'Users retrieved successfully', data: result });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateUserStatus(req.params.id, req.body.status);
  sendResponse(res, 200, { success: true, message: 'User status updated successfully', data: result });
});

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllGear();
  sendResponse(res, 200, { success: true, message: 'Gear listings retrieved successfully', data: result });
});

const getAllRentalOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllRentalOrders();
  sendResponse(res, 200, { success: true, message: 'Rental orders retrieved successfully', data: result });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentalOrders,
};
