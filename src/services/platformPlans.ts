import {
  PlatformSubscriptionPlan,
  PlatformMetrics,
  PlatformTenantStats,
  PlatformSubscriber,
  SuperAdminGatewaySettings,
  SuperAdminUser,
  SuperAdminInfrastructureSettings,
  SuperAdminPaymentSettings,
} from '../types/superAdmin';

export const DEFAULT_PLATFORM_PLANS: PlatformSubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    slug: 'free',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'USD',
    period: 'forever',
    description: 'Ideal for trial institutions and getting started with basic digital tools.',
    badge: 'Free Tier',
    studentCapacity: 15,
    teacherSeats: 1,
    allowPlatformEmailSharing: false,
    allowPlatformWhatsAppSharing: false,
    features: [
      'Up to 15 Active Students',
      '1 Teacher Seat',
      'Subdomain (*.ankabit.app)',
      'Basic Page & Form Builder',
      'Custom Email/WhatsApp Gateway (Dedicated)',
      'Basic Overview KPI Numbers',
    ],
    featureFlags: {
      customDomain: false,
      liveWebRTC: false,
      whiteboard: false,
      aiPageBuilder: false,
      multiBranch: false,
      customIjazahCertificate: false,
      admissionsCRM: false,
      forumCommunity: false,
      formBuilderResponses: true,
      automationsWorkflows: false,
      platformEmailProvided: false,
      platformWhatsAppProvided: false,
    },
  },
  {
    id: 'qari',
    name: 'Independent Qari',
    slug: 'qari',
    priceMonthly: 29,
    priceYearly: 290,
    currency: 'USD',
    period: '/ month',
    description: 'For private Quran instructors, independent tutors, and solo madrasahs.',
    badge: 'Qari Solo',
    studentCapacity: 50,
    teacherSeats: 2,
    allowPlatformEmailSharing: false,
    allowPlatformWhatsAppSharing: false,
    features: [
      'Up to 50 Active Students',
      '2 Teacher Seats',
      'Subdomain (*.ankabit.app)',
      'Audio Homework Looper & Recorder',
      'Custom Merchant Gateways (Stripe / Moyasar)',
      'Dedicated Email/WhatsApp Credentials',
      'Standard Admissions CRM',
      'Community & LMS Forum',
    ],
    featureFlags: {
      customDomain: false,
      liveWebRTC: false,
      whiteboard: false,
      aiPageBuilder: false,
      multiBranch: false,
      customIjazahCertificate: false,
      admissionsCRM: true,
      forumCommunity: true,
      formBuilderResponses: true,
      automationsWorkflows: false,
      platformEmailProvided: false,
      platformWhatsAppProvided: false,
    },
  },
  {
    id: 'growth',
    name: 'Madrasah Growth',
    slug: 'growth',
    priceMonthly: 79,
    priceYearly: 790,
    currency: 'USD',
    period: '/ month',
    description: 'For established academies needing custom domains, Live WebRTC halaqahs, and automations.',
    badge: 'Most Popular',
    isPopular: true,
    studentCapacity: 350,
    teacherSeats: 10,
    allowPlatformEmailSharing: true,
    allowPlatformWhatsAppSharing: false,
    features: [
      'Up to 350 Active Students',
      '10 Teacher Seats',
      'Custom Domain (e.g. academy.com)',
      'Platform Shared Email Delivery (Included)',
      'Full Interactive Analytics & Growth Charts',
      'Live WebRTC Classroom & Whiteboard',
      'Multiple Merchant Gateways (Stripe, Moyasar, Flutterwave)',
      'Visual Page Builder & AI Templates',
      'Automations & Zapier Workflows',
    ],
    featureFlags: {
      customDomain: true,
      liveWebRTC: true,
      whiteboard: true,
      aiPageBuilder: true,
      multiBranch: false,
      customIjazahCertificate: false,
      admissionsCRM: true,
      forumCommunity: true,
      formBuilderResponses: true,
      automationsWorkflows: true,
      platformEmailProvided: true,
      platformWhatsAppProvided: false,
    },
  },
  {
    id: 'enterprise',
    name: 'Global Enterprise',
    slug: 'enterprise',
    priceMonthly: 199,
    priceYearly: 1990,
    currency: 'USD',
    period: '/ month',
    description: 'For multi-branch networks and international institutes with unlimited student capacity.',
    badge: 'Enterprise VIP',
    studentCapacity: 99999,
    teacherSeats: 999,
    allowPlatformEmailSharing: true,
    allowPlatformWhatsAppSharing: true,
    features: [
      'Unlimited Active Students',
      'Unlimited Teacher & Staff Seats',
      'Platform Shared Email & WhatsApp Included',
      'Option to Use Dedicated Custom Gateways',
      'Multi-Branch Campuses & Sub-Accounts',
      'Custom Sanad Ijazah Certificate Builder',
      'Dedicated SFU Live Video Bandwidth',
      'Priority 24/7 SLA Support',
      'Full API Access & Webhooks',
    ],
    featureFlags: {
      customDomain: true,
      liveWebRTC: true,
      whiteboard: true,
      aiPageBuilder: true,
      multiBranch: true,
      customIjazahCertificate: true,
      admissionsCRM: true,
      forumCommunity: true,
      formBuilderResponses: true,
      automationsWorkflows: true,
      platformEmailProvided: true,
      platformWhatsAppProvided: true,
    },
  },
];

