import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '../../../src/server/services/leadsService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || undefined;

    const leads = await LeadsService.getLeads(tenantId);
    return NextResponse.json(leads);
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead = await LeadsService.createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return apiError('Lead ID is required for update', 400);
    }

    const updated = await LeadsService.updateLead(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return handleApiError(error);
  }
}
