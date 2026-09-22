import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed charities
  const charities = await Promise.all([
    prisma.charity.upsert({
      where: { id: 'charity-1' },
      update: {},
      create: {
        id: 'charity-1',
        name: 'Save The Children',
        description: 'Protecting children around the world from poverty and disease.',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
      },
    }),
    prisma.charity.upsert({
      where: { id: 'charity-2' },
      update: {},
      create: {
        id: 'charity-2',
        name: 'Green Earth Foundation',
        description: 'Fighting climate change through reforestation and clean energy.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
      },
    }),
    prisma.charity.upsert({
      where: { id: 'charity-3' },
      update: {},
      create: {
        id: 'charity-3',
        name: 'Digital Access for All',
        description: 'Bridging the digital divide by providing technology to underserved communities.',
        imageUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400',
      },
    }),
  ]);

  // Seed admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@digitalheroes.com' },
    update: {},
    create: {
      id: 'admin-user',
      email: 'admin@digitalheroes.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      subscriptionStatus: 'ACTIVE',
      charityId: 'charity-1',
      charityPercentage: 10,
    },
  });

  // Seed demo user
  const userHash = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'player@digitalheroes.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'player@digitalheroes.com',
      passwordHash: userHash,
      role: 'USER',
      subscriptionStatus: 'ACTIVE',
      charityId: 'charity-2',
      charityPercentage: 15,
    },
  });

  // Seed scores for demo user
  const scoreDates = [
    new Date('2026-09-01'), new Date('2026-09-05'), new Date('2026-09-10'),
    new Date('2026-09-15'), new Date('2026-09-20'),
  ];
  const scorePoints = [32, 28, 35, 41, 29];
  for (let i = 0; i < 5; i++) {
    await prisma.score.upsert({
      where: { userId_date: { userId: demoUser.id, date: scoreDates[i] } },
      update: {},
      create: { userId: demoUser.id, points: scorePoints[i], date: scoreDates[i] },
    });
  }

  console.log('✅ Seed complete!');
  console.log('   Admin: admin@digitalheroes.com / admin123');
  console.log('   Player: player@digitalheroes.com / demo123');
  console.log(`   ${charities.length} charities seeded`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
