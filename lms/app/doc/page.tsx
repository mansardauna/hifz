import React from 'react';
import type { Metadata } from 'next';
import { DocsPortal } from '@/components/docs/DocsPortal';

export const metadata: Metadata = {
  title: 'Documentation — Ankabit Autonomous LMS',
  description: 'Comprehensive technical documentation, architecture blueprints, API references, and deployment guides for Ankabit LMS.',
};

export default function DocPage() {
  return <DocsPortal />;
}
