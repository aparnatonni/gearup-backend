import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { gearController } from './gear.controller';
import { gearValidation } from './gear.validation';

const router = Router();

// Every route here requires a valid PROVIDER token - auth('PROVIDER') runs
// first and throws 401/403 before the controller ever executes.
router.get('/', auth('PROVIDER'), gearController.getMyGear);
router.post('/', auth('PROVIDER'), validateRequest(gearValidation.createGearSchema), gearController.createGear);
router.put('/:id', auth('PROVIDER'), validateRequest(gearValidation.updateGearSchema), gearController.updateGear);
router.delete('/:id', auth('PROVIDER'), gearController.deleteGear);

export const providerGearRoutes = router;
