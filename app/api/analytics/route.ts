import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '../../../src/server/services/analyticsService';
import { handleApiError, apiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'tenant-hifz';

    if (!tenantId) {
      return apiError('tenantId parameter is required', 400);
    }

    const analytics = await AnalyticsService.getAnalytics(tenantId);
    return NextResponse.json(analytics);
  } catch (error: any) {
    return handleApiError(error);
  }
}
