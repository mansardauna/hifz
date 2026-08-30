import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured in environment variables' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2024-04-10' as any,
    });

    const body = await req.json();
    const {
      planName = 'Foundational Tajweed Track',
      amount = 65,
      currency = 'usd',
      studentEmail = 'student@example.com',
      tenantSubdomain = 'zarah',
      successUrl,
      cancelUrl,
    } = body;

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: studentEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: planName,
              description: `Monthly tuition fee for ${tenantSubdomain}.hifz.app`,
            },
            unit_amount: Math.round(amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/${tenantSubdomain}/lms?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/${tenantSubdomain}/lms?payment=cancelled`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
