import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');

    // Parse webhook payload
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'Webhook payload parse error' }, { status: 400 });
    }

    // Handle payment events
    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded': {
        const session = event.data.object;
        const tenantId = session.metadata?.tenantId;
        const leadId = session.metadata?.leadId;
        const amount = (session.amount_total || session.amount || 0) / 100;
        const currency = session.currency || 'USD';

        if (process.env.DATABASE_URL && tenantId) {
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
        break;
      }
      default:
        // Other events ignored
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json({ error: error.message || 'Webhook Error' }, { status: 500 });
  }
}
