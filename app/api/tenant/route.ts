import { NextRequest, NextResponse } from 'next/server';
import { TenantService } from '../../../src/server/services/tenantService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain') || request.headers.get('x-subdomain') || undefined;
    const customDomain = searchParams.get('customDomain') || undefined;

    const tenant = await TenantService.getBySubdomainOrDomain(subdomain, customDomain);
    if (!tenant) {
      return apiError('Tenant not found', 404);
    }
    return NextResponse.json(tenant);
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenant = await TenantService.createTenant(body);
    return NextResponse.json(tenant, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Assert authenticated administrator privileges before allowing configuration modifications
    requireAuth(request, ['admin', 'superadmin']);

    const body = await request.json();
    const targetKey = body.id || body.currentSubdomain || body.subdomain;

    if (!targetKey) {
      return apiError('Tenant ID or Subdomain is required for update', 400);
    }

    const { id, currentSubdomain, ...updates } = body;
    const updated = await TenantService.updateTenant(targetKey, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return handleApiError(error);
  }
}
