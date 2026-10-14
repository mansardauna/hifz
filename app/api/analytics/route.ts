import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '../../../src/server/services/analyticsService';
import { handleApiError, apiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/analytics
 * Requires staff authentication and verifies tenant boundary.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin', 'teacher']);
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || authUser.tenantId;

    if (!tenantId) {
      return apiError('tenantId parameter is required', 400);
    }

    if (authUser.role !== 'superadmin') {
      const cleanSub = authUser.tenantSubdomain?.toLowerCase() || '';
      const isOwner =
        authUser.tenantId === tenantId ||
        tenantId === `tenant-${cleanSub}` ||
        tenantId === cleanSub;

      if (!isOwner) {
        return apiError('Forbidden: You can only view analytics for your assigned academy', 403);
      }
    }

    const analytics = await AnalyticsService.getAnalytics(tenantId);
    return NextResponse.json(analytics);
  } catch (error: any) {
    return handleApiError(error);
  }
}
