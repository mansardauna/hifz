import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';
import { MOCK_TENANTS } from '../../../src/services/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain') || 'al-furqan';
  const customDomain = searchParams.get('customDomain');

  try {
    if (process.env.DATABASE_URL) {
      const tenant = await prisma.tenant.findFirst({
        where: customDomain
          ? { customDomain }
          : { subdomain },
      });

      if (tenant) {
        return NextResponse.json({
          ...tenant,
          pricingPlans: tenant.pricingPlans || [],
          paymentGateways: tenant.paymentGateways || [],
          settings: tenant.settings || {},
        });
      }
    }
  } catch (error) {
    console.warn('Database lookup error, using fallback tenant data:', error);
  }

  // Graceful fallback to mock data
  const fallback = MOCK_TENANTS[subdomain] || MOCK_TENANTS['al-furqan'];
  return NextResponse.json(fallback);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subdomain, niche, brandColor, customDomain } = body;

    if (!name || !subdomain) {
      return NextResponse.json({ error: 'Name and subdomain are required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const existing = await prisma.tenant.findUnique({ where: { subdomain } });
      if (existing) {
        return NextResponse.json({ error: 'Subdomain is already taken' }, { status: 409 });
      }

      const tenant = await prisma.tenant.create({
        data: {
          name,
          subdomain,
          niche: niche || 'quran_tajweed',
          brandColor: brandColor || '#0f766e',
          customDomain: customDomain || null,
          pricingPlans: body.pricingPlans || [],
          paymentGateways: body.paymentGateways || [],
          settings: body.settings || {},
        },
      });

      return NextResponse.json(tenant, { status: 201 });
    }

    // Mock response if DB not connected
    return NextResponse.json({
      id: `tenant-${Date.now()}`,
      name,
      subdomain,
      niche,
      brandColor,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, subdomain, ...updates } = body;

    if (process.env.DATABASE_URL && (id || subdomain)) {
      const updated = await prisma.tenant.update({
        where: id ? { id } : { subdomain },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ success: true, ...updates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
