import { redisClient } from '../lib/redis';

const PROCESSED_EVENT_TTL = 60 * 60 * 24 * 30; // 30 days deduplication window

export const webhookService = {
  // Check if webhook event has already been processed (Idempotency Guard)
  async isEventProcessed(gateway: string, eventId: string): Promise<boolean> {
    const key = `webhook:processed:${gateway}:${eventId}`;
    const exists = await redisClient.getJSON<boolean>(key);
    return Boolean(exists);
  },

  // Mark event as processed with idempotency lease
  async markEventProcessed(gateway: string, eventId: string): Promise<void> {
    const key = `webhook:processed:${gateway}:${eventId}`;
    await redisClient.setJSON(key, true, PROCESSED_EVENT_TTL);
  },

  // Process standard payment receipt webhook
  async handlePaymentSuccess(
    gateway: 'stripe' | 'moyasar' | 'flutterwave' | 'paystack' | 'bank_transfer',
    eventId: string,
    data: {
      tenantId: string;
      studentEmail: string;
      studentName: string;
      amount: number;
      currency: string;
      planName: string;
      transactionId: string;
    }
  ): Promise<{ success: boolean; duplicate: boolean }> {
    const alreadyProcessed = await this.isEventProcessed(gateway, eventId);
    if (alreadyProcessed) {
      console.log(`[Webhook:${gateway}] Duplicate event ${eventId} ignored.`);
      return { success: true, duplicate: true };
    }

    console.log(`[Webhook:${gateway}] Processing payment ${data.transactionId} for ${data.studentEmail} (${data.amount} ${data.currency})`);

    // Mark event as processed in idempotency store
    await this.markEventProcessed(gateway, eventId);

    return { success: true, duplicate: false };
  },
};
