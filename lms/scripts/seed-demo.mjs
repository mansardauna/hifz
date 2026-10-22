import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
const password = 'password';
const demoSubdomain = 'liwan-academy';

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);
  const platform = await prisma.tenant.upsert({
    where: { subdomain: 'platform' },
    update: { name: 'Liwan LMS Platform' },
    create: {
      name: 'Liwan LMS Platform',
      subdomain: 'platform',
      niche: 'multi_academy',
      brandColor: '#0f766e',
    },
  });

  const oldDemoTenant = await prisma.tenant.findUnique({ where: { subdomain: 'demo' } });
  const namedDemoTenant = await prisma.tenant.findUnique({ where: { subdomain: demoSubdomain } });
  if (oldDemoTenant && !namedDemoTenant) {
    await prisma.tenant.update({
      where: { id: oldDemoTenant.id },
      data: { subdomain: demoSubdomain },
    });
  }

  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: demoSubdomain },
    update: {
      name: 'Liwan Demo Academy',
      niche: 'multi_academy',
      tagline: 'Explore every learning workspace in one demo academy.',
      description: 'A prepared demonstration workspace for Quran, coding, and general school learning.',
      pricingPlans: [
        { id: 'demo-starter', name: 'Starter', priceMonthly: 49, currency: 'USD' },
        { id: 'demo-growth', name: 'Growth', priceMonthly: 99, currency: 'USD' },
      ],
      settings: { demo: true, allowPublicSignup: true },
    },
    create: {
      name: 'Liwan Demo Academy',
      subdomain: demoSubdomain,
      niche: 'multi_academy',
      brandColor: '#0f766e',
      tagline: 'Explore every learning workspace in one demo academy.',
      description: 'A prepared demonstration workspace for Quran, coding, and general school learning.',
      pricingPlans: [
        { id: 'demo-starter', name: 'Starter', priceMonthly: 49, currency: 'USD' },
        { id: 'demo-growth', name: 'Growth', priceMonthly: 99, currency: 'USD' },
      ],
      settings: { demo: true, allowPublicSignup: true },
    },
  });

  const secondaryTenants = [
    {
      name: 'Northstar Coding Academy',
      subdomain: 'northstar',
      niche: 'coding',
      brandColor: '#2563eb',
      tagline: 'Build practical software skills with guided projects.',
      course: 'Full-Stack Web Development',
    },
    {
      name: 'Liwan Community School',
      subdomain: 'liwan-school',
      niche: 'islamic_school',
      brandColor: '#7c3aed',
      tagline: 'A connected workspace for modern school learning.',
      course: 'Study Skills and Personal Growth',
    },
  ];

  const secondaryRecords = [];
  for (const item of secondaryTenants) {
    const tenant = await prisma.tenant.upsert({
      where: { subdomain: item.subdomain },
      update: {
        name: item.name,
        niche: item.niche,
        brandColor: item.brandColor,
        tagline: item.tagline,
        settings: { demo: true },
      },
      create: {
        name: item.name,
        subdomain: item.subdomain,
        niche: item.niche,
        brandColor: item.brandColor,
        tagline: item.tagline,
        settings: { demo: true },
      },
    });
    secondaryRecords.push({ tenant, course: item.course });
  }

  const accounts = [
    { role: 'superadmin', name: 'Liwan Platform Administrator', tenantId: platform.id },
    { role: 'admin', name: 'Liwan Academy Administrator', tenantId: demoTenant.id },
    { role: 'teacher', name: 'Liwan Demo Teacher', tenantId: demoTenant.id },
    { role: 'student', name: 'Liwan Demo Student', tenantId: demoTenant.id },
  ];

  for (const account of accounts) {
    await prisma.user.upsert({
      where: { email: `${account.role}@${domain}` },
      update: {
        name: account.name,
        passwordHash,
        role: account.role,
        tenantId: account.tenantId,
      },
      create: {
        email: `${account.role}@${domain}`,
        name: account.name,
        passwordHash,
        role: account.role,
        tenantId: account.tenantId,
      },
    });
  }

  await prisma.course.deleteMany({ where: { tenantId: demoTenant.id } });
  await prisma.course.createMany({
    data: [
      {
        title: 'Quran Foundations and Tajweed',
        description: 'A guided introduction to recitation, memorization, and Tajweed practice.',
        instructor: 'Liwan Demo Teacher',
        level: 'Beginner',
        category: 'Quran',
        lessons: [{ title: 'Makharij basics' }, { title: 'Surah Al-Fatihah review' }],
        tenantId: demoTenant.id,
      },
      {
        title: 'Web Development Fundamentals',
        description: 'HTML, CSS, JavaScript, and practical browser-based projects.',
        instructor: 'Liwan Demo Teacher',
        level: 'Beginner',
        category: 'Coding',
        lessons: [{ title: 'Build your first page' }, { title: 'Interactive browser components' }],
        tenantId: demoTenant.id,
      },
      {
        title: 'Study Skills and Personal Growth',
        description: 'Practical learning habits, planning, and reflective progress tracking.',
        instructor: 'Liwan Demo Teacher',
        level: 'All levels',
        category: 'General Education',
        lessons: [{ title: 'Plan a learning week' }, { title: 'Reflect and improve' }],
        tenantId: demoTenant.id,
      },
    ],
  });

  await prisma.lead.deleteMany({ where: { tenantId: demoTenant.id } });
  await prisma.lead.createMany({
    data: [
      {
        studentName: 'Amina Yusuf',
        email: `student@${domain}`,
        phone: '+1 555 0100',
        country: 'Nigeria',
        courseInterest: 'Quran Foundations and Tajweed',
        status: 'Admitted',
        paymentStatus: 'Paid',
        tuitionAmount: 49,
        planName: 'Starter',
        tenantId: demoTenant.id,
      },
      {
        studentName: 'Daniel Okafor',
        email: `teacher@${domain}`,
        phone: '+1 555 0101',
        country: 'Canada',
        courseInterest: 'Web Development Fundamentals',
        status: 'Under Review',
        paymentStatus: 'Pending',
        tuitionAmount: 99,
        planName: 'Growth',
        tenantId: demoTenant.id,
      },
      {
        studentName: 'Fatima Bello',
        email: 'fatima.bello@example.com',
        phone: '+1 555 0102',
        country: 'United Kingdom',
        courseInterest: 'Study Skills and Personal Growth',
        status: 'Interview',
        paymentStatus: 'Pending',
        tuitionAmount: 49,
        planName: 'Starter',
        tenantId: demoTenant.id,
      },
      {
        studentName: 'Yusuf Ibrahim',
        email: 'yusuf.ibrahim@example.com',
        phone: '+1 555 0103',
        country: 'United States',
        courseInterest: 'Quran Foundations and Tajweed',
        status: 'New',
        paymentStatus: 'Pending',
        tuitionAmount: 49,
        planName: 'Starter',
        tenantId: demoTenant.id,
      },
      {
        studentName: 'Chiamaka Nwosu',
        email: 'chiamaka.nwosu@example.com',
        phone: '+1 555 0104',
        country: 'Nigeria',
        courseInterest: 'Web Development Fundamentals',
        status: 'Admitted',
        paymentStatus: 'Paid',
        tuitionAmount: 99,
        planName: 'Growth',
        tenantId: demoTenant.id,
      },
      {
        studentName: 'Omar Hassan',
        email: 'omar.hassan@example.com',
        phone: '+1 555 0105',
        country: 'United Arab Emirates',
        courseInterest: 'Quran Foundations and Tajweed',
        status: 'Under Review',
        paymentStatus: 'Pending',
        tuitionAmount: 49,
        planName: 'Starter',
        tenantId: demoTenant.id,
      },
    ],
  });

  for (const { tenant, course } of secondaryRecords) {
    await prisma.user.upsert({
      where: { email: `admin@${tenant.subdomain}.${domain}` },
      update: { passwordHash, role: 'admin', tenantId: tenant.id },
      create: {
        email: `admin@${tenant.subdomain}.${domain}`,
        name: `${tenant.name} Administrator`,
        passwordHash,
        role: 'admin',
        tenantId: tenant.id,
      },
    });
    await prisma.course.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.course.create({
      data: {
        title: course,
        description: `A prepared ${tenant.name} demonstration course.`,
        instructor: 'Liwan Demo Teacher',
        level: 'Beginner',
        category: tenant.niche,
        lessons: [{ title: 'Welcome and orientation' }, { title: 'First practical activity' }],
        tenantId: tenant.id,
      },
    });
  }

  const demoTeacher = await prisma.user.findUnique({ where: { email: `teacher@${domain}` } });
  const demoStudent = await prisma.user.findUnique({ where: { email: `student@${domain}` } });
  const demoLeads = await prisma.lead.findMany({ where: { tenantId: demoTenant.id } });

  await prisma.paymentTransaction.deleteMany({ where: { tenantId: demoTenant.id } });
  await prisma.paymentTransaction.createMany({
    data: [49, 99, 49, 49, 99, 49, 99].map((amount, index) => ({
      amount,
      currency: 'USD',
      gateway: index % 3 === 0 ? 'stripe' : index % 3 === 1 ? 'paystack' : 'bank_transfer',
      status: index === 5 ? 'pending' : 'succeeded',
      transactionId: `demo-liwan-${index + 1}`,
      tenantId: demoTenant.id,
      leadId: demoLeads[index % demoLeads.length]?.id,
      createdAt: new Date(Date.now() - (index + 1) * 4 * 24 * 60 * 60 * 1000),
    })),
  });

  await prisma.liveSession.deleteMany({ where: { tenantId: demoTenant.id } });
  await prisma.liveSession.createMany({
    data: [
      { title: 'Tajweed Office Hours', roomName: 'liwan-demo-tajweed', hostId: demoTeacher?.id, isLive: false, scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), tenantId: demoTenant.id },
      { title: 'Coding Lab: Build Your First Page', roomName: 'liwan-demo-coding', hostId: demoTeacher?.id, isLive: true, scheduledAt: new Date(), tenantId: demoTenant.id },
      { title: 'Weekly Student Progress Clinic', roomName: 'liwan-demo-progress', hostId: demoTeacher?.id, isLive: false, scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), tenantId: demoTenant.id },
    ],
  });

  if (demoStudent) {
    await prisma.recitationSubmission.deleteMany({ where: { userId: demoStudent.id } });
    await prisma.recitationSubmission.createMany({
      data: [
        { surahNumber: 1, startAyah: 1, endAyah: 7, audioUrl: '/demo/recitations/al-fatihah.mp3', status: 'Mastered', score: 92, feedback: 'Clear recitation and strong articulation.', userId: demoStudent.id },
        { surahNumber: 2, startAyah: 1, endAyah: 5, audioUrl: '/demo/recitations/al-baqarah-1.mp3', status: 'Pending Review', userId: demoStudent.id },
        { surahNumber: 36, startAyah: 1, endAyah: 12, audioUrl: '/demo/recitations/yasin-1.mp3', status: 'Revision Needed', score: 74, feedback: 'Review elongation rules before resubmitting.', userId: demoStudent.id },
      ],
    });
  }

  console.log(`Demo seeded for ${domain}. Password for all demo accounts: ${password}`);
}

main()
  .catch((error) => {
    console.error('Demo seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
