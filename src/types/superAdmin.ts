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
