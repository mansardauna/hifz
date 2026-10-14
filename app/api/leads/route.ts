import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '../../../src/server/services/leadsService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/leads
 * Requires staff/admin authentication and validates tenant boundary to prevent PII exposure.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin', 'teacher']);
    const { searchParams } = new URL(request.url);
    const requestedTenantId = searchParams.get('tenantId') || authUser.tenantId;

    if (!requestedTenantId) {
      return apiError('tenantId is required', 400);
    }

    // Tenant Isolation Check
    if (authUser.role !== 'superadmin') {
      const cleanSub = authUser.tenantSubdomain?.toLowerCase() || '';
      const isAllowed =
        authUser.tenantId === requestedTenantId ||
        requestedTenantId === `tenant-${cleanSub}` ||
        requestedTenantId === cleanSub;

      if (!isAllowed) {
        return apiError('Forbidden: You can only access applicants of your assigned academy', 403);
      }
    }

    const leads = await LeadsService.getLeads(requestedTenantId);
    return NextResponse.json(leads);
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * POST /api/leads
 * Public admission application endpoint.
 * Enforces 'Pending' paymentStatus and 'Applicant' status to prevent unauthenticated admission forging.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email || body.contactEmail;
    const studentName = body.studentName || body.name;

    if (!email && !studentName) {
      return apiError('Applicant name or contact email is required', 400);
    }

    if (!body.tenantId) {
      return apiError('tenantId is required for enrollment', 400);
    }

    // Sanitize applicant payload: prevent forgery of payment and admission status
    const sanitizedPayload = {
      ...body,
      status: 'Applicant',
      paymentStatus: 'Pending',
    };

    const lead = await LeadsService.createLead(sanitizedPayload);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/leads
 * Requires admin authentication to update lead status, notes, or payment status.
 */
export async function PUT(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin']);
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
