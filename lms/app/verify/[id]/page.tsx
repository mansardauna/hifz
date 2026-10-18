'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CertificateVerifier = dynamic(
  () =>
    import('../../../src/components/certificate/CertificateVerifier').then(
      (mod) => mod.CertificateVerifier
    ),
  { ssr: false }
);

interface VerifyPageProps {
  params: { id: string };
}

export default function GlobalVerifyCertificatePage({ params }: VerifyPageProps) {
  return <CertificateVerifier certificateId={params.id} />;
}
