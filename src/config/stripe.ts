import Stripe from 'stripe';
import config from './index';

if (!config.stripeSecretKey) {
  // Fails loudly at startup instead of silently breaking payments later
  console.warn('⚠️  STRIPE_SECRET_KEY is not set - payment routes will fail');
}

export const stripe = new Stripe(config.stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});
