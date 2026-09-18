import Stripe from 'stripe';

export interface CreateCheckoutParams {
  tierId?: string;
  tierName?: string;
  amount?: number;
  currency?: string;
  academySubdomain?: string;
  adminEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  origin?: string;
}

export class BillingService {
  static async createStripeCheckoutSession(params: CreateCheckoutParams) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('Platform Stripe secret key not configured in environment variables');
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2024-04-10' as any,
    });

    const {
      tierId = 'growth',
      tierName,
      amount,
      currency = 'usd',
      academySubdomain = 'al-furqan',
      adminEmail = 'admin@hifz.app',
      successUrl,
      cancelUrl,
      origin = 'http://localhost:3000',
    } = params;

    const TIER_PRICES: Record<string, { name: string; priceUsd: number }> = {
      solo: { name: 'Madrasah Solo Tier Subscription', priceUsd: 29 },
      qari: { name: 'Madrasah Solo Tier Subscription', priceUsd: 29 },
      growth: { name: 'Madrasah Growth Tier Subscription', priceUsd: 79 },
    };

    const targetTier = tierId && TIER_PRICES[tierId] ? TIER_PRICES[tierId] : null;
    const finalAmount = targetTier ? targetTier.priceUsd : (amount || 29);
    const finalName = targetTier ? targetTier.name : (tierName || 'SaaS Platform Tier Subscription');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: adminEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: finalName,
              description: `Ankabit LMS SaaS Platform Subscription for ${academySubdomain}.ankabit.app`,
            },
            unit_amount: Math.round(finalAmount * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'platform_tier_upgrade',
        tierId,
        academySubdomain,
      },
      success_url: successUrl || `${origin}/${academySubdomain}/admin?upgrade=success&tier=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/${academySubdomain}/admin?upgrade=cancelled`,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }
}
