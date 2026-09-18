import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '../../../../src/server/services/notificationService';
import { apiSuccess, apiError, handleApiError } from '../../../../src/server/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, recipient, subject, content, source, provider, metadata, customConfig } = body;

    if (!recipient || !content) {
      return apiError('Recipient and content are required', 400);
    }

    const result = await NotificationService.send({
      channel: channel || 'email',
      recipient,
      subject,
      content,
      source,
      provider,
      metadata,
      customConfig,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
