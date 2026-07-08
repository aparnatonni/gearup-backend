import { Router } from 'express';
import { gearController } from './gear.controller';

const router = Router();

// GET /api/gear?category=xxx&brand=xxx&minPrice=10&maxPrice=50&available=true&search=tent
router.get('/', gearController.getAllGear);
router.get('/:id', gearController.getGearById);

export const gearRoutes = router;
