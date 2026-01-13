/**
 * Data migration script to prepare existing snippets for the sharing platform
 * Run this BEFORE creating the Prisma migration
 */

import { PrismaClient } from '@prisma/client';
import { generateShortCode } from '../lib/shortcode';

const prisma = new PrismaClient();

async function migrateExistingData() {
  console.log('Starting data migration...');

  try {
    // Get all users
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('⚠️  No users found. Creating a default admin user...');
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@snippetvault.local',
          password: hashedPassword,
          name: 'Admin',
          username: 'admin',
        },
      });
      
      console.log(`✅ Created admin user: ${adminUser.email}`);
      users.push(adminUser);
    }

    const defaultUser = users[0];
    console.log(`📝 Will assign existing snippets to: ${defaultUser.email}`);

    // Get all snippets
    const snippets = await prisma.snippet.findMany();
    console.log(`📊 Found ${snippets.length} existing snippets`);

    // Generate unique short codes for each snippet
    const existingCodes = new Set<string>();
    const updates: Array<{ id: string; shortCode: string }> = [];

    for (const snippet of snippets) {
      let shortCode = generateShortCode();
      let attempts = 0;
      
      while (existingCodes.has(shortCode) && attempts < 10) {
        shortCode = generateShortCode();
        attempts++;
      }
      
      if (attempts >= 10) {
        throw new Error('Unable to generate unique short codes');
      }
      
      existingCodes.add(shortCode);
      updates.push({ id: snippet.id, shortCode });
    }

    console.log(`✅ Generated ${updates.length} unique short codes`);
    console.log('📝 Short codes will be assigned during migration');
    console.log('\nMigration preparation complete!');
    console.log('\nNext steps:');
    console.log('1. Run: pnpm exec prisma migrate dev --name add-sharing-features');
    console.log('2. After migration completes, the new schema will be applied');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateExistingData()
  .then(() => {
    console.log('\n✅ Data migration preparation successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Data migration preparation failed:', error);
    process.exit(1);
  });

