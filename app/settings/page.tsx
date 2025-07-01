'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserMessageCount, getCurrentUser, getExtremeSearchUsageCount } from '@/app/actions';
import { SEARCH_LIMITS } from '@/lib/constants';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client';
import { useUsageData } from '@/hooks/use-usage-data';
import { User } from '@/lib/db/schema';

import {
  Gear,
  MagnifyingGlass,
  Lightning,
  TrendUp,
  Shield,
  Sparkle,
  User as PhosphorUser,
  ChartLineUp,
  Memory,
  ArrowLeft,
  House,
} from '@phosphor-icons/react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getAllMemories, searchMemories, deleteMemory, MemoryItem } from '@/lib/memory-actions';
import { Loader2, Search, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Component for Profile Information with its own loading state
function ProfileSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (userError) {
      console.error('Error fetching user data:', userError);
      toast.error('Failed to load profile data');
    }
  }, [userError]);

  if (userLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhosphorUser className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information and profile settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className="text-lg">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} placeholder="Enter your email" disabled className="bg-muted" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={async () => {
              try {
                // Here you would typically call an API to update the user profile
                // For now, we'll just show a success message
                toast.success('Profile updated successfully');
              } catch (error) {
                toast.error('Failed to update profile');
              }
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setName(user?.name || '');
              setEmail(user?.email || '');
            }}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for Usage Information with its own loading state
function UsageSection() {
  const { data: session } = useSession();
  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  } : null;
  
  const {
    data: usageData,
    isLoading: usageLoading,
    error: usageError,
    refetch: refetchUsageData,
  } = useUsageData(user);

  useEffect(() => {
    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      toast.error('Failed to load usage data');
    }
  }, [usageError]);

  const handleRefreshUsage = async () => {
    try {
      await refetchUsageData();
      toast.success('Usage data refreshed');
    } catch (error) {
      toast.error('Failed to refresh usage data');
    }
  };

  const searchLimit = SEARCH_LIMITS.DAILY_SEARCH_LIMIT;
  const dailySearchCount = usageData?.count || 0;
  const extremeCount = usageData?.extremeSearchCount || 0;
  const usagePercentage = Math.min((dailySearchCount / SEARCH_LIMITS.DAILY_SEARCH_LIMIT) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartLineUp className="h-5 w-5" />
              Daily Search Usage
            </CardTitle>
            <CardDescription>Track your daily search consumption and limits</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefreshUsage}>
            <TrendUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Usage Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Searches */}
          <div className="p-4 border rounded-lg bg-card h-32 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground leading-tight">Today's Searches</span>
                <span className="text-[10px] text-muted-foreground/70">(Other models)</span>
              </div>
              <MagnifyingGlass className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="mt-auto">
              {usageLoading ? (
                <Skeleton className="h-7 w-10" />
              ) : (
                <span className="text-xl font-bold leading-tight">{dailySearchCount}</span>
              )}
            </div>
          </div>

          {/* Free Unlimited Models */}
          <div className="p-4 border rounded-lg bg-card h-32 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground leading-tight">Grok 3 Mini & Vision</span>
                <span className="text-[10px] text-muted-foreground/70">Unlimited access</span>
              </div>
              <Sparkle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="mt-auto">
              <span className="text-xl font-bold leading-tight">∞</span>
            </div>
          </div>

          {/* Extreme Searches */}
          <div className="p-4 border rounded-lg bg-card h-32 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground leading-tight">Extreme Searches</span>
                <span className="text-[10px] text-muted-foreground/70">(Monthly)</span>
              </div>
              <Lightning className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="mt-auto">
              {usageLoading ? (
                <Skeleton className="h-7 w-10" />
              ) : (
                <span className="text-xl font-bold leading-tight">{extremeCount}</span>
              )}
            </div>
          </div>

          {/* Daily Limit */}
          <div className="p-4 border rounded-lg bg-card h-32 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground leading-tight">Daily Limit</span>
                <span className="text-[10px] text-muted-foreground/70">(Other models)</span>
              </div>
              <Shield className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="mt-auto">
              <span className="text-xl font-bold leading-tight">{searchLimit}</span>
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Search Usage (Other Models Only)</span>
              <span className="text-muted-foreground">{usagePercentage.toFixed(1)}% used</span>
            </div>
            <Progress value={usagePercentage} />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{dailySearchCount} of {searchLimit} searches used today</span>
              <span className="text-muted-foreground">{searchLimit - dailySearchCount} remaining</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Extreme Search Usage (Monthly)</span>
              <span className="text-muted-foreground">
                {Math.min((extremeCount / SEARCH_LIMITS.EXTREME_SEARCH_LIMIT) * 100, 100).toFixed(1)}% used
              </span>
            </div>
            <Progress value={Math.min((extremeCount / SEARCH_LIMITS.EXTREME_SEARCH_LIMIT) * 100, 100)} />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{extremeCount} of {SEARCH_LIMITS.EXTREME_SEARCH_LIMIT} extreme searches used this month</span>
              <span className="text-muted-foreground">{SEARCH_LIMITS.EXTREME_SEARCH_LIMIT - extremeCount} remaining</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for Memories with its own loading state