const STORAGE_KEY_PLANS = 'techmadrasah_platform_plans';

export const getStoredPlatformPlans = (): PlatformSubscriptionPlan[] => {
  if (typeof window === 'undefined') return DEFAULT_PLATFORM_PLANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading platform plans from localStorage:', e);
  }
  return DEFAULT_PLATFORM_PLANS;
};

export const savePlatformPlans = (plans: PlatformSubscriptionPlan[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.warn('Error saving platform plans to localStorage:', e);
  }
};

export const MOCK_PLATFORM_TENANTS: PlatformTenantStats[] = [
  {
    id: 'tenant-1',
    name: 'Al-Furqan Quranic Academy',
    subdomain: 'al-furqan',
    customDomain: 'alfurqan-academy.com',
    niche: 'Quran & Tajweed',
    planId: 'growth',
    planName: 'Madrasah Growth',
    status: 'active',
    ownerName: 'Sheikh Tariq Al-Mansoor',
    ownerEmail: 'director@alfurqan-academy.com',
    studentsCount: 248,
    coursesCount: 14,
    totalRevenue: 18450,
    currency: 'USD',
    createdAt: '2026-01-15',
    lastActiveAt: 'Just now',
  },
  {
    id: 'tenant-2',
    name: 'Bayyinah Institute London',
    subdomain: 'bayyinah',
    customDomain: 'bayyinahlondon.co.uk',
    niche: 'Arabic & Quranic Studies',
    planId: 'enterprise',
    planName: 'Global Enterprise',
    status: 'active',
    ownerName: 'Ustadh Omar Farooq',
    ownerEmail: 'admissions@bayyinahlondon.co.uk',
    studentsCount: 680,
    coursesCount: 22,
    totalRevenue: 54200,
    currency: 'GBP',
    createdAt: '2025-11-20',
    lastActiveAt: '10 mins ago',
  },
  {
    id: 'tenant-3',
    name: 'Darul Quran Virtual Madrasah',
    subdomain: 'darul-quran',
    niche: 'Hifz Revision',
    planId: 'qari',
    planName: 'Independent Qari',
    status: 'active',
    ownerName: 'Qari Bilal Hashmi',
    ownerEmail: 'bilal@darulquran.net',
    studentsCount: 42,
    coursesCount: 4,
    totalRevenue: 3200,
    currency: 'USD',
    createdAt: '2026-03-02',
    lastActiveAt: '1 hour ago',
  },
  {
    id: 'tenant-4',
    name: 'Noor Al-Huda Academy',
    subdomain: 'noor-huda',
    niche: 'Tajweed & Ijazah',
    planId: 'free',
    planName: 'Free Starter',
    status: 'trial',
    ownerName: 'Dr. Fatima Zahra',
    ownerEmail: 'fatima@noorhuda.org',
    studentsCount: 12,
    coursesCount: 2,
    totalRevenue: 0,
    currency: 'USD',
    createdAt: '2026-08-28',
    lastActiveAt: '3 hours ago',
  },
  {
    id: 'tenant-5',
    name: 'Al-Iman Youth Institute',
    subdomain: 'al-iman',
    niche: 'Islamic Essentials & Quran',
    planId: 'growth',
    planName: 'Madrasah Growth',
    status: 'active',
    ownerName: 'Imam Youssef Zidan',
    ownerEmail: 'youssef@al-iman.ca',
    studentsCount: 185,
    coursesCount: 9,
    totalRevenue: 12600,
    currency: 'CAD',
    createdAt: '2026-02-10',
    lastActiveAt: 'Yesterday',
  },
];

