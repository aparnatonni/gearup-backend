import app from './app';
import config from './config';
import { prisma } from './config/prisma';

async function main() {
  // Fail fast at startup if required secrets are missing, instead of
  // letting the server run and mysteriously fail on the first request.
  const required = ['databaseUrl', 'jwtSecret'] as const;
  for (const key of required) {
    if (!config[key]) {
      console.error(`❌ Missing required env var for "${key}". Check your .env file.`);
      process.exit(1);
    }
  }

  await prisma.$connect();
  console.log('✅ Connected to database');

  app.listen(config.port, () => {
    console.log(`🚀 GearUp API listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
