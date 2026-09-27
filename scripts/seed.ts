import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise LMS Database Seeding...');

  // 1. Seed Flagship Demo Tenants
  const demoTenants = [
    {
      name: 'Ankabit Platform Operations',
      subdomain: 'platform',
      niche: 'superadmin',
      brandColor: '#0f766e',
      pricingPlans: [],
      paymentGateways: [],
      settings: {
        subscriptionTier: 'enterprise',
        subscriptionStatus: 'active',
      },
    },
    {
      name: 'Al-Furqan Quran & Tajweed Academy',
      subdomain: 'al-furqan',
      niche: 'quran_tajweed',
      brandColor: '#0f766e',
      pricingPlans: [
        { id: 'plan-1', name: 'Starter Tajweed Track', price: 49, currency: 'USD', interval: 'month' },
        { id: 'plan-2', name: 'Intensive Hifz & Sanad', price: 99, currency: 'USD', interval: 'month' },
      ],
      paymentGateways: [
        { id: 'stripe', name: 'Stripe', enabled: true },
        { id: 'moyasar', name: 'Moyasar (Saudi Mada/Apple Pay)', enabled: true },
      ],
      settings: {
        subscriptionTier: 'growth',
        subscriptionStatus: 'active',
        maxStudents: 500,
        maxTeachers: 25,
      },
    },
    {
      name: 'CodeCraft Full-Stack Academy',
      subdomain: 'code-academy',
      niche: 'coding_tech',
      brandColor: '#2563eb',
      pricingPlans: [
        { id: 'plan-code-1', name: 'Full-Stack Bootcamp', price: 149, currency: 'USD', interval: 'month' },
      ],
      paymentGateways: [
        { id: 'stripe', name: 'Stripe', enabled: true },
      ],
      settings: {
        subscriptionTier: 'enterprise',
        subscriptionStatus: 'active',
        maxStudents: 2000,
        maxTeachers: 100,
      },
    },
    {
      name: 'Horizon Islamic Madrasah',
      subdomain: 'hifz-academy',
      niche: 'islamic_school',
      brandColor: '#059669',
      pricingPlans: [
        { id: 'plan-school-1', name: 'Comprehensive Madrasah Curriculum', price: 79, currency: 'USD', interval: 'month' },
      ],
      paymentGateways: [
        { id: 'stripe', name: 'Stripe', enabled: true },
        { id: 'paystack', name: 'Paystack', enabled: true },
      ],
      settings: {
        subscriptionTier: 'starter',
        subscriptionStatus: 'active',
        maxStudents: 100,
        maxTeachers: 5,
      },
    },
  ];

  const createdTenants: Record<string, any> = {};

  for (const tenantData of demoTenants) {
    const tenant = await prisma.tenant.upsert({
      where: { subdomain: tenantData.subdomain },
      update: {
        name: tenantData.name,
        niche: tenantData.niche,
        brandColor: tenantData.brandColor,
        pricingPlans: tenantData.pricingPlans,
        paymentGateways: tenantData.paymentGateways,
        settings: tenantData.settings,
      },
      create: tenantData,
    });
    createdTenants[tenantData.subdomain] = tenant;
    console.log(`✅ Tenant seeded: ${tenant.name} (${tenant.subdomain}.ankabit.app)`);
  }

  // 2. Seed Master SuperAdmin User
  const hashedPassword = await bcrypt.hash('superadmin123', 10);
  const platformTenant = createdTenants['platform'];

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@ankabit.app' },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: 'superadmin@ankabit.app',
      passwordHash: hashedPassword,
      name: 'Master SuperAdmin',
      role: 'superadmin',
      tenantId: platformTenant.id,
    },
  });
  console.log('✅ SuperAdmin user seeded:', superAdmin.email);

  // 3. Seed Demo Academy Admin & Sheikh Users
  const alFurqan = createdTenants['al-furqan'];
  if (alFurqan) {
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@alfurqan.edu' },
      update: { passwordHash: hashedPassword },
      create: {
        email: 'admin@alfurqan.edu',
        passwordHash: hashedPassword,
        name: 'Ustadh Ahmad (Principal)',
        role: 'admin',
        tenantId: alFurqan.id,
      },
    });

    const teacherUser = await prisma.user.upsert({
      where: { email: 'sheikh@alfurqan.edu' },
      update: { passwordHash: hashedPassword },
      create: {
        email: 'sheikh@alfurqan.edu',
        passwordHash: hashedPassword,
        name: 'Sheikh Tariq Al-Madani',
        role: 'teacher',
        tenantId: alFurqan.id,
      },
    });

    const studentUser = await prisma.user.upsert({
      where: { email: 'student@alfurqan.edu' },
      update: { passwordHash: hashedPassword },
      create: {
        email: 'student@alfurqan.edu',
        passwordHash: hashedPassword,
        name: 'Zayd Ibn Harith',
        role: 'student',
        tenantId: alFurqan.id,
      },
    });

    console.log('✅ Al-Furqan Demo Users seeded (admin, sheikh, student).');
  }

  console.log('🎉 Enterprise Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
