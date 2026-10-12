import { NextRequest, NextResponse } from 'next/server';
import { SubmissionService } from '../../../src/server/services/submissionService';
import { handleApiError, apiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || undefined;
    const userId = searchParams.get('userId') || undefined;

    const submissions = await SubmissionService.getSubmissions({ tenantId, userId });
    return NextResponse.json({ submissions });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, studentId, surahNumber, startAyah, endAyah, audioUrl } = body;

    const effectiveUserId = userId || studentId;
    if (!effectiveUserId) {
      return apiError('User ID or studentId is required for submission', 400);
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

export async function PUT(request: NextRequest) {
  try {
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
