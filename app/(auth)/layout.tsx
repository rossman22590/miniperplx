'use client';

import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { SciraLogo } from '@/components/logos/scira-logo';

const testimonials = [
  {
    content:
      '"Datavibes @sciraai is better than Grok at digging up information from X, its own platform! I asked it 3 different queries to help scrape and find some data points I was interested in about my own account and Datavibes did much much better with insanely accurate answers!"',
    author: 'Chris Universe',
    handle: '@chrisuniverseb',
    link: 'https://x.com/chrisuniverseb/status/1943025911043100835',
  },
  {
    content: '"scira dot ai does a really good job scraping through the reddit mines btw"',
    author: 'nyaaier',
    handle: '@nyaaier',
    link: 'https://x.com/nyaaier/status/1932810453107065284',
  },
  {
    content:
      "Hi @sciraai, just for curiosity, I searched for myself using its Gemini 2.5 Pro and in extreme mode to see what results it could generate. And it created this 👇🏻 It is not just the best, it is wild. And the best part is it's 10000% accurate.",
    author: 'Aniruddha Dak',
    handle: '@aniruddhadak',
    link: 'https://x.com/aniruddhadak/status/1917140602107445545',
  },
  {
    content:
      '"read nothing the whole sem and here I am with @sciraai to top my mid sems !! Literally so good to get all the related diagram, points and even topics from the website my professor uses to teach us 🙌"',
    author: 'Rajnandinit',
    handle: '@itsRajnandinit',
    link: 'https://x.com/itsRajnandinit/status/1897896134837682288',
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex items-center justify-between h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 h-full bg-muted/30 flex-col">
        <div className="flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <SciraLogo className="size-8" />
              <span className="text-lg font-medium">Datavibes AI</span>
            </Link>
          </div>

          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-3">AI Search that actually understands you</h2>
              <p className="text-muted-foreground mb-6">Skip the ads. Get real answers. From the latest AI models.</p>
              <div className="flex justify-center">
                <img 
                  src="https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1759032316861-imagencraft-1759032309242.png" 
                  alt="AI Search Interface" 
                  className="max-w-sm w-full rounded-xl shadow-xl border border-border/20"
                />
              </div>
            </div>
          </div>

          <div className="opacity-0">
            {/* Spacer to balance the layout */}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 md:px-8">{children}</div>
    </div>
  );
}
