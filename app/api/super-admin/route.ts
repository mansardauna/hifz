import { NextRequest, NextResponse } from 'next/server';
import { SuperAdminService } from '../../../src/server/services/superAdminService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await SuperAdminService.getDashboardData();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, plans, tenantId, status, planId } = body;

    if (action === 'update_plans') {
      return NextResponse.json({
        success: true,
        message: 'Platform subscription plans updated successfully',
        plans,
      });
    }

    if (action === 'update_tenant_status' && tenantId) {
      const updated = await SuperAdminService.updateTenantStatus(tenantId, status, planId);
      return NextResponse.json({ success: true, tenant: updated });
    }

    return apiError('Unknown superadmin action', 400);
  } catch (error: any) {
    return handleApiError(error);
  }
}
