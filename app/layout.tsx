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
  title: "Datavibes AI",
  description: "Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet.",
  openGraph: {
    url: "https://myapps.ai",
    siteName: "Datavibes AI",
    images: [
      {
        url: "https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1745010111962-@Screenshot%202025-04-18%20170127.png",
        width: 1200,
        height: 630,
        alt: "Datavibes AI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Datavibes AI",
    description: "Datavibes AI is a minimalistic AI-powered search engine that helps you find information on the internet.",
    images: ["https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1745010111962-@Screenshot%202025-04-18%20170127.png"]
  },
  keywords: [
    "myapps.ai",
    "myapps ai",
    "MyApps AI",
    "myapps AI",
    "MYAPPS.AI",
    "myapps github",
    "ai search engine",
    "Datavibes",
    "datavibes",
    "datavibes.app",
    "datavibes ai",
    "datavibes ai app",
    "datavibes",
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
