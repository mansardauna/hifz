import { AccessToken } from 'livekit-server-sdk';

export interface LiveKitTokenParams {
  roomName: string;
  participantName: string;
  isHost?: boolean;
  role?: 'teacher' | 'student' | 'admin' | 'reviewer';
  region?: 'me-south-1' | 'eu-central-1' | 'us-east-1' | 'auto';
  metadata?: Record<string, any>;
}

// Global SFU Edge Media Nodes Map
const REGIONAL_MEDIA_ENDPOINTS: Record<string, string> = {
  'me-south-1': process.env.LIVEKIT_URL_ME || 'wss://me-media.ankabit.app',
  'eu-central-1': process.env.LIVEKIT_URL_EU || 'wss://eu-media.ankabit.app',
  'us-east-1': process.env.LIVEKIT_URL_US || 'wss://us-media.ankabit.app',
};

export class LiveKitService {
  static async generateToken(params: LiveKitTokenParams) {
    const {
      roomName,
      participantName,
      isHost = false,
      role = isHost ? 'teacher' : 'student',
      region = 'auto',
      metadata = {},
    } = params;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('LiveKit WebRTC SFU credentials (LIVEKIT_API_KEY, LIVEKIT_API_SECRET) are not configured.');
      }
      throw new Error('LiveKit credentials missing. Please set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in your environment.');
    }

    // Select optimal SFU media node based on requested region
    const defaultUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://hifz-hyyxyaf8.livekit.cloud';
    const livekitUrl = (region !== 'auto' && REGIONAL_MEDIA_ENDPOINTS[region]) ? REGIONAL_MEDIA_ENDPOINTS[region] : defaultUrl;

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
      metadata: JSON.stringify({ role, ...metadata }),
      ttl: '6h',
    });

    // Role-based capabilities
    const isTeacherOrAdmin = isHost || role === 'teacher' || role === 'admin';

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: isTeacherOrAdmin,
      roomRecord: isTeacherOrAdmin,
    });

    const jwt = await token.toJwt();

    return {
      token: jwt,
      url: livekitUrl,
      wsUrl: livekitUrl,
      roomName,
      participantName,
      role,
      region,
      isFallback: false,
    };
  }
}
