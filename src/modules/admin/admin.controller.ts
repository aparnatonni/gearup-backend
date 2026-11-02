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

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createCategory(req.body.name);
  sendResponse(res, 201, { success: true, message: 'Category created successfully', data: result });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateCategory(req.params.id, req.body.name);
  sendResponse(res, 200, { success: true, message: 'Category updated successfully', data: result });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await adminService.deleteCategory(req.params.id);
  sendResponse(res, 200, { success: true, message: 'Category deleted successfully' });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentalOrders,
  createCategory,
  updateCategory,
  deleteCategory,
};
