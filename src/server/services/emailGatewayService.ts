import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export type EmailEngineType = 'resend' | 'sendpulse' | 'nodemailer';

export interface EmailProviderConfig {
  id: string;
  name: string;
  type: EmailEngineType;
  enabled: boolean;
  priority: number; // 1 = highest priority, 2 = secondary fallback, 3 = tertiary fallback...
  dailyQuota: number; // Daily free/limit quota (e.g. 100 for Resend free, 50 for SendPulse free, 500 for Nodemailer)
  sentToday: number;
  lastResetDate: string; // YYYY-MM-DD
  status: 'active' | 'inactive' | 'exhausted' | 'unverified' | 'error';
  isVerified: boolean; // MUST be tested and verified before activating!
  lastTestedAt?: string | null;
  lastError?: string | null;

  // Common Header Info
  fromEmail: string;
  fromName: string;

  // Resend
  apiKey?: string;

  // SendPulse (SMTP or API)
  sendpulseMode?: 'smtp' | 'api';
  sendpulseApiUserId?: string;
  sendpulseApiSecret?: string;
  sendpulseSmtpUser?: string;
  sendpulseSmtpPass?: string;

  // Nodemailer (Custom SMTP)
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
}

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromEmail?: string;
  fromName?: string;
  preferredProviderId?: string;
}

export interface SendEmailAttempt {
  providerId: string;
  providerName: string;
  providerType: EmailEngineType;
  status: 'sent' | 'quota_exhausted' | 'failed';
  error?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId: string;
  providerId: string;
  providerName: string;
  providerType: EmailEngineType;
  sentToday: number;
  dailyQuota: number;
  attempts: SendEmailAttempt[];
}

const STORAGE_FILE_PATH = path.join(process.cwd(), 'data', 'email_providers.json');

// Default starter configurations for the 3 requested providers
export const DEFAULT_EMAIL_PROVIDERS: EmailProviderConfig[] = [
  {
    id: 'prov_resend_1',
    name: 'Resend API (Primary)',
    type: 'resend',
    enabled: true,
    priority: 1,
    dailyQuota: 100, // Standard free tier: 100 emails / day
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'unverified',
    isVerified: false,
    fromEmail: 'onboarding@resend.dev',
    fromName: 'Ankabit Academy OS',
    apiKey: '',
  },
  {
    id: 'prov_sendpulse_1',
    name: 'SendPulse SMTP / API (Fallback 1)',
    type: 'sendpulse',
    enabled: false,
    priority: 2,
    dailyQuota: 50, // Standard free tier quota
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'unverified',
    isVerified: false,
    fromEmail: 'noreply@ankabit.app',
    fromName: 'Ankabit Academy OS',
    sendpulseMode: 'smtp',
    sendpulseSmtpUser: '',
    sendpulseSmtpPass: '',
  },
  {
    id: 'prov_nodemailer_1',
    name: 'Nodemailer Custom SMTP (Fallback 2)',
    type: 'nodemailer',
    enabled: false,
    priority: 3,
    dailyQuota: 500, // Custom SMTP server capacity
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'unverified',
    isVerified: false,
    fromEmail: 'notifications@ankabit.app',
    fromName: 'Ankabit Platform Mailer',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false,
  },
];

export class EmailGatewayService {
  /**
   * Read stored providers from disk or fallback to defaults
   */
  static getProviders(): EmailProviderConfig[] {
    try {
      if (fs.existsSync(STORAGE_FILE_PATH)) {
        const raw = fs.readFileSync(STORAGE_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.checkAndResetDailyQuotas(parsed);
        }
      }
    } catch (err) {
      console.warn('[EmailGatewayService] Error reading stored providers:', err);
    }
    return [...DEFAULT_EMAIL_PROVIDERS];
  }

  /**
   * Save provider configurations to disk
   */
  static saveProviders(providers: EmailProviderConfig[]): void {
    try {
      const dir = path.dirname(STORAGE_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(providers, null, 2), 'utf-8');
    } catch (err) {
      console.error('[EmailGatewayService] Failed to save providers:', err);
    }
  }

