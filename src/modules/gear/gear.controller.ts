import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { gearService } from './gear.service';

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.getAllGear(req.query);
  sendResponse(res, 200, {
    success: true,
    message: 'Gear items retrieved successfully',
    data: result,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.getGearById(req.params.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Gear item retrieved successfully',
    data: result,
  });
});

const createGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.createGear(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Gear item created successfully',
    data: result,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.updateGear(req.params.id, req.user!.id, req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'Gear item updated successfully',
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  await gearService.deleteGear(req.params.id, req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Gear item deleted successfully',
  });
});

const getMyGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.getProviderGear(req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Your gear items retrieved successfully',
    data: result,
  });
});

export const gearController = {
  getAllGear,
  getGearById,
  createGear,
  updateGear,
  deleteGear,
  getMyGear,
};