export const MOCK_PLATFORM_SUBSCRIBERS: PlatformSubscriber[] = [
  {
    id: 'sub-101',
    tenantId: 'tenant-1',
    academyName: 'Al-Furqan Quranic Academy',
    subdomain: 'al-furqan',
    planId: 'growth',
    planName: 'Madrasah Growth',
    amount: 79,
    currency: 'USD',
    billingCycle: 'monthly',
    status: 'active',
    paymentGateway: 'stripe',
    currentPeriodEnd: '2026-09-15',
    createdAt: '2026-01-15',
  },
  {
    id: 'sub-102',
    tenantId: 'tenant-2',
    academyName: 'Bayyinah Institute London',
    subdomain: 'bayyinah',
    planId: 'enterprise',
    planName: 'Global Enterprise',
    amount: 1990,
    currency: 'USD',
    billingCycle: 'yearly',
    status: 'active',
    paymentGateway: 'stripe',
    currentPeriodEnd: '2026-11-20',
    createdAt: '2025-11-20',
  },
  {
    id: 'sub-103',
    tenantId: 'tenant-3',
    academyName: 'Darul Quran Virtual Madrasah',
    subdomain: 'darul-quran',
    planId: 'qari',
    planName: 'Independent Qari',
    amount: 29,
    currency: 'USD',
    billingCycle: 'monthly',
    status: 'active',
    paymentGateway: 'moyasar',
    currentPeriodEnd: '2026-10-02',
    createdAt: '2026-03-02',
  },
  {
    id: 'sub-104',
    tenantId: 'tenant-5',
    academyName: 'Al-Iman Youth Institute',
    subdomain: 'al-iman',
    planId: 'growth',
    planName: 'Madrasah Growth',
    amount: 79,
    currency: 'USD',
    billingCycle: 'monthly',
    status: 'active',
    paymentGateway: 'stripe',
    currentPeriodEnd: '2026-09-10',
    createdAt: '2026-02-10',
  },
];

export const DEFAULT_SUPERADMIN_GATEWAYS: SuperAdminGatewaySettings = {
  email: {
    enabled: true,
    provider: 'smtp',
    fromEmail: 'noreply@ankabit.app',
    fromName: 'Ankabit Platform & Academy OS',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUser: 'apikey',
    smtpPass: 'SG.demo_platform_key',
    smtpSecure: true,
    apiKey: '',
  },
  whatsapp: {
    enabled: true,
    provider: 'cloud_api',
    fromNumber: '+1 (800) 555-0199',
    phoneNumberId: '109283746592019',
    accessToken: 'EAAQ...demo_meta_token',
    wabaId: 'waba_9918273645',
  },
};

const STORAGE_KEY_GATEWAYS = 'ankabit_superadmin_gateways';

export const getStoredSuperAdminGateways = (): SuperAdminGatewaySettings => {
  if (typeof window === 'undefined') return DEFAULT_SUPERADMIN_GATEWAYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GATEWAYS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.whatsapp) return parsed;
    }
  } catch (e) {
    console.warn('Error reading superadmin gateways:', e);
  }
  return DEFAULT_SUPERADMIN_GATEWAYS;
};

export const saveSuperAdminGateways = (gateways: SuperAdminGatewaySettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_GATEWAYS, JSON.stringify(gateways));
  } catch (e) {
    console.warn('Error saving superadmin gateways:', e);
  }
};

export const DEFAULT_SUPERADMIN_USERS: SuperAdminUser[] = [
  {
    id: 'usr-super-1',
    name: 'Master Platform Admin',
    email: 'superadmin@ankabit.app',
    role: 'superadmin' as const,
    status: 'active' as const,
    lastActiveAt: 'Active Now',
    createdAt: '2025-10-01',
  },
  {
    id: 'usr-super-2',
    name: 'Sarah Jennings',
    email: 'sarah.support@ankabit.app',
    role: 'platform_support' as const,
    status: 'active' as const,
    lastActiveAt: '15 mins ago',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr-super-3',
    name: 'Karim Mansour',
    email: 'karim.finance@ankabit.app',
    role: 'billing_manager' as const,
    status: 'active' as const,
    lastActiveAt: '2 hours ago',
    createdAt: '2026-02-18',
  },
  {
    id: 'usr-super-4',
    name: 'DevOps Lead Engineer',
    email: 'infra@ankabit.app',
    role: 'infrastructure_lead' as const,
    status: 'active' as const,
    lastActiveAt: '1 day ago',
    createdAt: '2025-11-05',
  },
];

