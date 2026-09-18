import { AccessToken } from 'livekit-server-sdk';

export interface LiveKitTokenParams {
  roomName: string;
  participantName: string;
  isHost?: boolean;
}

export class LiveKitService {
  static async generateToken(params: LiveKitTokenParams) {
    const { roomName, participantName, isHost = false } = params;
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey_hifz_2026';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret_hifz_production_webrtc_cloud_2026_super_key';
    const livekitUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://hifz-hyyxyaf8.livekit.cloud';

    try {
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
        isFallback: !process.env.LIVEKIT_API_KEY,
      };
    } catch (err: any) {
      console.warn('LiveKit token fallback:', err);
      return {
        token: `dev-token-${Date.now()}-${participantName}`,
        url: livekitUrl,
        wsUrl: livekitUrl,
        roomName,
        participantName,
        isFallback: true,
      };
    }
  }
}
