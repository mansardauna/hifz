import { NextRequest, NextResponse } from 'next/server';
import { TenantService } from '../../../src/server/services/tenantService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { requireAuth, getAuthenticatedUser } from '../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Sanitizes sensitive gateway secrets from public tenant payload.
 */
function sanitizeTenantConfig(tenant: any, isAuthorizedAdmin: boolean) {
  if (!tenant) return tenant;
  const sanitized = { ...tenant };

  if (Array.isArray(sanitized.paymentGateways)) {
    sanitized.paymentGateways = sanitized.paymentGateways.map((g: any) => {
      if (isAuthorizedAdmin) {
        // Mask secret keys for admin UI display
        return {
          ...g,
          secretKey: g.secretKey ? (g.secretKey.length > 8 ? `${g.secretKey.slice(0, 4)}••••••••${g.secretKey.slice(-4)}` : '••••••••') : '',
          webhookSecret: g.webhookSecret ? '••••••••' : '',
        };
      }
      // Public view: strictly strip secret keys
      const { secretKey, webhookSecret, ...publicGateway } = g;
      return publicGateway;
    });
  }

  // Strip sensitive platform credentials from settings
  if (sanitized.settings && sanitized.settings.integrations) {
    const cleanIntegrations = { ...sanitized.settings.integrations };
    if (!isAuthorizedAdmin) {
      delete cleanIntegrations.stripe?.secretKey;
      delete cleanIntegrations.stripe?.webhookSecret;
      delete cleanIntegrations.moyasar?.secretKey;
      delete cleanIntegrations.database?.url;
      delete cleanIntegrations.livekit?.apiSecret;
    }
    sanitized.settings = { ...sanitized.settings, integrations: cleanIntegrations };
  }

  return sanitized;
}

/**
 * GET /api/tenant
 * Fetches tenant branding and public settings without exposing gateway secret keys.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain') || request.headers.get('x-subdomain') || undefined;
    const customDomain = searchParams.get('customDomain') || undefined;

    const tenant = await TenantService.getBySubdomainOrDomain(subdomain, customDomain);
    if (!tenant) {
      return apiError('Tenant not found', 404);
    }

    const authUser = getAuthenticatedUser(request);
    const cleanSub = tenant.subdomain?.toLowerCase() || '';
    const isAuthorizedAdmin = Boolean(
      authUser &&
      (authUser.role === 'superadmin' ||
        (authUser.role === 'admin' &&
          (authUser.tenantId === tenant.id || authUser.tenantSubdomain?.toLowerCase() === cleanSub)))
    );

    const safeTenant = sanitizeTenantConfig(tenant, isAuthorizedAdmin);
    return NextResponse.json(safeTenant);
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * POST /api/tenant
 * Creation of new tenant academies requires platform superadmin authorization.
 */
export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ['superadmin']);
    const body = await request.json();
    const tenant = await TenantService.createTenant(body);
    return NextResponse.json(tenant, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/tenant
 * Updates tenant settings. Enforces ownership check to prevent cross-tenant IDOR.
 */
export async function PUT(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin']);
    const body = await request.json();
    const targetKey = body.id || body.currentSubdomain || body.subdomain;

    if (!targetKey) {
      return apiError('Tenant ID or Subdomain is required for update', 400);
    }

    // Ownership Verification: verify that non-superadmins can only modify their own tenant
    if (authUser.role !== 'superadmin') {
      const cleanSub = authUser.tenantSubdomain?.toLowerCase() || '';
      const isOwner =
        authUser.tenantId === targetKey ||
        targetKey === `tenant-${cleanSub}` ||
        targetKey === cleanSub;

      if (!isOwner) {
        return apiError('Forbidden: You can only update settings for your assigned academy', 403);
      }
    }

    const { id, currentSubdomain, ...updates } = body;
    const updated = await TenantService.updateTenant(targetKey, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return handleApiError(error);
  }
}
