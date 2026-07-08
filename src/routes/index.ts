import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { gearRoutes } from '../modules/gear/gear.routes';
import { providerGearRoutes } from '../modules/gear/providerGear.routes';
import { rentalRoutes } from '../modules/rental/rental.routes';
import { providerOrderRoutes } from '../modules/rental/providerOrder.routes';
import { paymentRoutes } from '../modules/payment/payment.routes';
import { reviewRoutes } from '../modules/review/review.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

const router = Router();

// Every module mounts here. This is the ONLY place you register a new
// module's routes - app.ts just imports this one router.
// Paths match the assignment spec exactly: public gear browsing lives under
// /api/gear, provider-only management lives under /api/provider/gear, etc.
const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/categories', route: categoryRoutes },
  { path: '/gear', route: gearRoutes },
  { path: '/provider/gear', route: providerGearRoutes },
  { path: '/rentals', route: rentalRoutes },
  { path: '/provider/orders', route: providerOrderRoutes },
  { path: '/payments', route: paymentRoutes },
  { path: '/reviews', route: reviewRoutes },
  { path: '/admin', route: adminRoutes },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
