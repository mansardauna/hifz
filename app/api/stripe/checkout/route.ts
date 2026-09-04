import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Platform Stripe secret key not configured in environment variables' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2024-04-10' as any,
    });

    const body = await req.json();
    const {
      tierId,
      tierName,
      amount,
      currency = 'usd',
      academySubdomain = 'zarah',
      adminEmail = 'admin@hifz.app',
      successUrl,
      cancelUrl,
    } = body;

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Pricing map for SaaS platform tiers
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
        tierId: tierId || 'growth',
        academySubdomain,
      },
      success_url: successUrl || `${origin}/${academySubdomain}/admin?upgrade=success&tier=${tierId || 'growth'}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/${academySubdomain}/admin?upgrade=cancelled`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe platform checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create platform checkout session' },
      { status: 500 }
    );
  }
}
