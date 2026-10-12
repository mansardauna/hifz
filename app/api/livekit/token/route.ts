import { NextRequest, NextResponse } from 'next/server';
import { LiveKitService } from '../../../../src/server/services/livekitService';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { getAuthenticatedUser } from '../../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('room') || searchParams.get('roomName');
    const requestedHost = searchParams.get('isHost') === 'true';

    if (!roomName) {
      return apiError('room parameter is required', 400);
    }

    const authUser = getAuthenticatedUser(request);
    // Only verified instructors, academy admins, or superadmins can claim Host privileges
    const isHost =
      requestedHost && Boolean(authUser && ['teacher', 'admin', 'superadmin'].includes(authUser.role));

    const participantName =
      authUser?.name ||
      searchParams.get('username') ||
      searchParams.get('participantName') ||
      `Student-${Math.floor(Math.random() * 1000)}`;

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
    const requestedHost = Boolean(body.isHost);

    if (!roomName) {
      return apiError('roomName is required', 400);
    }

    const authUser = getAuthenticatedUser(request);
    const isHost =
      requestedHost && Boolean(authUser && ['teacher', 'admin', 'superadmin'].includes(authUser.role));

    const participantName =
      authUser?.name || body.participantName || body.username || `Student-${Math.floor(Math.random() * 1000)}`;

    const result = await LiveKitService.generateToken({ roomName, participantName, isHost });
    return NextResponse.json(result);
  } catch (error: any) {
    return handleApiError(error);
  }
}
