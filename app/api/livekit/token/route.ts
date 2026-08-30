import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { roomName, participantName, isHost } = await request.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'roomName and participantName are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.hifz.app';

    // Generate JWT access token for LiveKit Cloud SFU
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

    return NextResponse.json({
      token: jwt,
      url: livekitUrl,
      roomName,
      participantName,
    });
  } catch (error: any) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create LiveKit token' },
      { status: 500 }
    );
  }
}