function MemoriesSection() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Memory queries
  const {
    data: memoriesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: memoriesLoading,
  } = useInfiniteQuery({
    queryKey: ['memories'],
    queryFn: async ({ pageParam }) => {
      const pageNumber = pageParam as number;
      return await getAllMemories(pageNumber);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.memories.length >= 20;
      return hasMore ? Number(lastPage.memories[lastPage.memories.length - 1]?.id) : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Search query for memories
  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: performSearch,
  } = useQuery({
    queryKey: ['memories', 'search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { memories: [], total: 0 };
      return await searchMemories(searchQuery);
    },
    enabled: false, // Don't run automatically, only when search is triggered
  });

  // Delete memory mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMemory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.success('Memory successfully deleted');
    },
    onError: (error) => {
      console.error('Delete memory error:', error);
      toast.error('Failed to delete memory');
    },
  });

  // Memory helper functions
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await performSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    queryClient.invalidateQueries({ queryKey: ['memories', 'search'] });
  };

  const handleDeleteMemory = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Get memory content based on the response type
  const getMemoryContent = (memory: MemoryItem): string => {
    if (memory.memory) return memory.memory;
    if (memory.name) return memory.name;
    return 'No content available';
  };

  // Determine which memories to display
  const displayedMemories =
    searchQuery.trim() && searchResults
      ? searchResults.memories
      : memoriesData?.pages.flatMap((page) => page.memories) || [];

  // Calculate total memories
  const totalMemories =
    searchQuery.trim() && searchResults
      ? searchResults.total
      : memoriesData?.pages.reduce((acc, page) => acc + page.memories.length, 0) || 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Memory className="h-4 w-4" />
          Your Memories
        </CardTitle>
        <CardDescription className="text-sm">Manage your saved conversation memories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="flex-1 h-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
          />
          <Button
            onClick={handleSearch}
            size="sm"
            variant="secondary"
            disabled={isSearching || !searchQuery.trim()}
            className="h-8 w-8 p-0"
          >
            {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
          </Button>
          {searchQuery.trim() && (
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-muted-foreground">
            {totalMemories} {totalMemories === 1 ? 'memory' : 'memories'}
          </span>
        </div>

        <ScrollArea className="h-[300px]">
          {memoriesLoading && !displayedMemories.length ? (
            <div className="flex flex-col justify-center items-center h-[280px]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : displayedMemories.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[280px] border border-dashed rounded-md bg-muted/30">
              <Memory className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No memories found</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                {searchQuery ? 'Try a different search term' : 'Memories will appear here when you save them'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 pr-3">
              {displayedMemories.map((memory: MemoryItem) => (
                <div
                  key={memory.id}
                  className="group relative p-3 rounded-md border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1 pr-2">
                      {getMemoryContent(memory)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMemory(memory.id)}
                      className={cn(
                        'h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0',
                        'opacity-0 group-hover:opacity-100 transition-opacity',
                      )}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Memory className="h-3 w-3" />
                    <span>{formatDate(memory.created_at)}</span>
                  </div>
                </div>
              ))}

              {hasNextPage && !searchQuery.trim() && (
                <div className="pt-1 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    size="sm"
                    className="h-7 text-xs"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function SettingsContent() {
  const [currentTab, setCurrentTab] = useState('profile');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'usage', 'memories'].includes(tab)) {
      setCurrentTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {/* Header - always shows immediately */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" asChild>
            <Link href="/new">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to search</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <House className="h-4 w-4" />
            <span>/</span>
            <span className="text-foreground">Settings</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and usage preferences</p>
        </div>
      </div>

      {/* Tabs - always shows immediately */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="memories">Memories</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Suspense fallback={<div>Loading profile...</div>}>
            <ProfileSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Suspense fallback={<div>Loading usage data...</div>}>
            <UsageSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="memories" className="space-y-4">
          <Suspense fallback={<div>Loading memories...</div>}>
            <MemoriesSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}