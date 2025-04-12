import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import 'katex/dist/katex.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Metadata, Viewport } from "next";
import { Syne } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL("https://myapps.ai"),
  title: "Datavibes",
  description: "Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myapps.ai",
    title: "Datavibes",
    description: "Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet.",
    siteName: "Datavibes",
    images: [
      {
        url: "https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Datavibes AI Search Engine",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Datavibes",
    description: "Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet.",
    images: ["https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png"],
    site: "@datavibes",
    creator: "@datavibes",
  },
  other: {
    "og:logo": "https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png"
  },
  keywords: [
    "open source ai search engine",
    "minimalistic ai search engine",
    "ai search engine",
    "Scira (Formerly MiniPerplx)",
    "AI Search Engine",
    "mplx.run",
    "mplx ai",
    "zaid mukaddam",
    "scira.how",
    "search engine",
    "AI",
    "perplexity",
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }
  ],
}

const syne = Syne({ 
  subsets: ['latin'], 
  variable: '--font-syne',
   preload: true,
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myapps.ai" />
        <meta property="og:title" content="Datavibes" />
        <meta property="og:description" content="Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet." />
        <meta property="og:image" content="https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:logo" content="https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://myapps.ai" />
        <meta name="twitter:title" content="Datavibes" />
        <meta name="twitter:description" content="Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet." />
        <meta name="twitter:image" content="https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png" />
      </head>
      <body className={`${GeistSans.variable} ${syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Toaster position="top-center" />
            {children}
          </Providers>
        </NuqsAdapter>
        <Analytics />
        <script async src="https://cdn.seline.com/seline.js" data-token={process.env.SELINE_TOKEN}></script>
      </body>
    </html>
  );
}
