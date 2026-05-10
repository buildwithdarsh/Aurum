import type { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Aurum',
        url: siteUrl,
        description:
          'Next-generation digital banking delivering a refined, frictionless financial experience for modern users.',
      },
      {
        '@type': 'Organization',
        name: 'Aurum Financial Technologies Pvt. Ltd.',
        url: siteUrl,
        logo: `${siteUrl}/favicon.ico`,
      },
      {
        '@type': 'WebPage',
        name: 'Aurum — Secure Digital Banking for Modern Users',
        description:
          'Experience effortless digital banking with instant transfers, smart analytics, and bank-grade AES-256 encryption.',
        url: siteUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
