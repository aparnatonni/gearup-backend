import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { adminController } from './admin.controller';
import { adminValidation } from './admin.validation';

const router = Router();

router.get('/users', auth('ADMIN'), adminController.getAllUsers);
router.patch('/users/:id', auth('ADMIN'), validateRequest(adminValidation.updateUserStatusSchema), adminController.updateUserStatus);
router.get('/gear', auth('ADMIN'), adminController.getAllGear);
router.get('/rentals', auth('ADMIN'), adminController.getAllRentalOrders);

router.post('/categories', auth('ADMIN'), validateRequest(adminValidation.createCategorySchema), adminController.createCategory);
router.patch('/categories/:id', auth('ADMIN'), validateRequest(adminValidation.updateCategorySchema), adminController.updateCategory);
router.delete('/categories/:id', auth('ADMIN'), validateRequest(adminValidation.deleteCategorySchema), adminController.deleteCategory);

export const adminRoutes = router;
