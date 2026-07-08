import { PrismaClient } from '@prisma/client';

// One PrismaClient instance for the whole app - reused everywhere via import,
// never `new PrismaClient()` inside individual service files, or you'll
// exhaust your database's connection pool.
export const prisma = new PrismaClient();
