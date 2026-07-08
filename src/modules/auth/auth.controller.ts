import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authService } from './auth.service';

// Controllers are intentionally thin: pull data off req, call the service,
// hand the result to sendResponse. No business logic here.
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  sendResponse(res, 200, {
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.getMe(req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: 'Current user retrieved successfully',
    data: result,
  });
});

export const authController = {
  register,
  login,
  getMe,
};
