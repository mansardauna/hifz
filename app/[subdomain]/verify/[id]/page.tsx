'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTenant } from '../../../../src/context/TenantContext';

const CertificateVerifier = dynamic(
  () =>
    import('../../../../src/components/certificate/CertificateVerifier').then(
      (mod) => mod.CertificateVerifier
    ),
  { ssr: false }
);

interface SubdomainVerifyPageProps {
  params: { subdomain: string; id: string };
}

export default function TenantVerifyCertificatePage({ params }: SubdomainVerifyPageProps) {
  const { setTenantBySubdomain } = useTenant();

  useEffect(() => {
    if (params.subdomain) {
      setTenantBySubdomain(params.subdomain);
    }
  }, [params.subdomain]);

  return <CertificateVerifier certificateId={params.id} />;
}
