import { NextRequest, NextResponse } from 'next/server';
import { TenantService } from '../../../src/server/services/tenantService';
import { apiSuccess, apiError, handleApiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain') || 'al-furqan';
    const customDomain = searchParams.get('customDomain') || undefined;

    const tenant = await TenantService.getBySubdomainOrDomain(subdomain, customDomain);
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
    const body = await request.json();
    const { id, subdomain, ...updates } = body;
    const targetKey = id || subdomain;

    if (!targetKey) {
      return apiError('Tenant ID or Subdomain is required for update', 400);
    }

    const updated = await TenantService.updateTenant(targetKey, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return handleApiError(error);
  }
}
