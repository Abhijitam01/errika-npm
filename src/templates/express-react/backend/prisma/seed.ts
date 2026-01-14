import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample items
  const items = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Welcome to your new app!',
        description: 'This is a sample item to get you started.',
        userId: demoUser.id,
        completed: false,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Learn Express.js',
        description: 'Explore the backend API routes and controllers.',
        userId: demoUser.id,
        completed: false,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Build with React',
        description: 'Create beautiful UIs with React and TypeScript.',
        userId: demoUser.id,
        completed: true,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Deploy to production',
        description: 'Deploy your app to a cloud provider.',
        userId: demoUser.id,
        completed: false,
      },
    }),
  ]);

  console.log('✅ Created items:', items.length);

  console.log('\n🎉 Seeding completed!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: Demo123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

