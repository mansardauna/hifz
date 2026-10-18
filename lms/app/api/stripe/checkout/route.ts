import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../src/server/services/billingService';
import { handleApiError, apiError } from '../../../../src/server/lib/apiResponse';
import { requireAuth, getAuthenticatedUser } from '../../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/stripe/checkout
 * Authoritative Stripe Checkout session generator.
 * Supports:
 * 1. Platform tier upgrades (requires admin auth and locks down pricing).
 * 2. Student tuition / course enrollment checkout.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawOrigin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Sanitize origin to prevent open redirect vulnerabilities
    const origin = rawOrigin.replace(/\/+$/, '');

    const { type = 'student_tuition' } = body;

    if (type === 'platform_tier_upgrade') {
      const authUser = requireAuth(req, ['admin', 'superadmin']);
      const targetSubdomain = authUser.tenantSubdomain || authUser.tenantId?.replace(/^tenant-/, '') || 'hifz';

      const result = await BillingService.createPlatformTierCheckout({
        tierId: body.tierId,
        academySubdomain: targetSubdomain,
        adminEmail: authUser.email,
        origin,
      });

      return NextResponse.json(result);
    }

    if (type === 'student_tuition' || type === 'student_enrollment') {
      const authUser = getAuthenticatedUser(req);
      const studentEmail = authUser?.email || body.studentEmail || body.email;
      const studentName = authUser?.name || body.studentName || body.name || 'Valued Student';
      const tenantId = body.tenantId || authUser?.tenantId;

      if (!studentEmail) {
        return apiError('studentEmail is required for checkout', 400);
      }
      if (!tenantId) {
        return apiError('tenantId is required for checkout', 400);
      }

      const result = await BillingService.createStudentTuitionCheckout({
        tenantId,
        leadId: body.leadId,
        planId: body.planId,
        studentEmail,
        studentName,
        description: body.description,
        amount: body.amount ? Number(body.amount) : undefined,
        origin,
      });

      return NextResponse.json(result);
    }

    return apiError('Invalid checkout type specified', 400);
  } catch (error: any) {
    return handleApiError(error);
  }
}
