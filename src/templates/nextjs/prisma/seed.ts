import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Work' },
      update: {},
      create: {
        name: 'Work',
        description: 'Work-related items',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Personal' },
      update: {},
      create: {
        name: 'Personal',
        description: 'Personal items',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Shopping' },
      update: {},
      create: {
        name: 'Shopping',
        description: 'Shopping list items',
      },
    }),
  ]);

  console.log('✅ Created categories:', categories.length);

  // Create sample items
  const items = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature',
        completed: false,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests',
        completed: true,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        completed: false,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Update dependencies',
        description: 'Update all npm packages to their latest versions',
        completed: false,
      },
    }),
  ]);

  console.log('✅ Created items:', items.length);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

