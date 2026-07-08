import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { providerOrderController } from './providerOrder.controller';
import { rentalValidation } from './rental.validation';

const router = Router();

router.get('/', auth('PROVIDER'), providerOrderController.getProviderOrders);
router.patch('/:id', auth('PROVIDER'), validateRequest(rentalValidation.updateStatusSchema), providerOrderController.updateOrderStatus);

export const providerOrderRoutes = router;
