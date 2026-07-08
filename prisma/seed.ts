import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin credentials - these are what you submit for the assignment's
  // "Admin Credentials" requirement. Change the password before real use.
  const adminEmail = 'admin@gearup.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'GearUp Admin',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin created -> email: ${adminEmail}, password: ${adminPassword}`);
  } else {
    console.log('ℹ️  Admin already exists, skipping');
  }

  const categoryNames = ['Cycling', 'Camping', 'Fitness', 'Water Sports', 'Winter Sports', 'Team Sports'];
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ Seeded ${categoryNames.length} categories`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
