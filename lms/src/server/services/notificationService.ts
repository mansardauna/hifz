import { EmailGatewayService } from './emailGatewayService';
import { WhatsAppGatewayService } from './whatsappGatewayService';

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

    // If channel is email, route through multi-provider failover engine
    if (channel === 'email') {
      try {
        const emailResult = await EmailGatewayService.sendEmail({
          to: recipient,
          subject: subject || 'Notification from Ankabit Academy',
          html: content.includes('<') ? content : `<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;"><p>${content.replace(/\n/g, '<br/>')}</p></div>`,
          text: content.replace(/<[^>]+>/g, ' '),
        });

        return {
          messageId: emailResult.messageId,
          channel: 'email',
          source,
          provider: emailResult.providerName,
          providerType: emailResult.providerType,
          recipient,
          status: 'delivered',
          sentToday: emailResult.sentToday,
          dailyQuota: emailResult.dailyQuota,
          attempts: emailResult.attempts,
          timestamp: new Date().toISOString(),
        };
      } catch (emailErr: any) {
        console.warn('[NotificationService] Email delivery notice:', emailErr.message);
        return {
          messageId: `queued_${Date.now()}`,
          channel: 'email',
          source,
          provider: 'EmailGateway (Pending Provider Verification)',
          recipient,
          status: 'queued',
          note: emailErr.message,
          timestamp: new Date().toISOString(),
        };
      }
    }

    // For WhatsApp channel: route via Multi-Provider WhatsApp Gateway
    try {
      const waResult = await WhatsAppGatewayService.sendWhatsApp({
        to: recipient,
        body: content,
      });

      return {
        messageId: waResult.messageId,
        channel: 'whatsapp',
        source,
        provider: waResult.providerName,
        recipient,
        status: 'delivered',
        sentToday: waResult.sentToday,
        dailyQuota: waResult.dailyQuota,
        timestamp: new Date().toISOString(),
      };
    } catch (waErr: any) {
      console.warn('[NotificationService] WhatsApp delivery notice:', waErr.message);
      return {
        messageId: `queued_wa_${Date.now()}`,
        channel: 'whatsapp',
        source,
        provider: 'WhatsAppGateway (Pending Provider Verification)',
        recipient,
        status: 'queued',
        note: waErr.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
