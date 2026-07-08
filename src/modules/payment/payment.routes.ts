import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { paymentController } from './payment.controller';
import { paymentValidation } from './payment.validation';

const router = Router();

// Note: the actual /api/payments/webhook route is registered directly in
// app.ts (before express.json()), NOT here - it needs the raw request body,
// which conflicts with the express.json() middleware used by every other route.
router.post('/create', auth('CUSTOMER'), validateRequest(paymentValidation.createPaymentSchema), paymentController.createPaymentSession);
router.get('/', auth('CUSTOMER'), paymentController.getMyPayments);
router.get('/:id', auth('CUSTOMER'), paymentController.getPaymentById);

export const paymentRoutes = router;
