import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/server/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/domains/check?domain=academy.org
 * On-Demand TLS "Ask" endpoint for Caddy reverse proxy.
 * Validates whether incoming custom hostnames belong to an approved tenant academy
 * before Let's Encrypt / ZeroSSL certificate issuance to eliminate cert-issuance DoS attacks.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = (searchParams.get('domain') || '').toLowerCase().trim();

    if (!domain) {
      return new NextResponse('Missing domain query parameter', { status: 400 });
    }

    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'ankabit.app').toLowerCase();

    // 1. Root domain and standard subdomains are always authorized
    if (
      domain === rootDomain ||
      domain === `www.${rootDomain}` ||
      domain.endsWith(`.${rootDomain}`) ||
      domain.endsWith('.localhost')
    ) {
      return new NextResponse('Domain Authorized', { status: 200 });
    }

    // 2. Query MySQL database to verify that this custom domain is attached to a real tenant
    if (process.env.DATABASE_URL) {
      const tenant = await prisma.tenant.findFirst({
        where: {
          customDomain: domain,
        },
      });

      if (tenant) {
        return new NextResponse('Custom Domain Authorized', { status: 200 });
      }
    }

    // Reject unknown domain
    return new NextResponse('Domain Not Configured', { status: 404 });
  } catch (error) {
    console.error('[Domain Check Error]:', error);
    return new NextResponse('Verification Error', { status: 500 });
  }
}
