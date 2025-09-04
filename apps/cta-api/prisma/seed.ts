import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.ctaConfig.upsert({
    where: { key: 'cta:homepage' },
    create: {
      key: 'cta:homepage',
      json: { headline: 'Transform your space.', ctaText: 'Get Quote', variant: 'A' },
    },
    update: {
      json: { headline: 'Transform your space.', ctaText: 'Get Quote', variant: 'A' },
    },
  });
  // eslint-disable-next-line no-console
  console.log('Seed completed');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

