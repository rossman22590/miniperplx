// /lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Globe, Book, TelescopeIcon, DollarSign } from 'lucide-react'
import { ChatsCircleIcon, CodeIcon, MemoryIcon, RedditLogoIcon, YoutubeLogoIcon, XLogoIcon } from '@phosphor-icons/react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SearchGroupId = 'web' | 'x' | 'academic' | 'youtube' | 'reddit' | 'analysis' | 'chat' | 'extreme' | 'memory' | 'crypto';

export const searchGroups = [
  {
    id: 'web' as const,
    name: 'Web',
    description: 'Search across the entire internet powered by Tavily',
    icon: Globe,
    show: true,
    requireAuth: false,
  },
  {
    id: 'memory' as const,
    name: 'Memory',
    description: 'Your personal memory companion',
    icon: MemoryIcon,
    show: true,
    requireAuth: true,
  },
  {
    id: 'analysis' as const,
    name: 'Analysis',
    description: 'Code, stock and currency stuff',
    icon: CodeIcon,
    show: true,
    requireAuth: false,
  },
  {
    id: 'crypto' as const,
    name: 'Crypto',
    description: 'Cryptocurrency research powered by CoinGecko',
    icon: DollarSign,
    show: true,
    requireAuth: false,
  },
  {
    id: 'chat' as const,
    name: 'Chat',
    description: 'Talk to the model directly.',
    icon: ChatsCircleIcon,
    show: true,
    requireAuth: false,
  },
  {
    id: 'x' as const,
    name: 'X',
    description: 'Search X posts',
    icon: XLogoIcon,
    show: true,
    requireAuth: false,
  },
  {
    id: 'reddit' as const,
    name: 'Reddit',
    description: 'Search Reddit posts',
    icon: RedditLogoIcon,
    show: true,
    requireAuth: false,
  },
  {
    id: 'academic' as const,
    name: 'Academic',
    description: 'Search academic papers powered by Exa',
    icon: Book,
    show: true,
    requireAuth: false,
  },
  {
    id: 'youtube' as const,
    name: 'YouTube',
    description: 'Search YouTube videos powered by Exa',
    icon: YoutubeLogoIcon,
    show: true,
    requireAuth: false,
  },
  {
    id: 'extreme' as const,
    name: 'Extreme',
    description: 'Deep research with multiple sources and analysis',
    icon: TelescopeIcon,
    show: false,
    requireAuth: true,
  },
] as const;

export type SearchGroup = typeof searchGroups[number];

export function invalidateChatsCache() {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('invalidate-chats-cache');
    window.dispatchEvent(event);
  }
}