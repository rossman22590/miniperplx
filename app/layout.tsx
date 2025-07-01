import './globals.css';
import 'katex/dist/katex.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://account.myapps.ai'),
  title: {
    default: 'Datavibes AI',
    template: '%s | Datavibes AI',
    absolute: 'Datavibes AI',
  },
  description: 'Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet.',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.png',
        color: '#000000'
      }
    ]
  },
  manifest: '/manifest.ts',
  openGraph: {
    url: 'https://Datavibes.ai',
    siteName: 'Datavibes AI',
    images: [
      {
        url: '/icon.png',
        width: 32,
        height: 32
      }
    ]
  },
  keywords: [
    'Datavibes.ai',
    'ai search engine',
    'Datavibes ai',
    'Datavibes AI',
    'Datavibes AI',
    'Datavibes.AI',
    'Datavibes github',
    'ai search engine',
    'Datavibes',
    'Datavibes',
    'Datavibes.app',
    'Datavibes ai',
    'Datavibes ai app',
    'Datavibes',
    'MiniPerplx',
    'Datavibes AI',
    'Perplexity alternatives',
    'Perplexity AI alternatives',
    'open source ai search engine',
    'minimalistic ai search engine',
    'minimalistic ai search alternatives',
    'ai search',
    'minimal ai search',
    'minimal ai search alternatives',
    'Datavibes (Formerly MiniPerplx)',
    'AI Search Engine',
    'mplx.run',
    'mplx ai',
    'zaid mukaddam',
    'Datavibes.how',
    'search engine',
    'AI',
    'perplexity',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-be-vietnam-pro',
  preload: true,
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${beVietnamPro.variable} font-sans antialiased`} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Toaster position="top-center" />
            {children}
          </Providers>
        </NuqsAdapter>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
