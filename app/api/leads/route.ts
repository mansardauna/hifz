import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '../../../src/server/services/leadsService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { getAuthenticatedUser } from '../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(request);
    const { searchParams } = new URL(request.url);
    const requestedTenantId = searchParams.get('tenantId') || authUser?.tenantId;

    if (!requestedTenantId) {
      return apiError('tenantId is required', 400);
    }

    const effectiveTenantId =
      authUser?.role === 'superadmin' ? (searchParams.get('tenantId') || authUser.tenantId) : requestedTenantId;

    const leads = await LeadsService.getLeads(effectiveTenantId);
    return NextResponse.json(leads);
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email || body.contactEmail;
    const studentName = body.studentName || body.name;

    if (!email && !studentName) {
      return apiError('Applicant name or contact email is required', 400);
    }

    const lead = await LeadsService.createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(request);
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
