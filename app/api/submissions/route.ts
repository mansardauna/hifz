import { NextRequest, NextResponse } from 'next/server';
import { SubmissionService } from '../../../src/server/services/submissionService';
import { handleApiError, apiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';

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
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const body = await request.json();
    const { surahNumber, startAyah, endAyah, audioUrl } = body;

    // Enforce that submission belongs to the authenticated user
    const effectiveUserId = authUser.role === 'student' ? authUser.id : (body.userId || body.studentId || authUser.id);

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
 */
export async function PUT(request: NextRequest) {
  try {
    requireAuth(request, ['teacher', 'admin', 'superadmin']);
    const body = await request.json();
    const { id, score, feedback, status } = body;

    if (!id) {
      return apiError('Submission ID is required for grading', 400);
    }

    const graded = await SubmissionService.gradeSubmission(id, { score, feedback, status });
    return NextResponse.json({ submission: graded });
  } catch (error: any) {
    return handleApiError(error);
  }
}
