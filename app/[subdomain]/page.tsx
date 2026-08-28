import React from 'react';
import type { Metadata } from 'next';
import { MOCK_TENANTS } from '../../src/services/mockData';
import { TenantLandingClient } from './TenantLandingClient';

interface Props {
  params: { subdomain: string };
}

// Server-Side Dynamic SEO & OpenGraph Generation per Subdomain
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subdomain = params.subdomain;
  const tenant = MOCK_TENANTS[subdomain] || MOCK_TENANTS['al-furqan'];

  return {
    title: `${tenant.name} | ${tenant.nameAr}`,
    description: tenant.tagline,
    openGraph: {
      title: `${tenant.name} - Quranic & Arabic Education`,
      description: tenant.tagline,
      siteName: tenant.name,
      images: [
        {
          url: tenant.logoUrl,
          width: 800,
          height: 600,
          alt: tenant.name,
        },
      ],
    },
    alternates: {
      canonical: `https://${subdomain}.hifz.app`,
    },
  };
}

export default function TenantSubdomainPage({ params }: Props) {
  const subdomain = params.subdomain;
  return <TenantLandingClient subdomain={subdomain} />;
}
