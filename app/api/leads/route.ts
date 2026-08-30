import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';
import { MOCK_LEADS } from '../../../src/services/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  try {
    if (process.env.DATABASE_URL && tenantId) {
      const leads = await prisma.lead.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(leads);
    }
  } catch (error) {
    console.warn('Database lookup error for leads:', error);
  }

  // Graceful fallback to mock data
  const filtered = tenantId
    ? MOCK_LEADS.filter((l) => l.tenantId === tenantId)
    : MOCK_LEADS;
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, studentName, name, email, phone, courseInterest, priorHifzLevel, tuitionAmount, planName } = body;

    const leadName = studentName || name || 'Anonymous Student';

    if (process.env.DATABASE_URL && tenantId) {
      const created = await prisma.lead.create({
        data: {
          tenantId,
          studentName: leadName,
          email: email || '',
          phone: phone || '',
          country: body.country || 'Global',
          courseInterest: courseInterest || 'General Study',
          priorHifzLevel: priorHifzLevel || 'Beginner',
          status: body.status || 'New',
          paymentStatus: body.paymentStatus || 'Pending',
          tuitionAmount: tuitionAmount ? Number(tuitionAmount) : null,
          planName: planName || 'Standard Track',
          notes: body.notes || 'Submitted via online form',
          invoices: body.invoices || [],
        },
      });

      return NextResponse.json(created, { status: 201 });
    }

    const mockLead = {
      id: `lead-${Date.now()}`,
      tenantId: tenantId || 'tenant-al-furqan',
      studentName: leadName,
      name: leadName,
      email: email || '',
      phone: phone || '',
      country: body.country || 'Global',
      courseInterest: courseInterest || 'General Study',
      priorHifzLevel: priorHifzLevel || 'Beginner',
      status: body.status || 'New',
      paymentStatus: body.paymentStatus || 'Pending',
      tuitionAmount: tuitionAmount || 65,
      planName: planName || 'Standard Track',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_LEADS.unshift(mockLead as any);
    return NextResponse.json(mockLead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (process.env.DATABASE_URL && id) {
      const updated = await prisma.lead.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ success: true, id, ...updates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
