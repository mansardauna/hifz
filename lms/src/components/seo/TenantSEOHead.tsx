import React from 'react';
import { TenantConfig } from '../../types';

interface TenantSEOHeadProps {
  tenant: TenantConfig;
  pageTitle?: string;
  pageDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const TenantSEOHead: React.FC<TenantSEOHeadProps> = ({
  tenant,
  pageTitle,
  pageDescription,
  canonicalUrl,
  ogImage,
}) => {
  const title = pageTitle
    ? `${pageTitle} | ${tenant.name}`
    : `${tenant.name} - ${tenant.tagline || 'Sacred Quran & Arabic Academy'}`;

  const description =
    pageDescription ||
    tenant.aboutText ||
    `Join ${tenant.name} for authentic online learning, one-on-one live instruction, curriculum tracks, and verified certification.`;

  const url = canonicalUrl || `https://${tenant.subdomain}.hifz.app`;
  const image = ogImage || tenant.logoUrl || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80';

  // Schema.org Structured Data for EducationalOrganization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: tenant.name,
    alternateName: tenant.nameAr,
    description: description,
    url: url,
    logo: tenant.logoUrl,
    email: tenant.contactEmail,
    telephone: tenant.contactPhone,
    sameAs: [
      `https://twitter.com/${tenant.subdomain}`,
      `https://facebook.com/${tenant.subdomain}`,
      `https://instagram.com/${tenant.subdomain}`,
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '45',
      highPrice: '140',
      offerCount: tenant.pricingPlans?.length || '3',
    },
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={url} />

      {/* Accessibility & Theme Color */}
      <meta name="theme-color" content={tenant.theme?.primaryColor || '#047857'} />
      <meta name="application-name" content={tenant.name} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={tenant.name} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${tenant.name} Banner`} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};
