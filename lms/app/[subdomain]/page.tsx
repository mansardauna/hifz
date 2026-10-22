import React from 'react';
import type { Metadata } from 'next';
import { MOCK_TENANTS } from '../../src/services/mockData';
import { TenantLandingClient } from './TenantLandingClient';

import { TenantService } from '../../src/server/services/tenantService';
import { getTenantDomain } from '../../src/lib/platformDomain';

interface Props {
  params: { subdomain: string };
}

// Server-Side Dynamic SEO & OpenGraph Generation per Subdomain
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subdomain = params.subdomain;
  let tenant: any = null;
  try {
    tenant = await TenantService.getBySubdomainOrDomain(subdomain);
  } catch (e) {
    tenant = MOCK_TENANTS[subdomain] || MOCK_TENANTS['al-furqan'];
  }

  return {
    title: `${tenant.name} | ${tenant.nameAr || ''}`,
    description: tenant.tagline,
    openGraph: {
      title: `${tenant.name} - Quranic & Arabic Education`,
      description: tenant.tagline,
      siteName: tenant.name,
      images: [
        {
          url: tenant.logoUrl || tenant.logo,
          width: 800,
          height: 600,
          alt: tenant.name,
        },
      ],
    },
    alternates: {
      canonical: `https://${getTenantDomain(subdomain)}`,
    },
  };
}

export default async function TenantSubdomainPage({ params }: Props) {
  const subdomain = params.subdomain;
  let tenant: any = null;
  try {
    tenant = await TenantService.getBySubdomainOrDomain(subdomain);
  } catch (e) {
    tenant = MOCK_TENANTS[subdomain] || MOCK_TENANTS['al-furqan'];
  }

  return <TenantLandingClient subdomain={subdomain} initialServerTenant={tenant} />;
}
