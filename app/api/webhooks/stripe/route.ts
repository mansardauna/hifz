import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../src/lib/prisma';
import { webhookService } from '../../../../src/services/webhookService';
import { queueService } from '../../../../src/services/queueService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/stripe
 * Authoritative Stripe webhook listener with cryptographic signature enforcement.
 * Rejects unsigned requests to prevent forged tier upgrades or unauthorized student admissions.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey) {
      console.error('[Stripe Webhook Error] STRIPE_SECRET_KEY is not configured in environment.');
      return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
    }

    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    if (webhookSecret) {
      const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' as any });
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error('[Stripe Webhook Error] Stripe signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Signature Verification Failed: ${err.message}` }, { status: 400 });
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.error('[Stripe Webhook Error] STRIPE_WEBHOOK_SECRET must be configured in production.');
        return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET required in production' }, { status: 500 });
      }
      // Non-production fallback only with explicit development warning
      console.warn('[Stripe Webhook] Warning: Parsing raw webhook payload in local development mode without secret.');
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    }

    // Persistent Deduplication Check (MySQL + Redis)
    if (process.env.DATABASE_URL) {
      const existingTx = await prisma.paymentTransaction.findFirst({
        where: { transactionId: event.id },
      });
      if (existingTx) {
        console.log(`[Stripe:Webhook] Event ${event.id} already recorded in DB. Skipping.`);
        return NextResponse.json({ received: true, duplicate: true });
      }
    }

    const isProcessed = await webhookService.isEventProcessed('stripe', event.id);
    if (isProcessed) {
      console.log(`[Stripe:Webhook] Event ${event.id} already processed in cache. Skipping.`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Process Stripe events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const tenantId = metadata.tenantId;
        const leadId = metadata.leadId;
        const isPlatformUpgrade = metadata.type === 'platform_tier_upgrade';
        const academySubdomain = metadata.academySubdomain;
        const tierId = metadata.tierId || 'growth';
        const amount = (session.amount_total || 0) / 100;
        const currency = session.currency || 'usd';
        const customerEmail = session.customer_details?.email || metadata.email || '';
        const customerName = session.customer_details?.name || metadata.name || 'Valued Student';

        if (process.env.DATABASE_URL) {
          // 1. Platform Tier Upgrade for Academy
          if (isPlatformUpgrade && academySubdomain) {
            const tenant = await prisma.tenant.findUnique({ where: { subdomain: academySubdomain } });
            if (tenant) {
              const currentSettings = (tenant.settings as any) || {};
              await prisma.tenant.update({
                where: { subdomain: academySubdomain },
                data: {
                  settings: {
                    ...currentSettings,
                    subscriptionTier: tierId,
                    subscriptionStatus: 'active',
                    stripeSubscriptionId: session.subscription as string,
                    updatedAt: new Date().toISOString(),
                  },
                },
              });
            }
          }

          // 2. Student Tuition Payment
          if (tenantId) {
            await prisma.paymentTransaction.create({
              data: {
                tenantId,
                leadId: leadId || null,
                amount,
                currency,
                gateway: 'stripe',
                status: 'succeeded',
                transactionId: session.id,
              },
            });

            if (leadId) {
              await prisma.lead.update({
                where: { id: leadId },
                data: {
                  paymentStatus: 'Paid',
                  status: 'Admitted',
                },
              });

              if (customerEmail) {
                await queueService.dispatchEmail(
                  customerEmail,
                  'Welcome to Academy - Enrollment Confirmed',
                  `Salam ${customerName}, your payment of ${amount} ${currency.toUpperCase()} has been confirmed. You are now officially admitted!`,
                  tenantId
                );
              }
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      default:
        break;
    }

    await webhookService.markEventProcessed('stripe', event.id);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook handling error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
