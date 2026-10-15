import { NextRequest, NextResponse } from 'next/server';
import { EmailGatewayService, EmailProviderConfig } from '../../../../src/server/services/emailGatewayService';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ['superadmin']);

    const providers = EmailGatewayService.getProviders();
    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request, ['superadmin']);

    const body = await request.json();
    const { action, provider, providers, recipient, subject, content, providerId } = body;

    // 1. Requirement 2: Real Pre-activation Health Check & Connection Test
    if (action === 'test_provider') {
      if (!provider) {
        return apiError('Provider configuration is required for connection testing.', 400);
      }

      console.log(`[API:email-providers] Testing connection for ${provider.name} (${provider.type})...`);
      const testResult = await EmailGatewayService.testProviderConnection(provider);

      // If test succeeded, update stored provider's isVerified flag and timestamp
      const allProviders = EmailGatewayService.getProviders();
      const existingIdx = allProviders.findIndex((p) => p.id === provider.id);

      if (existingIdx >= 0) {
        allProviders[existingIdx] = {
          ...allProviders[existingIdx],
          ...provider,
          isVerified: testResult.success,
          status: testResult.success
            ? allProviders[existingIdx].enabled
              ? 'active'
              : 'inactive'
            : 'error',
          lastTestedAt: testResult.success ? new Date().toISOString() : allProviders[existingIdx].lastTestedAt,
          lastError: testResult.success ? null : testResult.message,
        };
        EmailGatewayService.saveProviders(allProviders);
      }

      return NextResponse.json({
        success: testResult.success,
        message: testResult.message,
        details: testResult.details,
        isVerified: testResult.success,
      });
    }

    // 2. Save Providers & Enforce Verification Gate
    if (action === 'save_providers') {
      if (!Array.isArray(providers)) {
        return apiError('Providers list array is required.', 400);
      }

      // Requirement 2 validation: Cannot enable an unverified provider
      for (const p of providers as EmailProviderConfig[]) {
        if (p.enabled && !p.isVerified) {
          return apiError(
            `Cannot activate "${p.name}": A real connection test must pass successfully before activating this provider.`,
            400
          );
        }
      }

      EmailGatewayService.saveProviders(providers);
      return NextResponse.json({
        success: true,
        message: 'Email providers and failover configuration saved successfully.',
        providers: EmailGatewayService.getProviders(),
      });
    }

    // 3. Send Test Email (Real Delivery Verification)
    if (action === 'send_test_email') {
      if (!recipient) {
        return apiError('Recipient email is required.', 400);
      }

      const testSubject = subject || `[Ankabit Cloud] Real Email Delivery & Failover Test`;
      const testHtml =
        content ||
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
          <h2 style="color: #0f766e; margin-top: 0;">Ankabit Platform Email Gateway Verified</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            This email confirms that your platform email provider failover engine is operational and successfully delivering outbound emails.
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #0f766e; padding: 12px 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #475569;">
              <strong>Time of delivery:</strong> ${new Date().toLocaleString()}<br/>
              <strong>Environment:</strong> Production SuperAdmin Engine
            </p>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            Ankabit Academy Platform • Multi-Provider Failover Service (Resend / SendPulse / Nodemailer)
          </p>
        </div>
      `;

      const result = await EmailGatewayService.sendEmail({
        to: recipient,
        subject: testSubject,
        html: testHtml,
        preferredProviderId: providerId,
      });

      return NextResponse.json({
        success: true,
        message: `Test email dispatched successfully via ${result.providerName}.`,
        result,
        providers: EmailGatewayService.getProviders(),
      });
    }

    // 4. Reset Daily Quota Counter Manually
    if (action === 'reset_quota') {
      const allProviders = EmailGatewayService.getProviders();
      const updated = allProviders.map((p) => {
        if (!providerId || p.id === providerId) {
          return {
            ...p,
            sentToday: 0,
            status: p.isVerified && p.enabled ? ('active' as const) : p.status,
            lastError: null,
          };
        }
        return p;
      });
      EmailGatewayService.saveProviders(updated);
      return NextResponse.json({
        success: true,
        message: 'Daily quota counter reset successfully.',
        providers: updated,
      });
    }

    return apiError('Unknown action requested', 400);
  } catch (error: any) {
    return handleApiError(error);
  }
}
