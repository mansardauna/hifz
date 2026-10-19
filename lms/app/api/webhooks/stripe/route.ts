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

    let event: Stripe.Event;

    if (webhookSecret && secretKey) {
      if (!sig) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }
      const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' as any });
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error('[Stripe Webhook Error] Stripe signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Signature Verification Failed: ${err.message}` }, { status: 400 });
      }
    } else {
      // Strict dev bypass: ONLY permitted in local development if explicitly enabled and webhook secret is unconfigured
      const isExplicitDevBypass =
        process.env.ALLOW_DEV_WEBHOOKS === 'true' &&
        process.env.NODE_ENV === 'development';

      if (!isExplicitDevBypass) {
        console.error('[Stripe Webhook Error] STRIPE_WEBHOOK_SECRET and STRIPE_SECRET_KEY are required.');
        return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is required to verify webhooks' }, { status: 500 });
      }

      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
      console.warn('[Stripe Webhook Warning] Processing unsigned webhook payload under explicit local dev bypass.');
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

          if (!resolvedTenantId && academySubdomain) {
            const tenant = await prisma.tenant.findUnique({ where: { subdomain: academySubdomain } });
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

          if (resolvedTenantId) {
            await prisma.paymentTransaction.create({
              data: {
                tenantId: resolvedTenantId,
                leadId: resolvedLeadId,
                amount,
                currency,
                gateway: 'stripe',
                status: 'succeeded',
                transactionId: session.id,
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

              if (customerEmail) {
                await queueService.dispatchEmail(
                  customerEmail,
                  'Welcome to Academy - Enrollment Confirmed',
                  `Salam ${customerName}, your payment of ${amount} ${currency.toUpperCase()} has been confirmed. You are now officially admitted!`,
                  resolvedTenantId
                );
              }
            }
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId && process.env.DATABASE_URL) {
          try {
            // Find tenant by subscription ID in settings
            const allTenants = await prisma.tenant.findMany();
            const matchingTenant = allTenants.find((t: any) => {
              const s = (t.settings as any) || {};
              return s.stripeSubscriptionId === subscriptionId;
            });

            if (matchingTenant) {
              const currentSettings = (matchingTenant.settings as any) || {};
              await prisma.tenant.update({
                where: { id: matchingTenant.id },
                data: {
                  settings: {
                    ...currentSettings,
                    subscriptionStatus: 'active',
                    lastPaymentAt: new Date().toISOString(),
                  },
                },
              });
              console.log(`[Stripe:Webhook] Tenant ${matchingTenant.subdomain} subscription renewed via invoice ${invoice.id}`);
            }
          } catch (invErr) {
            console.error('[Stripe:Webhook] Error updating tenant on invoice.payment_succeeded:', invErr);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        if (subscription.id && process.env.DATABASE_URL) {
          try {
            const allTenants = await prisma.tenant.findMany();
            const matchingTenant = allTenants.find((t: any) => {
              const s = (t.settings as any) || {};
              return s.stripeSubscriptionId === subscription.id;
            });
            if (matchingTenant) {
              const currentSettings = (matchingTenant.settings as any) || {};
              await prisma.tenant.update({
                where: { id: matchingTenant.id },
                data: {
                  settings: {
                    ...currentSettings,
                    subscriptionStatus: 'cancelled',
                  },
                },
              });
            }
          } catch (cancelErr) {
            console.error('[Stripe:Webhook] Error updating tenant on subscription.deleted:', cancelErr);
          }
        }
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
