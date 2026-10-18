import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';
import { webhookService } from '../../../../src/services/webhookService';
import { queueService } from '../../../../src/services/queueService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/moyasar
 * Cryptographically verified webhook for Moyasar payments (Saudi Mada / Apple Pay).
 * Validates payload signature or verifies the transaction against Moyasar's API.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const moyasarSignature = request.headers.get('moyasar-signature') || request.headers.get('x-moyasar-signature');
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET;
    const apiKey = process.env.MOYASAR_SECRET_KEY;

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { id, status, amount, currency, metadata } = payload;

    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    // 1. Signature / Secret Verification
    let isAuthentic = false;

    // Check header webhook secret token if configured
    if (webhookSecret) {
      if (
        moyasarSignature === webhookSecret ||
        authHeader === `Bearer ${webhookSecret}` ||
        authHeader === `Basic ${Buffer.from(webhookSecret + ':').toString('base64')}`
      ) {
        isAuthentic = true;
      }
    }

    // 2. Authoritative Verification via Moyasar REST API
    if (!isAuthentic && apiKey) {
      try {
        const verifyRes = await fetch(`https://api.moyasar.com/v1/payments/${id}`, {
          headers: {
            Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
          },
        });

        if (verifyRes.ok) {
          const remotePayment = await verifyRes.json();
          if (remotePayment.id === id && remotePayment.status === 'paid') {
            isAuthentic = true;
          }
        }
      } catch (verifyErr) {
        console.error('[Moyasar API Verification Error]:', verifyErr);
      }
    }

    const isDevAllowed = process.env.ALLOW_DEV_WEBHOOKS === 'true' || process.env.NODE_ENV !== 'production';

    // If neither signature nor API verification succeeded, reject in production
    if (!isAuthentic && !isDevAllowed) {
      if (process.env.NODE_ENV === 'production' || webhookSecret || apiKey) {
        console.error(`[Moyasar:Webhook] Rejecting unverified webhook for payment ID ${id}`);
        return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
      }
      console.warn(`[Moyasar:Webhook] Warning: accepting unverified webhook in development mode for payment ID ${id}`);
    }

    // 3. Persistent Idempotency Guard (Redis + MySQL)
    if (process.env.DATABASE_URL) {
      const existingTx = await prisma.paymentTransaction.findFirst({
        where: { transactionId: id },
      });
      if (existingTx) {
        console.log(`[Moyasar:Webhook] Transaction ${id} already recorded in DB. Skipping.`);
        return NextResponse.json({ received: true, duplicate: true });
      }
    }

    const isProcessed = await webhookService.isEventProcessed('moyasar', id);
    if (isProcessed) {
      console.log(`[Moyasar:Webhook] Event ${id} already processed in cache. Skipping.`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    // 4. Process Payment
    if (status === 'paid') {
      const tenantId = metadata?.tenantId;
      const leadId = metadata?.leadId;
      const studentEmail = metadata?.email || '';
      const studentName = metadata?.name || 'Valued Student';
      const realAmount = (amount || 0) / 100;
      const realCurrency = currency || 'SAR';

      // Resolve tenant reliably by ID or subdomain to avoid foreign key violations
      let resolvedTenantId: string | null = null;
      if (tenantId) {
        const tenantById = await prisma.tenant.findUnique({ where: { id: tenantId } });
        if (tenantById) {
          resolvedTenantId = tenantById.id;
        } else {
          const cleanSubdomain = tenantId.replace(/^tenant_/, '').replace(/_/g, '-');
          const tenantBySubdomain = await prisma.tenant.findFirst({
            where: {
              OR: [
                { subdomain: tenantId },
                { subdomain: cleanSubdomain },
              ],
            },
          });
          if (tenantBySubdomain) {
            resolvedTenantId = tenantBySubdomain.id;
          }
        }
      }

      if (!resolvedTenantId && metadata?.academySubdomain) {
        const tenant = await prisma.tenant.findUnique({ where: { subdomain: metadata.academySubdomain } });
        if (tenant) resolvedTenantId = tenant.id;
      }

      if (!resolvedTenantId && (process.env.ALLOW_DEV_WEBHOOKS === 'true' || process.env.NODE_ENV !== 'production')) {
        const fallbackTenant = await prisma.tenant.findFirst();
        if (fallbackTenant) resolvedTenantId = fallbackTenant.id;
      }

      let resolvedLeadId: string | null = null;
      if (leadId) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (lead) resolvedLeadId = lead.id;
      }

      if (process.env.DATABASE_URL && resolvedTenantId) {
        await prisma.paymentTransaction.create({
          data: {
            tenantId: resolvedTenantId,
            leadId: resolvedLeadId,
            amount: realAmount,
            currency: realCurrency,
            gateway: 'moyasar',
            status: 'succeeded',
            transactionId: id,
          },
        });

        if (resolvedLeadId) {
          await prisma.lead.update({
            where: { id: resolvedLeadId },
            data: {
              paymentStatus: 'Paid',
              status: 'Admitted',
            },
          });

          if (studentEmail) {
            await queueService.dispatchEmail(
              studentEmail,
              'Tuition Payment Received - Enrollment Confirmed',
              `Salam ${studentName}, your tuition payment of ${realAmount} ${realCurrency} via Moyasar has succeeded. Welcome to your classroom!`,
              resolvedTenantId
            );
          }
        }
      }
    }

    await webhookService.markEventProcessed('moyasar', id);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Moyasar webhook error:', error);
    return NextResponse.json({ error: error.message || 'Webhook Error' }, { status: 500 });
  }
}
