import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { rentalController } from './rental.controller';
import { rentalValidation } from './rental.validation';

const router = Router();

router.post('/', auth('CUSTOMER'), validateRequest(rentalValidation.createRentalSchema), rentalController.createRentalOrder);
router.get('/', auth('CUSTOMER'), rentalController.getMyRentalOrders);
router.get('/:id', auth('CUSTOMER', 'PROVIDER', 'ADMIN'), rentalController.getRentalOrderById);

export const rentalRoutes = router;
