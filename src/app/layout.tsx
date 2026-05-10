import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Toasts } from '@/components/Toasts';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aurum — Secure Digital Banking for Modern Users',
    template: '%s | Aurum',
  },
  description:
    'Experience effortless digital banking with instant transfers, smart analytics, and bank-grade AES-256 encryption — all in one refined platform.',
  keywords: ['banking', 'digital banking', 'finance', 'aurum', 'online banking', 'secure banking'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aurum',
    title: 'Aurum — Secure Digital Banking for Modern Users',
    description:
      'Experience effortless digital banking with instant transfers, smart analytics, and bank-grade AES-256 encryption.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurum — Secure Digital Banking for Modern Users',
    description:
      'Experience effortless digital banking with instant transfers, smart analytics, and bank-grade AES-256 encryption.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toasts />
        </Providers>
      </body>
    </html>
  );
}
