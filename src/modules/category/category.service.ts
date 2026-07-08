import { prisma } from '../../config/prisma';

// Categories are simple enough that customers/providers never create them
// through the API - they're seeded once (see prisma/seed.ts). This keeps
// the category list clean instead of every provider inventing their own.
const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const categoryService = {
  getAllCategories,
};
