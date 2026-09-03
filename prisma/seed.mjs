import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TechMadrasah Multi-Tenant Database Seed...');
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed Tenant: Al-Furqan Quran Academy
  const alFurqan = await prisma.tenant.upsert({
    where: { subdomain: 'al-furqan' },
    update: {},
    create: {
      id: 'tenant-al-furqan',
      name: 'Al-Furqan Quran Academy',
      subdomain: 'al-furqan',
      niche: 'quran_tajweed',
      tagline: 'Mastering Sacred Quranic Memorization & Tajweed with Verified Sanad Teachers',
      description: 'Al-Furqan empowers students worldwide to memorize the Holy Quran with authentic Tajweed rules.',
      brandColor: '#059669',
      language: 'en',
      currency: 'USD',
      pricingPlans: [
        {
          id: 'plan-tajweed',
          name: 'Foundational Tajweed Track',
          priceMonthly: 65,
          currency: 'USD',
          features: ['114 Surah Uthmani Reader Access', 'Interactive Tajweed Token Highlights', 'Weekly Recitation Feedback']
        },
        {
          id: 'plan-hifz',
          name: 'Intensive Hifz Program',
          priceMonthly: 140,
          currency: 'USD',
          features: ['Daily Live WebRTC Video Halaqahs', 'Individual Surah Check-ins', 'Sanad Tracking Dashboard']
        }
      ],
      paymentGateways: [
        {
          provider: 'stripe',
          enabled: true,
          publishableKey: 'pk_test_51TFgt1RPXkQKup3MmIls7ogQPZTdZfbeRkFaKYNugljgX3svXSgy8wgNaRs8TmUP9UmA1Nh0dHV5xUni1aLBiSA400Gvkz2tZ9'
        }
      ]
    }
  });

  // 2. Seed Tenant: Code Academy Bootcamp
  const codeAcademy = await prisma.tenant.upsert({
    where: { subdomain: 'code-academy' },
    update: {},
    create: {
      id: 'tenant-code',
      name: 'Code Academy Bootcamp',
      subdomain: 'code-academy',
      niche: 'coding',
      tagline: 'Become a Professional Software Engineer with Live Interactive Browser Sandboxes',
      description: 'Code Academy delivers cohort-based web development bootcamps with real-time browser compilers.',
      brandColor: '#2563eb',
      language: 'en',
      currency: 'USD',
      pricingPlans: [
        {
          id: 'plan-frontend',
          name: 'Full-Stack Web Bootcamp',
          priceMonthly: 89,
          currency: 'USD',
          features: ['Browser Coding Sandboxes', 'Live Pair Programming Halaqahs', '1-on-1 Code Review']
        }
      ]
    }
  });

  // 3. Seed Users for Al-Furqan
  await prisma.user.upsert({
    where: { email: 'admin@al-furqan.org' },
    update: {},
    create: {
      id: 'usr-admin-furqan',
      email: 'admin@al-furqan.org',
      name: 'Ustadh Tariq Al-Mansoor',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      tenantId: alFurqan.id,
    }
  });

  await prisma.user.upsert({
    where: { email: 'student@al-furqan.org' },
    update: {},
    create: {
      id: 'usr-student-furqan',
      email: 'student@al-furqan.org',
      name: 'Zaid Ibrahim',
      passwordHash: defaultPasswordHash,
      role: 'student',
      tenantId: alFurqan.id,
    }
  });

  // 4. Seed Users for Code Academy
  await prisma.user.upsert({
    where: { email: 'admin@codeacademy.dev' },
    update: {},
    create: {
      id: 'usr-admin-code',
      email: 'admin@codeacademy.dev',
      name: 'Sarah Jenkins',
      passwordHash: defaultPasswordHash,
      role: 'admin',
      tenantId: codeAcademy.id,
    }
  });

  console.log('✅ TechMadrasah Database Seed Prepared!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
