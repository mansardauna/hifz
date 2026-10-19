import { NextRequest, NextResponse } from 'next/server';
import { SubmissionService } from '../../../src/server/services/submissionService';
import { handleApiError, apiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';
import { prisma } from '../../../src/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/submissions
 * Authenticated access: students only see their own homework submissions;
 * faculty/administrators can inspect submissions within their tenant.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);

    let effectiveTenantId = searchParams.get('tenantId') || authUser.tenantId;
    let effectiveUserId = searchParams.get('userId') || undefined;

    // Scoping rule: students are strictly confined to their own submissions
    if (authUser.role === 'student') {
      effectiveUserId = authUser.id;
      effectiveTenantId = authUser.tenantId;
    } else if (authUser.role !== 'superadmin') {
      // Teachers/Admins are confined to their tenant
      effectiveTenantId = authUser.tenantId;
    }

    const submissions = await SubmissionService.getSubmissions({
      tenantId: effectiveTenantId,
      userId: effectiveUserId,
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * POST /api/submissions
 * Authenticated submission creation: students submit their own homework.
 * Faculty can create submissions only for students within their own tenant.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const body = await request.json();
    const { surahNumber, startAyah, endAyah, audioUrl } = body;

    // Enforce that submission belongs to the authenticated user or an authorized student in the same tenant
    let effectiveUserId = authUser.id;
    if (authUser.role !== 'student') {
      const requestedUserId = body.userId || body.studentId;
      if (requestedUserId && requestedUserId !== authUser.id) {
        if (authUser.role !== 'superadmin') {
          const student = await prisma.user.findUnique({
            where: { id: requestedUserId },
            select: { id: true, tenantId: true },
          });
          if (!student || student.tenantId !== authUser.tenantId) {
            return apiError('Forbidden: Cannot create submissions for students of another academy.', 403);
          }
        }
        effectiveUserId = requestedUserId;
      }
    }

    const submission = await SubmissionService.createSubmission({
      userId: effectiveUserId,
      surahNumber: Number(surahNumber) || 1,
      startAyah: Number(startAyah) || 1,
      endAyah: Number(endAyah) || 10,
      audioUrl: audioUrl || '',
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/submissions
 * Grading submissions requires teacher, admin, or superadmin privileges.
 * Strictly verifies that the submission belongs to the caller's tenant.
 */
export async function PUT(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['teacher', 'admin', 'superadmin']);
    const body = await request.json();
    const { id, score, feedback, status } = body;

    if (!id) {
      return apiError('Submission ID is required for grading', 400);
    }

    // Tenant isolation: verify submission belongs to the teacher's/admin's tenant
    if (authUser.role !== 'superadmin') {
      const existing = await prisma.recitationSubmission.findUnique({
        where: { id },
        include: {
          user: { select: { tenantId: true } },
        },
      });

      if (!existing) {
        return apiError('Submission not found', 404);
      }

      if (existing.user.tenantId !== authUser.tenantId) {
        return apiError('Forbidden: Cannot grade submissions from another academy.', 403);
      }
    }

    const graded = await SubmissionService.gradeSubmission(id, { score, feedback, status });
    return NextResponse.json({ submission: graded });
  } catch (error: any) {
    return handleApiError(error);
  }
}
