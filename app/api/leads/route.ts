import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '../../../src/server/services/leadsService';
import { apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';
import { prisma } from '../../../src/lib/prisma';
import { redisClient } from '../../../src/lib/redis';

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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-client';
    const rateCheck = await redisClient.checkRateLimit(`lead_submit:${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return apiError('Too many enrollment submissions. Please wait a minute before trying again.', 429);
    }

    const body = await request.json();
    const email = body.email || body.contactEmail;
    const studentName = body.studentName || body.name;

    if (!email && !studentName) {
      return apiError('Applicant name or contact email is required', 400);
    }

    if (!body.tenantId) {
      return apiError('tenantId is required for enrollment', 400);
    }

    // Resolve authoritative tuition fee from tenant pricing plans (prevent price poisoning)
    let authoritativeTuition = 65;
    let authoritativePlanName = body.planName || body.selectedPlanName || 'Standard Track';

    if (process.env.DATABASE_URL) {
      const cleanSub = body.tenantId.replace(/^tenant-/, '');
      const tenant = await prisma.tenant.findFirst({
        where: {
          OR: [
            { id: body.tenantId },
            { id: `tenant-${cleanSub}` },
            { subdomain: cleanSub },
            { subdomain: body.tenantId },
          ],
        },
      });

      if (tenant && Array.isArray(tenant.pricingPlans) && tenant.pricingPlans.length > 0) {
        const plan = (tenant.pricingPlans as any[]).find(
          (p) => p.id === body.selectedPlanId || p.id === body.planId || p.name === body.selectedPlanName
        ) || tenant.pricingPlans[0];

        if (plan && plan.priceMonthly) {
          authoritativeTuition = Number(plan.priceMonthly);
          authoritativePlanName = plan.name;
        }
      }
    }

    // Sanitize applicant payload: prevent forgery of payment, admission status, and fee amount
    const sanitizedPayload = {
      ...body,
      status: 'New',
      paymentStatus: 'Pending',
      tuitionAmount: authoritativeTuition,
      planName: authoritativePlanName,
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

    // Tenant isolation: verify lead belongs to the administrator's tenant
    if (authUser.role !== 'superadmin') {
      const existing = await prisma.lead.findUnique({
        where: { id },
        select: { id: true, tenantId: true },
      });

      if (!existing) {
        return apiError('Lead not found', 404);
      }

      if (existing.tenantId !== authUser.tenantId) {
        return apiError('Forbidden: Cannot modify admissions leads from another academy.', 403);
      }
    }

    const updated = await LeadsService.updateLead(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return handleApiError(error);
  }
}
