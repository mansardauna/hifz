import { TenantConfig } from '../types';
import { PlatformSubscriptionPlan } from '../types/superAdmin';
import { getStoredPlatformPlans, getStoredSuperAdminGateways } from './platformPlans';

export interface NotificationResolutionResult {
  canSend: boolean;
  usingSource: 'tenant_custom' | 'platform_shared' | 'none';
  providerName: string;
  providerType?: string;
  reason?: string;
  requiresOwnCredentials?: boolean;
  activeConfig?: any;
}

export function getProviderDisplayName(providerType?: string): string {
  switch (providerType) {
    case 'smtp':
      return 'Custom SMTP Server';
    case 'resend':
      return 'Resend API';
    case 'sendgrid':
      return 'SendGrid';
    case 'postmark':
      return 'Postmark';
    case 'ses':
      return 'Amazon SES';
    case 'cloud_api':
      return 'Meta WhatsApp Cloud API';
    case 'twilio':
      return 'Twilio WhatsApp';
    case 'infobip':
      return 'Infobip WhatsApp';
    default:
      return providerType ? providerType.toUpperCase() : 'Standard Gateway';
  }
}

export function resolveNotificationChannel(
  channel: 'email' | 'whatsapp',
  tenant: TenantConfig,
  currentPlan?: PlatformSubscriptionPlan
): NotificationResolutionResult {
  // Find current plan if not explicitly passed
  let plan = currentPlan;
  if (!plan) {
    const allPlans = getStoredPlatformPlans();
    plan = allPlans.find((p) => p.id === tenant.subscriptionPlan) || allPlans[0];
  }

  // 1. Check if tenant has provided custom credentials for this channel
  if (channel === 'email') {
    const customEmail = tenant.emailGatewayConfig;
    if (
      customEmail &&
      customEmail.enabled &&
      (customEmail.apiKey || customEmail.smtpHost || customEmail.awsAccessKey)
    ) {
      return {
        canSend: true,
        usingSource: 'tenant_custom',
        providerName: `Dedicated ${getProviderDisplayName(customEmail.provider)}`,
        providerType: customEmail.provider,
        activeConfig: customEmail,
      };
    }
  } else if (channel === 'whatsapp') {
    const customWA = tenant.whatsappGatewayConfig;
    if (
      customWA &&
      customWA.enabled &&
      (customWA.accessToken || customWA.accountSid || customWA.apiKey)
    ) {
      return {
        canSend: true,
        usingSource: 'tenant_custom',
        providerName: `Dedicated ${getProviderDisplayName(customWA.provider)}`,
        providerType: customWA.provider,
        activeConfig: customWA,
      };
    }
  }

  // 2. Tenant has NOT provided custom credentials. Check if their subscription plan allows SuperAdmin platform sharing
  const allowsSharing =
    channel === 'email'
      ? !!(plan?.allowPlatformEmailSharing ?? plan?.featureFlags?.platformEmailProvided)
      : !!(plan?.allowPlatformWhatsAppSharing ?? plan?.featureFlags?.platformWhatsAppProvided);

  if (allowsSharing) {
    const superAdminGateways = getStoredSuperAdminGateways();
    const gateway = channel === 'email' ? superAdminGateways.email : superAdminGateways.whatsapp;
    return {
      canSend: true,
      usingSource: 'platform_shared',
      providerName: 'Ankabit Platform Infrastructure (Super Admin Pooled)',
      providerType: gateway?.provider,
      activeConfig: gateway,
    };
  }

  // 3. Plan does NOT allow platform sharing and tenant has not provided credentials
  const planName = plan?.name || 'Current Tier';
  return {
    canSend: false,
    usingSource: 'none',
    providerName: 'None Configured',
    requiresOwnCredentials: true,
    reason:
      channel === 'email'
        ? `Your current plan (${planName}) does not include platform-provided email credits. Please configure your custom email gateway (SMTP, Resend, SendGrid, etc.) or upgrade to Madrasah Growth.`
        : `Your current plan (${planName}) does not include platform-provided WhatsApp delivery. Please configure your WhatsApp Cloud API / Twilio gateway or upgrade to Enterprise.`,
  };
}
