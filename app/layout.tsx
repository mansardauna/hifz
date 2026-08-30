import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Poppins, DM_Sans, Amiri } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#047857',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'TechMadrasah - Custom-Branded Online Academy Infrastructure',
  description:
    'The premier educational SaaS LMS and visual page builder powering Quran institutes, coding bootcamps, and language academies. Custom domains, WebRTC video classrooms, code sandboxes, and autonomous tuition processing.',
  keywords: ['TechMadrasah', 'Academy OS', 'Quran LMS', 'Coding Bootcamp SaaS', 'Multi-Tenant Academy', 'GrapesJS Builder', 'LiveKit WebRTC'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'TechMadrasah',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icons/icon.svg',
    shortcut: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  openGraph: {
    title: 'TechMadrasah - Custom-Branded Online Academy Infrastructure',
    description: 'Launch your branded online academy with custom domains, real WebRTC classrooms, code sandboxes, and automated tuition billing.',
    siteName: 'TechMadrasah',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable} ${amiri.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
