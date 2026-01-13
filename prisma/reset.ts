import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing all database data...');

  // Delete in order to respect foreign key constraints
  await prisma.snippet.deleteMany();
  console.log('✅ Cleared Snippets');

  await prisma.tag.deleteMany();
  console.log('✅ Cleared Tags');

  await prisma.user.deleteMany();
  console.log('✅ Cleared Users');

  console.log('✨ Database reset complete! All data has been cleared.');
}

main()
  .catch((e) => {
    console.error('❌ Reset failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

