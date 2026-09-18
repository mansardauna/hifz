import { NextRequest, NextResponse } from 'next/server';
import { LiveKitService } from '../../../../src/server/services/livekitService';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('room') || searchParams.get('roomName');
    const participantName =
      searchParams.get('username') ||
      searchParams.get('participantName') ||
      `user-${Math.floor(Math.random() * 1000)}`;
    const isHost = searchParams.get('isHost') === 'true';

    if (!roomName) {
      return apiError('room parameter is required', 400);
    }

    const result = await LiveKitService.generateToken({ roomName, participantName, isHost });
    return NextResponse.json(result);
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const roomName = body.roomName || body.room;
    const participantName = body.participantName || body.username;
    const isHost = Boolean(body.isHost);

    if (!roomName || !participantName) {
      return apiError('roomName and participantName are required', 400);
    }

    const result = await LiveKitService.generateToken({ roomName, participantName, isHost });
    return NextResponse.json(result);
  } catch (error: any) {
    return handleApiError(error);
  }
}
