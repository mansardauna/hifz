import { NextRequest, NextResponse } from 'next/server';
import { SuperAdminService } from '../../../src/server/services/superAdminService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';

import { prisma } from '../../../src/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Assert authenticated SuperAdmin access
    try {
      requireAuth(request, ['superadmin']);
    } catch (authError) {
      // If no superadmin user exists yet in the database, indicate setup is required
      try {
        const superAdminExists = await prisma.user.findFirst({
          where: { role: 'superadmin' },
          select: { id: true },
        });
        if (!superAdminExists) {
          return NextResponse.json(
            {
              success: false,
              needsSetup: true,
              redirectTo: '/setup',
              error: 'Platform setup required: No SuperAdmin account exists. Please visit /setup to initialize the platform.',
              message: 'Platform setup required: Please navigate to /setup to initialize the platform.',
              timestamp: new Date().toISOString(),
            },
            { status: 401 }
          );
        }
      } catch (_e) {}
      throw authError;
    }

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
    // Assert authenticated SuperAdmin access
    requireAuth(request, ['superadmin']);

    const body = await request.json();
    const { action, plans, tenantId, status, planId } = body;

    if (action === 'update_plans') {
      return NextResponse.json({
        success: true,
        message: 'Platform subscription plans updated successfully',
        plans,
      });
    }

    if ((action === 'update_tenant_status' || action === 'update_tenant_plan') && tenantId) {
      const updated = await SuperAdminService.updateTenantStatus(tenantId, status, planId, body.planSlug);
      return NextResponse.json({ success: true, tenant: updated });
    }

    return apiError('Unknown superadmin action', 400);
  } catch (error: any) {
    return handleApiError(error);
  }
}
