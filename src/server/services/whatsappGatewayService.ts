import fs from 'fs';
import path from 'path';
import { WhatsAppEngineType, WhatsAppProviderConfig } from '../../types/superAdmin';

export interface SendWhatsAppPayload {
  to: string;
  body: string;
  templateName?: string;
  templateLanguage?: string;
  templateComponents?: any[];
  preferredProviderId?: string;
}

export interface SendWhatsAppAttempt {
  providerId: string;
  providerName: string;
  providerType: WhatsAppEngineType;
  status: 'success' | 'failed' | 'quota_exhausted' | 'rate_limited';
  error?: string;
  latencyMs?: number;
}

export interface SendWhatsAppResult {
  success: boolean;
  messageId: string;
  providerId: string;
  providerName: string;
  providerType: WhatsAppEngineType;
  attempts: SendWhatsAppAttempt[];
  sentToday: number;
  dailyQuota: number;
}

const STORAGE_FILE_PATH = path.join(process.cwd(), 'data', 'whatsapp_providers.json');

export const DEFAULT_WHATSAPP_PROVIDERS: WhatsAppProviderConfig[] = [
  {
    id: 'wa_meta_1',
    name: 'Meta Cloud API (Official)',
    type: 'cloud_api',
    enabled: true,
    priority: 1,
    dailyQuota: 250,
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'unverified',
    isVerified: false,
    fromNumber: '+1 (800) 555-0199',
    phoneNumberId: '109283746592019',
    accessToken: '',
    wabaId: 'waba_9918273645',
  },
  {
    id: 'wa_twilio_1',
    name: 'Twilio WhatsApp (Fallback 1)',
    type: 'twilio',
    enabled: false,
    priority: 2,
    dailyQuota: 100,
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'unverified',
    isVerified: false,
    fromNumber: '+14155238886',
    accountSid: '',
    authToken: '',
  },
  {
    id: 'wa_infobip_1',
    name: 'Infobip WhatsApp (Fallback 2)',
    type: 'infobip',
    enabled: false,
    priority: 3,
    dailyQuota: 100,
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'unverified',
    isVerified: false,
    fromNumber: '+447860099299',
    infobipBaseUrl: 'https://api.infobip.com',
    infobipApiKey: '',
  },
];

export class WhatsAppGatewayService {
  /**
   * Retrieves all configured WhatsApp providers, applying daily midnight resets if date has changed.
   */
  static getProviders(): WhatsAppProviderConfig[] {
    try {
      if (fs.existsSync(STORAGE_FILE_PATH)) {
        const raw = fs.readFileSync(STORAGE_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.checkAndResetDailyQuotas(parsed);
        }
      }
    } catch (err) {
      console.warn('[WhatsAppGatewayService] Failed to read stored providers, falling back to defaults:', err);
    }
    return this.checkAndResetDailyQuotas([...DEFAULT_WHATSAPP_PROVIDERS]);
  }

  /**
   * Persists providers list to data/whatsapp_providers.json
   */
  static saveProviders(providers: WhatsAppProviderConfig[]): void {
    try {
      const dir = path.dirname(STORAGE_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(providers, null, 2), 'utf-8');
    } catch (err) {
      console.error('[WhatsAppGatewayService] Failed to save providers:', err);
    }
  }

  /**
   * Reset daily quota counters on a new calendar day
   */
  static checkAndResetDailyQuotas(providers: WhatsAppProviderConfig[]): WhatsAppProviderConfig[] {
    const today = new Date().toISOString().split('T')[0];
    let modified = false;

    const updated = providers.map((p) => {
      if (p.lastResetDate !== today) {
        modified = true;
        return {
          ...p,
          sentToday: 0,
          lastResetDate: today,
          status: p.isVerified && p.enabled ? ('active' as const) : p.status === 'exhausted' ? ('inactive' as const) : p.status,
          lastError: null,
        };
      }
      return p;
    });

    if (modified) {
      this.saveProviders(updated);
    }
    return updated;
  }

