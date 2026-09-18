import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../src/server/services/billingService';
import { handleApiError } from '../../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const result = await BillingService.createStripeCheckoutSession({
      ...body,
      origin,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return handleApiError(error);
  }
}
