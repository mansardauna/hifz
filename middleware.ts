import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rawHost = req.headers.get('host') || 'localhost:3002';

  // Extract hostname without port
  const currentHost = rawHost.replace(/:\d+$/, '').toLowerCase();

  // Root domains that should serve the SaaS platform landing page directly
  const isRootHost =
    currentHost === 'localhost' ||
    currentHost === '127.0.0.1' ||
    currentHost === 'hifz.app' ||
    currentHost === 'www.hifz.app';

  if (isRootHost) {
    return NextResponse.next();
  }

  let subdomain: string | null = null;

  // 1. Standard RFC 6761 subdomain: e.g. al-furqan.localhost, bayyinah.localhost, al-furqan.hifz.app
  if (currentHost.endsWith('.localhost')) {
    subdomain = currentHost.replace('.localhost', '');
  } else if (currentHost.endsWith('.hifz.app')) {
    subdomain = currentHost.replace('.hifz.app', '');
  } else if (currentHost.startsWith('localhost.') || currentHost.startsWith('127.0.0.1.')) {
    // 2. Alternative localhost format: e.g. localhost.al-furqan
    subdomain = currentHost.replace(/^(localhost|127\.0\.0\.1)\./, '');
  } else {
    // 3. Multi-part domain: e.g. al-furqan.mydomain.com
    const parts = currentHost.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  }

  // If a valid tenant subdomain is resolved (and not a system prefix like 'www' or 'app')
  if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'localhost') {
    // Check if the pathname already begins with the subdomain (avoid double prefixing)
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      const response = NextResponse.rewrite(
        new URL(`/${subdomain}${url.pathname}${url.search}`, req.url)
      );
      response.headers.set('x-subdomain', subdomain);
      return response;
    }
  }

  return NextResponse.next();
}
