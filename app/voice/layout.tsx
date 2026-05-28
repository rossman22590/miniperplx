import { Metadata } from "next";

const title = "Datavibes Voice";
const description = "Have a voice conversation with Datavibes AI. Ask questions, search the web, and get real-time responses with our advanced voice AI assistant.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://mydatavibes.com/voice",
    siteName: "Datavibes AI",
    type: "website",
    images: [
      {
        url: "https://mydatavibes.com/voice/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Datavibes Voice - AI Voice Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://mydatavibes.com/voice/twitter-image.png"],
    creator: "@ddatavibes",
  },
  alternates: {
    canonical: "https://mydatavibes.com/voice",
  },
};

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