  /**
   * Pre-Activation Health Check & Connection Test
   * Verifies credentials and connectivity BEFORE activating and routing traffic.
   */
  static async testProviderConnection(provider: WhatsAppProviderConfig): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // 1. Meta Cloud API (Official WhatsApp Business)
      if (provider.type === 'cloud_api') {
        const phoneId = provider.phoneNumberId?.trim();
        const token = provider.accessToken?.trim();

        if (!phoneId) {
          return { success: false, message: 'Meta Phone Number ID is required.' };
        }
        if (!token) {
          return { success: false, message: 'Meta Permanent System User Access Token is required.' };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
          const res = await fetch(
            `https://graph.facebook.com/v19.0/${phoneId}?fields=verified_name,code_verification_status,display_phone_number,quality_rating`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              signal: controller.signal,
            }
          );
          clearTimeout(timeout);

          const data = await res.json().catch(() => ({}));

          if (res.ok && data.display_phone_number) {
            return {
              success: true,
              message: `Meta Cloud API verified. Verified Name: "${data.verified_name || 'Verified'}", Display Number: ${data.display_phone_number}, Quality: ${data.quality_rating || 'GREEN'}.`,
              details: data,
            };
          } else {
            const errorMsg = data.error?.message || `HTTP ${res.status} ${res.statusText}`;
            return {
              success: false,
              message: `Meta Cloud API verification failed: ${errorMsg}`,
              details: data,
            };
          }
        } catch (fetchErr: any) {
          clearTimeout(timeout);
          return {
            success: false,
            message: `Connection timeout or network failure reaching Meta Graph API: ${fetchErr.message}`,
          };
        }
      }

      // 2. Twilio Programmable Messaging
      if (provider.type === 'twilio') {
        const sid = provider.accountSid?.trim();
        const token = provider.authToken?.trim();

        if (!sid) return { success: false, message: 'Twilio Account SID is required.' };
        if (!token) return { success: false, message: 'Twilio Auth Token is required.' };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
          const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');
          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
            method: 'GET',
            headers: {
              Authorization: authHeader,
            },
            signal: controller.signal,
          });
          clearTimeout(timeout);

          const data = await res.json().catch(() => ({}));

          if (res.ok && data.status === 'active') {
            return {
              success: true,
              message: `Twilio Account verified successfully. Friendly Name: "${data.friendly_name}", Status: ${data.status}.`,
              details: { sid: data.sid, status: data.status },
            };
          } else {
            return {
              success: false,
              message: `Twilio verification failed: ${data.message || res.statusText}`,
              details: data,
            };
          }
        } catch (fetchErr: any) {
          clearTimeout(timeout);
          return {
            success: false,
            message: `Connection error reaching Twilio API: ${fetchErr.message}`,
          };
        }
      }

      // 3. Infobip WhatsApp Business API
      if (provider.type === 'infobip') {
        const baseUrl = (provider.infobipBaseUrl?.trim() || 'https://api.infobip.com').replace(/\/$/, '');
        const apiKey = provider.infobipApiKey?.trim();

        if (!apiKey) return { success: false, message: 'Infobip API Key is required.' };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
          const res = await fetch(`${baseUrl}/account/1/balance`, {
            method: 'GET',
            headers: {
              Authorization: `App ${apiKey}`,
              Accept: 'application/json',
            },
            signal: controller.signal,
          });
          clearTimeout(timeout);

          const data = await res.json().catch(() => ({}));

          if (res.ok) {
            return {
              success: true,
              message: `Infobip API Key verified successfully. Balance: ${data.balance ?? 'Active'} ${data.currency ?? ''}.`,
              details: data,
            };
          } else {
            return {
              success: false,
              message: `Infobip verification failed: ${data.requestError?.serviceException?.text || res.statusText}`,
              details: data,
            };
          }
        } catch (fetchErr: any) {
          clearTimeout(timeout);
          return {
            success: false,
            message: `Connection error reaching Infobip API (${baseUrl}): ${fetchErr.message}`,
          };
        }
      }

      return { success: false, message: `Unsupported WhatsApp engine: ${provider.type}` };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'WhatsApp verification failed.',
      };
    }
  }

  /**
   * Dispatches WhatsApp message with priority-based auto-failover and daily quota limits.
   */
  static async sendWhatsApp(payload: SendWhatsAppPayload): Promise<SendWhatsAppResult> {
    const providers = this.getProviders();
    const attempts: SendWhatsAppAttempt[] = [];

    // Filter verified & enabled providers sorted by priority ascending
    const activeChain = providers
      .filter((p) => p.enabled && p.isVerified)
      .sort((a, b) => a.priority - b.priority);

    if (activeChain.length === 0) {
      throw new Error(
        'No active and verified WhatsApp providers configured. Please configure and run Test Connection in SuperAdmin before sending.'
      );
    }

    const cleanTo = payload.to.replace(/[^0-9+]/g, '');

    for (const provider of activeChain) {
      // 1. Quota Check
      if (provider.dailyQuota > 0 && provider.sentToday >= provider.dailyQuota) {
        console.warn(
          `[WhatsAppGatewayService] ${provider.name} reached daily quota (${provider.sentToday}/${provider.dailyQuota}). Auto-failing over...`
        );
        provider.status = 'exhausted';
        provider.lastError = `Daily quota reached (${provider.sentToday}/${provider.dailyQuota})`;
        attempts.push({
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: 'quota_exhausted',
          error: `Daily quota of ${provider.dailyQuota} conversations reached today.`,
        });
        continue;
      }

      // 2. Dispatch attempt
      const startTime = Date.now();
      try {
        let messageId = '';

        if (provider.type === 'cloud_api') {
          const res = await fetch(`https://graph.facebook.com/v19.0/${provider.phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${provider.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanTo,
              type: 'text',
              text: { preview_url: false, body: payload.body },
            }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            const errMsg = data.error?.message || `HTTP ${res.status}`;
            const isLimit = res.status === 429 || (data.error?.code && [80007, 131048, 131056].includes(data.error.code));
            if (isLimit) {
              provider.status = 'exhausted';
              provider.lastError = `Meta rate limit / quota exceeded: ${errMsg}`;
            }
            throw new Error(errMsg);
          }

          messageId = data.messages?.[0]?.id || `wa_meta_${Date.now()}`;
        } else if (provider.type === 'twilio') {
          const sid = provider.accountSid;
          const token = provider.authToken;
          const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');

          const params = new URLSearchParams();
          params.append('From', `whatsapp:${provider.fromNumber}`);
          params.append('To', cleanTo.startsWith('whatsapp:') ? cleanTo : `whatsapp:${cleanTo}`);
          params.append('Body', payload.body);

          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
            method: 'POST',
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            throw new Error(data.message || `Twilio HTTP ${res.status}`);
          }

          messageId = data.sid || `wa_twilio_${Date.now()}`;
        } else if (provider.type === 'infobip') {
          const baseUrl = (provider.infobipBaseUrl || 'https://api.infobip.com').replace(/\/$/, '');
          const res = await fetch(`${baseUrl}/whatsapp/1/message/text`, {
            method: 'POST',
            headers: {
              Authorization: `App ${provider.infobipApiKey}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              from: provider.fromNumber.replace(/[^0-9]/g, ''),
              to: cleanTo.replace(/[^0-9]/g, ''),
              content: { text: payload.body },
            }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            throw new Error(data.requestError?.serviceException?.text || `Infobip HTTP ${res.status}`);
          }

          messageId = data.messages?.[0]?.messageId || `wa_infobip_${Date.now()}`;
        }

        const latency = Date.now() - startTime;
        provider.sentToday += 1;
        provider.lastError = null;

        attempts.push({
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: 'success',
          latencyMs: latency,
        });

        this.saveProviders(providers);

        return {
          success: true,
          messageId,
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          attempts,
          sentToday: provider.sentToday,
          dailyQuota: provider.dailyQuota,
        };
      } catch (err: any) {
        const latency = Date.now() - startTime;
        console.warn(`[WhatsAppGatewayService] ${provider.name} failed (${err.message}). Trying next fallback...`);
        provider.lastError = err.message;
        attempts.push({
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: 'failed',
          error: err.message,
          latencyMs: latency,
        });
      }
    }

    this.saveProviders(providers);

    throw new Error(
      `All configured WhatsApp providers failed or daily quotas exhausted. Attempts: ${attempts
        .map((a) => `${a.providerName} (${a.status}: ${a.error || 'OK'})`)
        .join('; ')}`
    );
  }
}
