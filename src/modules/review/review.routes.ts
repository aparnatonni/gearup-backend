import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { reviewController } from './review.controller';
import { reviewValidation } from './review.validation';

const router = Router();

router.post('/', auth('CUSTOMER'), validateRequest(reviewValidation.createReviewSchema), reviewController.createReview);

export const reviewRoutes = router;
