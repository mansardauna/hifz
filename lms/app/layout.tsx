import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';


export const viewport: Viewport = {
  themeColor: '#047857',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Ankabit LMS - Multi-Tenant Academy Operating System',
  description:
    'The premier educational SaaS LMS powering Madrasats, Code Academies, and Schools. Custom subdomains, WebRTC video classrooms, Monaco code sandboxes, and automated tuition processing.',
  keywords: ['Ankabit LMS', 'Academy OS', 'Madrasat LMS', 'Code Academy SaaS', 'School SIS', 'Multi-Tenant Academy', 'GrapesJS Builder', 'LiveKit WebRTC'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Ankabit LMS',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icons/icon.svg',
    shortcut: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  openGraph: {
    title: 'Ankabit LMS - Multi-Tenant Academy Operating System',
    description: 'Launch your branded Madrasat, Code Academy, or School with custom subdomains, live classrooms, code sandboxes, and automated student management.',
    siteName: 'Ankabit LMS',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
