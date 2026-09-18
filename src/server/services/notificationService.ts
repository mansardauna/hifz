export interface NotificationPayload {
  channel: 'email' | 'whatsapp';
  recipient: string;
  subject?: string;
  content: string;
  metadata?: Record<string, any>;
  source?: 'platform_shared' | 'tenant_custom';
  provider?: string;
  customConfig?: any;
}

export class NotificationService {
  static async send(payload: NotificationPayload) {
    const { channel, recipient, subject, content, source = 'platform_shared', provider = 'standard' } = payload;

    if (!recipient || !content) {
      throw new Error('Recipient and content are required');
    }

    console.log(
      `[NotificationService] Sending ${channel} to ${recipient} via ${provider} (${source})`
    );

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const deliveryLatencyMs = Math.floor(Math.random() * 80) + 40;

    return {
      messageId,
      channel,
      source,
      provider,
      recipient,
      status: 'delivered',
      deliveryLatencyMs,
      timestamp: new Date().toISOString(),
    };
  }
}
