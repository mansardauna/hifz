import React from 'react';
import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Hifz - The White-Label LMS & Website Builder for Quran Academies',
  description:
    'The premier SaaS LMS and visual website builder engineered for Quran institutes, Madrasahs, and Arabic tutors. White-label custom subdomains, real GrapesJS canvas, Uthmani Tajweed reader, audio homework grading, and direct tuition payments.',
  keywords: ['Hifz', 'Quran LMS', 'Madrasah SaaS', 'GrapesJS Builder', 'Tajweed LMS', 'Islamic Institute Software'],
  openGraph: {
    title: 'Hifz - The White-Label LMS & Website Builder for Quran Academies',
    description: 'Launch your branded online Quran academy with custom subdomains, GrapesJS visual builder, and automated tuition billing.',
    siteName: 'Hifz',
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