const STORAGE_KEY_SUPER_USERS = 'ankabit_superadmin_users';

export const getStoredSuperAdminUsers = () => {
  if (typeof window === 'undefined') return DEFAULT_SUPERADMIN_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPER_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading superadmin users:', e);
  }
  return DEFAULT_SUPERADMIN_USERS;
};

export const saveSuperAdminUsers = (users: SuperAdminUser[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SUPER_USERS, JSON.stringify(users));
  } catch (e) {
    console.warn('Error saving superadmin users:', e);
  }
};

export const DEFAULT_SUPERADMIN_INFRASTRUCTURE: SuperAdminInfrastructureSettings = {
  database: {
    provider: 'postgres_cluster',
    host: 'db-cluster.internal.ankabit.app',
    port: 5432,
    databaseName: 'ankabit_lms_production',
    username: 'ankabit_admin',
    password: '',
    connectionString: 'postgresql://ankabit_admin:[PASSWORD]@db-cluster.internal.ankabit.app:5432/ankabit_lms_production?sslmode=require&connection_limit=25',
    directUrl: 'postgresql://ankabit_admin:[PASSWORD]@db-cluster.internal.ankabit.app:5432/ankabit_lms_production',
    ssl: true,
    poolSize: 25,
    maxOverflow: 10,
    poolTimeoutSeconds: 30,
  },
  redis: {
    enabled: true,
    host: 'redis-cache.internal.ankabit.app',
    port: 6379,
    password: '',
    tls: true,
    clusterMode: false,
    connectionString: 'rediss://:[PASSWORD]@redis-cache.internal.ankabit.app:6379',
  },
  livekit: {
    serverUrl: 'wss://livekit.ankabit.app',
    apiKey: '',
    apiSecret: '',
    region: 'eu-central-1',
  },
  storage: {
    provider: 'cloudflare_r2',
    bucketName: 'ankabit-quran-assets',
    region: 'auto',
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: 'https://r2.cloudflarestorage.com',
    publicCdnUrl: 'https://cdn.ankabit.app',
    forcePathStyle: false,
  },
};

const STORAGE_KEY_INFRASTRUCTURE = 'ankabit_superadmin_infrastructure';

export const getStoredSuperAdminInfrastructure = (): SuperAdminInfrastructureSettings => {
  if (typeof window === 'undefined') return DEFAULT_SUPERADMIN_INFRASTRUCTURE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INFRASTRUCTURE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.database && parsed.livekit && parsed.storage) return parsed;
    }
  } catch (e) {
    console.warn('Error reading superadmin infrastructure:', e);
  }
  return DEFAULT_SUPERADMIN_INFRASTRUCTURE;
};

export const saveSuperAdminInfrastructure = (infra: SuperAdminInfrastructureSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_INFRASTRUCTURE, JSON.stringify(infra));
  } catch (e) {
    console.warn('Error saving superadmin infrastructure:', e);
  }
};

export const DEFAULT_SUPERADMIN_PAYMENT_GATEWAYS: SuperAdminPaymentSettings = {
  stripe: {
    enabled: true,
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
  },
  moyasar: {
    enabled: true,
    publishableKey: '',
    secretKey: '',
  },
  flutterwave: {
    enabled: false,
    publicKey: '',
    secretKey: '',
    encryptionKey: '',
  },
  paypal: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    mode: 'live',
  },
};

const STORAGE_KEY_PAYMENTS = 'ankabit_superadmin_payment_gateways';

export const getStoredSuperAdminPaymentGateways = (): SuperAdminPaymentSettings => {
  if (typeof window === 'undefined') return DEFAULT_SUPERADMIN_PAYMENT_GATEWAYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.stripe && parsed.moyasar) return parsed;
    }
  } catch (e) {
    console.warn('Error reading superadmin payments:', e);
  }
  return DEFAULT_SUPERADMIN_PAYMENT_GATEWAYS;
};

export const saveSuperAdminPaymentGateways = (payments: SuperAdminPaymentSettings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  } catch (e) {
    console.warn('Error saving superadmin payments:', e);
  }
};