  /**
   * Reset daily quota counters on a new calendar day
   */
  static checkAndResetDailyQuotas(providers: EmailProviderConfig[]): EmailProviderConfig[] {
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
   * Requirement 2: Real Pre-activation Health Check & Connection Test
   * Verifies credentials and connectivity BEFORE activating and giving data to send.
   */
  static async testProviderConnection(provider: EmailProviderConfig): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      if (provider.type === 'resend') {
        const apiKey = provider.apiKey?.trim();
        if (!apiKey) {
          return { success: false, message: 'Resend API Key is required.' };
        }
        if (!apiKey.startsWith('re_')) {
          return { success: false, message: 'Invalid Resend API Key format (must start with "re_").' };
        }

        // Test API key by listing domains or api keys from Resend API
        const res = await fetch('https://api.resend.com/api-keys', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          return {
            success: true,
            message: 'Resend API connection and credentials verified successfully.',
            details: { status: res.status, keyValid: true },
          };
        } else {
          // If api-keys endpoint returned 403 or 401, key is invalid
          const errData = await res.json().catch(() => ({ message: res.statusText }));
          return {
            success: false,
            message: `Resend verification failed (${res.status}): ${errData.message || res.statusText}`,
          };
        }
      }

      if (provider.type === 'sendpulse') {
        const mode = provider.sendpulseMode || 'smtp';

        if (mode === 'smtp') {
          const user = provider.sendpulseSmtpUser?.trim();
          const pass = provider.sendpulseSmtpPass?.trim();

          if (!user || !pass) {
            return { success: false, message: 'SendPulse SMTP Login and Password are required.' };
          }

          // Verify handshake with SendPulse SMTP server
          const transporter = nodemailer.createTransport({
            host: 'smtp-pulse.com',
            port: 465,
            secure: true,
            auth: { user, pass },
            connectionTimeout: 8000,
          });

          await transporter.verify();
          return {
            success: true,
            message: 'SendPulse SMTP handshake and credentials verified successfully (smtp-pulse.com:465).',
          };
        } else {
          // SendPulse REST API OAuth check
          const userId = provider.sendpulseApiUserId?.trim();
          const secret = provider.sendpulseApiSecret?.trim();

          if (!userId || !secret) {
            return { success: false, message: 'SendPulse API User ID and Secret are required.' };
          }

          const res = await fetch('https://api.sendpulse.com/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grant_type: 'client_credentials',
              client_id: userId,
              client_secret: secret,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.access_token) {
              return {
                success: true,
                message: 'SendPulse REST API OAuth handshake verified successfully.',
                details: { tokenType: data.token_type },
              };
            }
          }
          const errText = await res.text();
          return {
            success: false,
            message: `SendPulse API verification failed: ${errText || res.statusText}`,
          };
        }
      }

