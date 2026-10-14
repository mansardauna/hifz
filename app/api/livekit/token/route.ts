import { NextRequest, NextResponse } from 'next/server';
import { LiveKitService } from '../../../../src/server/services/livekitService';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/livekit/token
 * Generates an authenticated WebRTC token for halaqah and classroom sessions.
 * Enforces session authentication and verifies host role privileges.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const rawRoom = searchParams.get('room') || searchParams.get('roomName');
    const requestedHost = searchParams.get('isHost') === 'true';

    if (!rawRoom) {
      return apiError('room parameter is required', 400);
    }

    const roomName = rawRoom.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!roomName) {
      return apiError('Invalid room identifier', 400);
    }

    // Only verified instructors, academy admins, or superadmins can claim Host privileges
    const isHost =
      requestedHost && ['teacher', 'admin', 'superadmin'].includes(authUser.role);

    // Bind identity strictly to authenticated user session to eliminate identity spoofing
    const participantName = authUser.name || authUser.email || `User-${authUser.id}`;

    const result = await LiveKitService.generateToken({
      roomName,
      participantName,
      isHost,
      role: (authUser.role as any) || 'student',
      metadata: {
        userId: authUser.id,
        tenantId: authUser.tenantId,
        email: authUser.email,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * POST /api/livekit/token
 * Authenticated token generation via JSON body payload.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const body = await request.json();
    const rawRoom = body.roomName || body.room;
    const requestedHost = Boolean(body.isHost);

    if (!rawRoom) {
      return apiError('roomName is required', 400);
    }

    const roomName = String(rawRoom).replace(/[^a-zA-Z0-9_-]/g, '');
    if (!roomName) {
      return apiError('Invalid room identifier', 400);
    }

    const isHost =
      requestedHost && ['teacher', 'admin', 'superadmin'].includes(authUser.role);

    const participantName = authUser.name || authUser.email || `User-${authUser.id}`;

    const result = await LiveKitService.generateToken({
      roomName,
      participantName,
      isHost,
      role: (authUser.role as any) || 'student',
      metadata: {
        userId: authUser.id,
        tenantId: authUser.tenantId,
        email: authUser.email,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return handleApiError(error);
  }
}

