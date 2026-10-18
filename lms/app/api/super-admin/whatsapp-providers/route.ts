import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppGatewayService } from '../../../../src/server/services/whatsappGatewayService';
import { WhatsAppProviderConfig } from '../../../../src/types/superAdmin';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ['superadmin']);

    const providers = WhatsAppGatewayService.getProviders();
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
    const { action, provider, providers, recipient, content, providerId } = body;
    const targetConfig = provider || body.config;

    // 1. Requirement: Pre-activation Verification Test
    if (action === 'test_provider') {
      if (!targetConfig) {
        return apiError('Provider configuration is required for connection testing.', 400);
      }

      console.log(`[API:whatsapp-providers] Testing connection for ${targetConfig.name} (${targetConfig.type})...`);
      const testResult = await WhatsAppGatewayService.testProviderConnection(targetConfig);

      const allProviders = WhatsAppGatewayService.getProviders();
      const existingIdx = allProviders.findIndex((p) => p.id === targetConfig.id);

      if (existingIdx >= 0) {
        allProviders[existingIdx] = {
          ...allProviders[existingIdx],
          ...targetConfig,
          isVerified: testResult.success,
          status: testResult.success
            ? allProviders[existingIdx].enabled
              ? 'active'
              : 'inactive'
            : 'error',
          lastTestedAt: testResult.success ? new Date().toISOString() : allProviders[existingIdx].lastTestedAt,
          lastError: testResult.success ? null : testResult.message,
        };
        WhatsAppGatewayService.saveProviders(allProviders);
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

      for (const p of providers as WhatsAppProviderConfig[]) {
        if (p.enabled && !p.isVerified) {
          return apiError(
            `Cannot activate "${p.name}": A real connection test must pass successfully before activating this provider.`,
            400
          );
        }
      }

      WhatsAppGatewayService.saveProviders(providers);
      return NextResponse.json({
        success: true,
        message: 'WhatsApp providers and failover configuration saved successfully.',
        providers: WhatsAppGatewayService.getProviders(),
      });
    }

    // 3. Send Test WhatsApp message
    if (action === 'send_test_whatsapp') {
      if (!recipient) {
        return apiError('Recipient phone number is required.', 400);
      }

      const messageText =
        content ||
        `[Ankabit Cloud] Salam! This is an official WhatsApp delivery test dispatched at ${new Date().toLocaleTimeString()} from Ankabit LMS SuperAdmin pool.`;

      try {
        const result = await WhatsAppGatewayService.sendWhatsApp({
          to: recipient,
          body: messageText,
          preferredProviderId: providerId,
        });

        return NextResponse.json({
          success: true,
          message: `Test WhatsApp message dispatched successfully via ${result.providerName}.`,
          providerUsed: result.providerName,
          result,
          failoverHistory: result.attempts?.map((a) => `${a.providerName}: ${a.status} ${a.error || ''}`),
          providers: WhatsAppGatewayService.getProviders(),
        });
      } catch (sendErr: any) {
        return NextResponse.json({
          success: false,
          message: sendErr.message || 'WhatsApp delivery failed. No active verified providers or daily quotas reached.',
          providerUsed: null,
          failoverHistory: ['Failover chain halted: ' + sendErr.message],
          providers: WhatsAppGatewayService.getProviders(),
        });
      }
    }

    // 4. Reset Daily Quota
    if (action === 'reset_quota') {
      const allProviders = WhatsAppGatewayService.getProviders();
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

      WhatsAppGatewayService.saveProviders(updated);
      return NextResponse.json({
        success: true,
        message: 'Daily WhatsApp quota counter reset successfully.',
        providers: updated,
      });
    }

    return apiError(`Unknown action: ${action}`, 400);
  } catch (error: any) {
    return handleApiError(error);
  }
}
