import { EmailProviderType, WhatsAppProviderType } from './index';

export interface PlatformPlanFeature {
  id: string;
  name: string;
  enabled: boolean;
  isNew?: boolean;
}

export interface PlatformSubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  period: string;
  description: string;
  badge: string;
  isPopular?: boolean;
  studentCapacity: number;
  teacherSeats: number;
  allowPlatformEmailSharing: boolean;
  allowPlatformWhatsAppSharing: boolean;
  features: string[];
  featureFlags: {
    customDomain: boolean;
    liveWebRTC: boolean;
    whiteboard: boolean;
    aiPageBuilder: boolean;
    multiBranch: boolean;
    customIjazahCertificate: boolean;
    admissionsCRM: boolean;
    forumCommunity: boolean;
    formBuilderResponses: boolean;
    automationsWorkflows: boolean;
    platformEmailProvided: boolean;
    platformWhatsAppProvided: boolean;
  };
}

export type SuperAdminRole = 'superadmin' | 'platform_support' | 'billing_manager' | 'infrastructure_lead';

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: SuperAdminRole;
  status: 'active' | 'suspended';
  lastActiveAt?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface SuperAdminGatewaySettings {
  email: {
    enabled: boolean;
    provider: EmailProviderType;
    fromEmail: string;
    fromName: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    smtpSecure?: boolean;
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    apiKey?: string;
    awsRegion?: string;
    awsAccessKey?: string;
    awsSecretKey?: string;
  };
  whatsapp: {
    enabled: boolean;
    provider: WhatsAppProviderType;
    fromNumber?: string;
    phoneNumberId?: string;
    accessToken?: string;
    wabaId?: string;
    accountSid?: string;
    authToken?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioFromNumber?: string;
    baseUrl?: string;
    infobipBaseUrl?: string;
    infobipApiKey?: string;
    apiKey?: string;
  };
}

export interface PlatformTenantStats {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  niche: string;
  planId: string;
  planName: string;
  status: 'active' | 'trial' | 'suspended';
  ownerName: string;
  ownerEmail: string;
  studentsCount: number;
  coursesCount: number;
  totalRevenue: number;
  currency: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface PlatformSubscriber {
  id: string;
  tenantId: string;
  academyName: string;
  subdomain: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'canceled';
  paymentGateway: 'stripe' | 'moyasar' | 'bank_transfer';
  currentPeriodEnd: string;
  createdAt: string;
}

export interface PlatformMetrics {
  totalAcademies: number;
  activeSubscribers: number;
  totalStudents: number;
  totalTeachers: number;
  mrr: number;
  arr: number;
  growthRate: number;
  churnRate: number;
  systemHealth: {
    status: 'healthy' | 'degraded' | 'down';
    dbLatencyMs: number;
    livekitSFUStatus: 'online' | 'offline';
    storageUsedGb: number;
  };
}

export interface SuperAdminInfrastructureSettings {
  database: {
    provider: 'supabase' | 'custom_postgres';
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceRoleKey: string;
    connectionString: string;
    ssl: boolean;
    poolSize: number;
  };
  livekit: {
    serverUrl: string;
    apiKey: string;
    apiSecret: string;
    region: string;
  };
  storage: {
    provider: 's3' | 'cloudflare_r2' | 'supabase_storage';
    bucketName: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    publicCdnUrl: string;
  };
}

export interface SuperAdminPaymentSettings {
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  moyasar: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
  };
  flutterwave: {
    enabled: boolean;
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
  };
}

