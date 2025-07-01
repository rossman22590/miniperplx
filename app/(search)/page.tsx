'use client';

import { Suspense } from 'react';
import { ChatInterface } from '@/components/chat-interface';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense>
      <div className={cn(
        "flex flex-col min-h-screen w-full",
        isMobile ? "px-2 py-1" : "px-4 py-2"
      )}>
        <ChatInterface />
        <InstallPrompt />
      </div>
    </Suspense>
  );
};

export default Home;
