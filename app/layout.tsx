import './globals.css';
import 'katex/dist/katex.min.css';
import 'leaflet/dist/leaflet.css';

import { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Baumans, Geist, Instrument_Serif } from 'next/font/google';
import { GeistPixelSquare, GeistPixelGrid } from 'geist/font/pixel';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sileo-toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NewChatHotkey } from '@/components/new-chat-hotkey';
import { ClientAnalytics } from '@/components/client-analytics';
import { HapticsProvider } from '@/components/haptics-provider';

import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://mydatavibes.com'),
  title: {
    default: 'Datavibes AI - Faster intelligent search, a Perplexity alternative',
    template: '%s | Datavibes AI',
  },
  description:
    'Datavibes AI is a fast AI search engine with real-time web results, citations, and modern models for focused research.',
  openGraph: {
    url: 'https://mydatavibes.com',
    siteName: 'Datavibes AI',
  },
  keywords: [
    'agentic research platform',
    'agentic research',
    'agentic search',
    'agentic search engine',
    'agentic search platform',
    'agentic search tool',
    'mydatavibes.com',
    'datavibes ai',
    'datavibes',
    'mydatavibes',
    'ai research assistant',
    'ai research tool',
    'ai search tool',
    'ai answer engine',
    'research workspace',
    'research monitoring',
    'live web research',
    'source-backed search',
    'perplexity ai alternative',
    'perplexity alternative',
    'chatgpt alternative',
    'ai search engine',
    'search engine',
    'Perplexity alternatives',
    'Perplexity AI alternatives',
    'voice ai assistant',
    'monitoring workspace',
    'research automation',
    'citation-based answers',
    'perplexity',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://mydatavibes.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9F9F9' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-be-vietnam-pro',
  preload: true,
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const baumans = Baumans({
  subsets: ['latin'],
  variable: '--font-baumans',
  preload: true,
  display: 'swap',
  weight: ['400'],
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  preload: true,
  display: 'swap',
  weight: ['400'],
  style: ['normal', 'italic'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${beVietnamPro.variable} ${baumans.variable} ${instrumentSerif.variable} ${GeistPixelSquare.variable} ${GeistPixelGrid.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <Providers>
            <SidebarProvider>
              <Toaster position="top-center" />
              <HapticsProvider />
              <NewChatHotkey />
              {children}
            </SidebarProvider>
          </Providers>
        </NuqsAdapter>
        <ClientAnalytics />
      </body>
    </html>
  );
}
