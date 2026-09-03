import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../src/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    if (secretKey && webhookSecret && sig && webhookSecret !== 'whsec_test') {
      const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' as any });
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error('⚠️ Stripe webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // Fallback parse for development / testing without webhook secret
      try {
        event = JSON.parse(rawBody);
      } catch (e) {
        return NextResponse.json({ error: 'Webhook payload parse error' }, { status: 400 });
      }
    }

    // Process specific Stripe events
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

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook handling error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