      if (provider.type === 'nodemailer') {
        const host = provider.smtpHost?.trim();
        const port = provider.smtpPort || 587;
        const user = provider.smtpUser?.trim();
        const pass = provider.smtpPass?.trim();
        const secure = provider.smtpSecure ?? (port === 465);

        if (!host) {
          return { success: false, message: 'SMTP Host address is required.' };
        }
        if (!user || !pass) {
          return { success: false, message: 'SMTP Username and Password are required.' };
        }

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          connectionTimeout: 10000,
        });

        await transporter.verify();
        return {
          success: true,
          message: `Nodemailer SMTP handshake and authentication verified successfully (${host}:${port}).`,
        };
      }

      return { success: false, message: `Unsupported email provider engine: ${provider.type}` };
    } catch (err: any) {
      console.warn('[EmailGatewayService] Test connection error:', err);
      return {
        success: false,
        message: err.message || 'Connection test failed. Please verify credentials, host, and port.',
      };
    }
  }

  /**
   * Requirement 1: Send email with automatic failover and daily free quota switching.
   * If one provider finishes its daily quota or fails, switches to next available provider in rotation.
   */
  static async sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
    const providers = this.getProviders();
    const attempts: SendEmailAttempt[] = [];

    // Filter verified & enabled providers sorted by priority ascending (1 = Primary, 2 = Secondary...)
    const activeChain = providers
      .filter((p) => p.enabled && p.isVerified)
      .sort((a, b) => a.priority - b.priority);

    if (activeChain.length === 0) {
      throw new Error(
        'No active and verified email providers configured. Please configure and verify at least one provider in the SuperAdmin console.'
      );
    }

    const recipients = Array.isArray(payload.to) ? payload.to.join(', ') : payload.to;
    const recipientList = Array.isArray(payload.to) ? payload.to : [payload.to];

    for (const provider of activeChain) {
      // 1. Check if daily quota is reached
      if (provider.dailyQuota > 0 && provider.sentToday >= provider.dailyQuota) {
        console.warn(
          `[EmailGatewayService] Provider ${provider.name} (${provider.type}) reached daily quota (${provider.sentToday}/${provider.dailyQuota}). Auto-switching to next provider in chain...`
        );
        provider.status = 'exhausted';
        provider.lastError = `Daily quota limit reached (${provider.sentToday}/${provider.dailyQuota})`;
        attempts.push({
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: 'quota_exhausted',
          error: `Daily quota of ${provider.dailyQuota} emails reached today.`,
        });
        continue;
      }

      // 2. Attempt delivery through this provider
      try {
        console.log(`[EmailGatewayService] Attempting delivery via ${provider.name} (Priority ${provider.priority})`);
        const fromAddress = payload.fromEmail || provider.fromEmail || 'noreply@ankabit.app';
        const fromDisplayName = payload.fromName || provider.fromName || 'Ankabit Academy OS';
        const formattedFrom = `"${fromDisplayName}" <${fromAddress}>`;

        let messageId = '';

        if (provider.type === 'resend') {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${provider.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: formattedFrom,
              to: recipientList,
              subject: payload.subject,
              html: payload.html,
              text: payload.text || payload.html.replace(/<[^>]+>/g, ' '),
            }),
          });

          const resData = await res.json().catch(() => ({}));

          if (!res.ok) {
            // Check for quota or rate limit error (429 or quota exceeded)
            const isQuota =
              res.status === 429 ||
              resData.name === 'rate_limit_exceeded' ||
              resData.name === 'daily_quota_exceeded' ||
              (resData.message && /quota|limit|rate/i.test(resData.message));

            if (isQuota) {
              provider.status = 'exhausted';
              provider.lastError = `Resend daily quota / rate limit reached: ${resData.message || res.statusText}`;
              attempts.push({
                providerId: provider.id,
                providerName: provider.name,
                providerType: provider.type,
                status: 'quota_exhausted',
                error: provider.lastError,
              });
              console.warn(`[EmailGatewayService] Resend quota exhausted. Falling back to next provider...`);
              continue;
            }

            throw new Error(`Resend error (${res.status}): ${resData.message || res.statusText}`);
          }

          messageId = resData.id || `resend_${Date.now()}`;
        } else if (provider.type === 'sendpulse') {
          const mode = provider.sendpulseMode || 'smtp';

          if (mode === 'smtp') {
            const transporter = nodemailer.createTransport({
              host: 'smtp-pulse.com',
              port: 465,
              secure: true,
              auth: {
                user: provider.sendpulseSmtpUser,
                pass: provider.sendpulseSmtpPass,
              },
            });

            const info = await transporter.sendMail({
              from: formattedFrom,
              to: recipients,
              subject: payload.subject,
              html: payload.html,
              text: payload.text || payload.html.replace(/<[^>]+>/g, ' '),
            });

            messageId = info.messageId || `sendpulse_${Date.now()}`;
          } else {
            // SendPulse REST API
            const tokenRes = await fetch('https://api.sendpulse.com/oauth/access_token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: provider.sendpulseApiUserId,
                client_secret: provider.sendpulseApiSecret,
              }),
            });
            const tokenData = await tokenRes.json();
            if (!tokenData.access_token) {
              throw new Error('Failed to obtain SendPulse OAuth access token');
            }

            const sendRes = await fetch('https://api.sendpulse.com/smtp/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: {
                  html: Buffer.from(payload.html).toString('base64'),
                  text: payload.text || payload.html.replace(/<[^>]+>/g, ' '),
                  subject: payload.subject,
                  from: { name: fromDisplayName, email: fromAddress },
                  to: recipientList.map((email) => ({ email })),
                },
              }),
            });

            const sendData = await sendRes.json();
            if (!sendRes.ok || sendData.result === false) {
              const errMsg = sendData.message || 'SendPulse API delivery error';
              if (/quota|limit|exceeded|balance/i.test(errMsg)) {
                provider.status = 'exhausted';
                provider.lastError = errMsg;
                attempts.push({
                  providerId: provider.id,
                  providerName: provider.name,
                  providerType: provider.type,
                  status: 'quota_exhausted',
                  error: errMsg,
                });
                console.warn(`[EmailGatewayService] SendPulse quota exhausted. Falling back to next provider...`);
                continue;
              }
              throw new Error(errMsg);
            }
            messageId = `sendpulse_api_${Date.now()}`;
          }
        } else if (provider.type === 'nodemailer') {
          const transporter = nodemailer.createTransport({
            host: provider.smtpHost,
            port: provider.smtpPort || 587,
            secure: provider.smtpSecure ?? ((provider.smtpPort || 587) === 465),
            auth: {
              user: provider.smtpUser,
              pass: provider.smtpPass,
            },
          });

          const info = await transporter.sendMail({
            from: formattedFrom,
            to: recipients,
            subject: payload.subject,
            html: payload.html,
            text: payload.text || payload.html.replace(/<[^>]+>/g, ' '),
          });

          messageId = info.messageId || `smtp_${Date.now()}`;
        }

        // Delivery succeeded! Increment daily count and save state
        provider.sentToday += recipientList.length;
        provider.status = 'active';
        provider.lastError = null;
        this.saveProviders(providers);

        attempts.push({
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          status: 'sent',
        });

        console.log(
          `[EmailGatewayService] Email sent successfully via ${provider.name}. Quota used today: ${provider.sentToday}/${provider.dailyQuota || 'unlimited'}`
        );

        return {
          success: true,
          messageId,
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          sentToday: provider.sentToday,
          dailyQuota: provider.dailyQuota,
          attempts,
        };
      } catch (err: any) {
        console.error(`[EmailGatewayService] Delivery failed with ${provider.name}:`, err.message);
        const errMsg = err.message || 'Delivery error';

        const isQuotaErr = /quota|limit|429|452|rate limit|too many/i.test(errMsg);
        if (isQuotaErr) {
          provider.status = 'exhausted';
          provider.lastError = `Quota/Rate limit: ${errMsg}`;
          attempts.push({
            providerId: provider.id,
            providerName: provider.name,
            providerType: provider.type,
            status: 'quota_exhausted',
            error: errMsg,
          });
        } else {
          provider.status = 'error';
          provider.lastError = errMsg;
          attempts.push({
            providerId: provider.id,
            providerName: provider.name,
            providerType: provider.type,
            status: 'failed',
            error: errMsg,
          });
        }

        // Auto failover continues to next provider in activeChain!
        this.saveProviders(providers);
      }
    }

    // If loop finishes without returning, all providers failed
    const attemptSummary = attempts.map((a) => `${a.providerName} (${a.status}: ${a.error || 'failed'})`).join('; ');
    throw new Error(
      `All active email providers in failover chain exhausted or failed. Attempts: [${attemptSummary}]`
    );
  }
}
