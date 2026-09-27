import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';
import { webhookService } from '../../../../src/services/webhookService';
import { queueService } from '../../../../src/services/queueService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { id, status, amount, currency, metadata } = payload;

    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    // Idempotency Guard: prevent duplicate webhook event execution
    const isProcessed = await webhookService.isEventProcessed('moyasar', id);
    if (isProcessed) {
      console.log(`[Moyasar:Webhook] Event ${id} already processed. Skipping.`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (status === 'paid') {
      const tenantId = metadata?.tenantId;
      const leadId = metadata?.leadId;
      const studentEmail = metadata?.email || '';
      const studentName = metadata?.name || 'Valued Student';
      const realAmount = (amount || 0) / 100;
      const realCurrency = currency || 'SAR';

      if (process.env.DATABASE_URL && tenantId) {
        await prisma.paymentTransaction.create({
          data: {
            tenantId,
            leadId: leadId || null,
            amount: realAmount,
            currency: realCurrency,
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

          // Asynchronously dispatch receipt and WhatsApp / email notice
          if (studentEmail) {
            await queueService.dispatchEmail(
              studentEmail,
              'Tuition Payment Received - Enrollment Confirmed',
              `Salam ${studentName}, your tuition payment of ${realAmount} ${realCurrency} via Moyasar has succeeded. Welcome to your classroom!`,
              tenantId
            );
          }
        }
      }
    }

    // Mark event processed with 30-day lease
    await webhookService.markEventProcessed('moyasar', id);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Moyasar webhook error:', error);
    return NextResponse.json({ error: error.message || 'Webhook Error' }, { status: 500 });
  }
}
