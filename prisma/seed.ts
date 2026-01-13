import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateShortCode } from '../lib/shortcode';

const prisma = new PrismaClient();

async function main() {
  await prisma.snippet.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@snippetvault.com',
      password: hashedPassword,
      phone: '+1234567890',
      name: 'Demo User',
      username: 'demouser',
      bio: 'Passionate developer sharing useful code snippets',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      website: 'https://snippetvault.com',
      githubUrl: 'https://github.com/demouser',
    },
  });
  console.log('✅ Demo user created!');

  const webDev = await prisma.category.create({
    data: {
      name: 'Web Development',
      description: 'Frontend and backend web development snippets',
      icon: '🌐',
    },
  });

  const algorithms = await prisma.category.create({
    data: {
      name: 'Algorithms',
      description: 'Data structures and algorithms',
      icon: '🧮',
    },
  });

  const devops = await prisma.category.create({
    data: {
      name: 'DevOps',
      description: 'Docker, CI/CD, deployment scripts',
      icon: '🚀',
    },
  });

  const reactTag = await prisma.tag.create({
    data: { name: 'React', color: '#61DAFB' },
  });

  const tsTag = await prisma.tag.create({
    data: { name: 'TypeScript', color: '#3178C6' },
  });

  const nodeTag = await prisma.tag.create({
    data: { name: 'Node.js', color: '#339933' },
  });

  const pythonTag = await prisma.tag.create({
    data: { name: 'Python', color: '#3776AB' },
  });

  // Frontend frameworks
  await prisma.tag.create({
    data: { name: 'Vue.js', color: '#4FC08D' },
  });

  await prisma.tag.create({
    data: { name: 'Angular', color: '#DD0031' },
  });

  await prisma.tag.create({
    data: { name: 'Svelte', color: '#FF3E00' },
  });

  // DevOps & Cloud
  await prisma.tag.create({
    data: { name: 'Docker', color: '#2496ED' },
  });

  await prisma.tag.create({
    data: { name: 'Kubernetes', color: '#326CE5' },
  });

  await prisma.tag.create({
    data: { name: 'AWS', color: '#FF9900' },
  });

  await prisma.tag.create({
    data: { name: 'Azure', color: '#0078D4' },
  });

  // Databases
  await prisma.tag.create({
    data: { name: 'MongoDB', color: '#47A248' },
  });

  await prisma.tag.create({
    data: { name: 'PostgreSQL', color: '#336791' },
  });

  await prisma.tag.create({
    data: { name: 'Redis', color: '#DC382D' },
  });

  // Version Control
  await prisma.tag.create({
    data: { name: 'Git', color: '#F05032' },
  });

  await prisma.tag.create({
    data: { name: 'GitHub', color: '#181717' },
  });

  await prisma.tag.create({
    data: { name: 'GitLab', color: '#FC6D26' },
  });

  // Testing
  await prisma.tag.create({
    data: { name: 'Jest', color: '#C21325' },
  });

  await prisma.tag.create({
    data: { name: 'Cypress', color: '#17202C' },
  });

  await prisma.tag.create({
    data: { name: 'Testing Library', color: '#E33332' },
  });

  // API & Data
  await prisma.tag.create({
    data: { name: 'GraphQL', color: '#E10098' },
  });

  await prisma.tag.create({
    data: { name: 'REST', color: '#6B6B6B' },
  });

  await prisma.tag.create({
    data: { name: 'API', color: '#5C9EAD' },
  });

  // Styling
  await prisma.tag.create({
    data: { name: 'CSS', color: '#1572B6' },
  });

  await prisma.tag.create({
    data: { name: 'Tailwind', color: '#06B6D4' },
  });

  await prisma.tag.create({
    data: { name: 'SCSS', color: '#CC6699' },
  });

  // Security
  await prisma.tag.create({
    data: { name: 'Security', color: '#FF6B6B' },
  });

  await prisma.tag.create({
    data: { name: 'Authentication', color: '#4ECDC4' },
  });

  await prisma.tag.create({
    data: { name: 'Encryption', color: '#95E1D3' },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });