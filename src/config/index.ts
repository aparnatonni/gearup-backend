import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// Reading env vars in one place means: if one is missing, you find out at
// startup (see the check in server.ts) instead of getting a confusing
// "undefined" error deep inside some service function later.
export default {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};
