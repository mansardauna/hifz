import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { id, status, amount, currency, metadata } = payload;

    if (status === 'paid') {
      const tenantId = metadata?.tenantId;
      const leadId = metadata?.leadId;
      const realAmount = (amount || 0) / 100;

      if (process.env.DATABASE_URL && tenantId) {
        await prisma.paymentTransaction.create({
          data: {
            tenantId,
            leadId: leadId || null,
            amount: realAmount,
            currency: currency || 'SAR',
            gateway: 'moyasar',
            status: 'succeeded',
            transactionId: id,
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

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Moyasar webhook error:', error);
    return NextResponse.json({ error: error.message || 'Webhook Error' }, { status: 500 });
  }
}
