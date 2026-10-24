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
  const rawHost = req.headers.get('host') || 'localhost:3000';

  // Extract hostname without port
  const currentHost = rawHost.replace(/:\d+$/, '').toLowerCase();
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || currentHost).toLowerCase();

  // Root domains that should serve the platform directly on main domain paths
  const isRootHost =
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(currentHost) ||
    currentHost === 'localhost' ||
    currentHost === '127.0.0.1' ||
    currentHost === rootDomain ||
    currentHost === `www.${rootDomain}` ||
    currentHost === 'techmadrasah.app' ||
    currentHost === 'www.techmadrasah.app' ||
    currentHost === 'hifz.app' ||
    currentHost === 'www.hifz.app' ||
    currentHost.endsWith('.vercel.app');

  if (isRootHost) {
    return NextResponse.next();
  }

  let subdomain: string | null = null;
  let customDomain: string | null = null;

  // 1. Dynamic root domain matching
  if (currentHost.endsWith(`.${rootDomain}`)) {
    subdomain = currentHost.replace(`.${rootDomain}`, '');
  } else if (currentHost.endsWith('.localhost')) {
    subdomain = currentHost.replace('.localhost', '');
  } else if (currentHost.endsWith('.techmadrasah.app')) {
    subdomain = currentHost.replace('.techmadrasah.app', '');
  } else if (currentHost.endsWith('.hifz.app')) {
    subdomain = currentHost.replace('.hifz.app', '');
  } else if (currentHost.startsWith('localhost.') || currentHost.startsWith('127.0.0.1.')) {
    subdomain = currentHost.replace(/^(localhost|127\.0\.0\.1)\./, '');
  } else {
    // 2. Custom apex / third-party domain (e.g. al-furqan.org, quranacademy.co.uk)
    customDomain = currentHost;
    subdomain = currentHost;
  }

  // If a valid tenant subdomain or custom apex domain is resolved (and not a system prefix)
  if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'localhost') {
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      const response = NextResponse.rewrite(
        new URL(`/${subdomain}${url.pathname}${url.search}`, req.url)
      );
      response.headers.set('x-subdomain', subdomain);
      if (customDomain) {
        response.headers.set('x-custom-domain', customDomain);
      }
      return response;
    }
  }

  return NextResponse.next();
}
