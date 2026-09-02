import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function generateLiveKitToken(roomName: string, participantName: string, isHost: boolean = false) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://hifz-hyyxyaf8.livekit.cloud';

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit API key or Secret not configured in environment variables');
  }

  // Generate JWT access token for LiveKit SFU
  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
    ttl: '4h',
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: Boolean(isHost),
  });

  const jwt = await token.toJwt();

  return {
    token: jwt,
    url: livekitUrl,
    wsUrl: livekitUrl,
    roomName,
    participantName,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('room') || searchParams.get('roomName');
    const participantName = searchParams.get('username') || searchParams.get('participantName') || `user-${Math.floor(Math.random() * 1000)}`;
    const isHost = searchParams.get('isHost') === 'true';

    if (!roomName) {
      return NextResponse.json(
        { error: 'room parameter is required' },
        { status: 400 }
      );
    }

    const result = await generateLiveKitToken(roomName, participantName, isHost);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating LiveKit token (GET):', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create LiveKit token' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const roomName = body.roomName || body.room;
    const participantName = body.participantName || body.username;
    const isHost = Boolean(body.isHost);

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'roomName and participantName are required' },
        { status: 400 }
      );
    }

    const result = await generateLiveKitToken(roomName, participantName, isHost);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating LiveKit token (POST):', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create LiveKit token' },
      { status: 500 }
    );
  }
}
