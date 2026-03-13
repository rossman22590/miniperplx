'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Crown02Icon, Analytics01Icon, UserBlock01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@/components/ui/hugeicons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { clearUserSessionsAction, setUserBanStatusAction, setUserProStatusAction } from '@/app/admin/actions';
import type { AdminUserRecord } from '@/lib/admin';
import { cn } from '@/lib/utils';

function formatDate(date: Date | null) {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function UserRow({
  record,
  adminEmail,
}: {
  record: AdminUserRecord;
  adminEmail: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [banReason, setBanReason] = useState(record.banReason ?? '');
  const isSelf = record.email.toLowerCase() === adminEmail.toLowerCase();

  const initials =
    record.name
      ?.split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const runAction = (fn: () => Promise<void>, successMessage: string) => {
    startTransition(async () => {
      try {
        await fn();
        toast.success(successMessage);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Admin action failed');
      }
    });
  };

  return (
    <TableRow className={cn(record.isBanned && 'bg-destructive/5')}>
      <TableCell className="min-w-[260px]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={record.image ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{record.name}</p>
              {record.email === adminEmail && <Badge variant="secondary">Admin</Badge>}
              {record.isPro ? (
                <Badge className="bg-primary text-primary-foreground">Pro</Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
              {record.isBanned && <Badge variant="destructive">Banned</Badge>}
            </div>
            <p className="truncate text-xs text-muted-foreground">{record.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{record.chatCount} chats</p>
          <p>{record.lookoutCount} lookouts</p>
          <p>{record.sessionCount} sessions</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs">
          <p className="font-medium capitalize">{record.subscriptionStatus}</p>
          <p className="text-muted-foreground">Ends {formatDate(record.subscriptionEndsAt)}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Joined {formatDate(record.createdAt)}</p>
          <p>Updated {formatDate(record.updatedAt)}</p>
        </div>
      </TableCell>
      <TableCell className="min-w-[280px]">
        <div className="space-y-3">
          <Textarea
            value={banReason}
            onChange={(event) => setBanReason(event.target.value)}
            placeholder="Ban reason for audit trail"
            className="min-h-[84px] text-xs"
            disabled={pending || isSelf}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={pending || isSelf}
              onClick={() =>
                runAction(
                  () => setUserProStatusAction(record.id, !record.isPro).then(() => Promise.resolve()),
                  record.isPro ? 'Pro access removed' : 'Pro access granted',
                )
              }
            >
              <HugeiconsIcon icon={Crown02Icon} size={16} strokeWidth={1.5} />
              {record.isPro ? 'Revoke Pro' : 'Make Pro'}
            </Button>
            <Button
              size="sm"
              variant={record.isBanned ? 'outline' : 'destructive'}
              disabled={pending || isSelf}
              onClick={() =>
                runAction(
                  () => setUserBanStatusAction(record.id, !record.isBanned, banReason).then(() => Promise.resolve()),
                  record.isBanned ? 'User unbanned' : 'User banned and sessions cleared',
                )
              }
            >
              <HugeiconsIcon icon={UserBlock01Icon} size={16} strokeWidth={1.5} />
              {record.isBanned ? 'Unban' : 'Ban User'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending || isSelf}
              onClick={() =>
                runAction(
                  () => clearUserSessionsAction(record.id).then(() => Promise.resolve()),
                  'Sessions cleared',
                )
              }
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.5} />
              Clear Sessions
            </Button>
          </div>
          {record.isBanned && record.banReason && (
            <p className="text-xs text-muted-foreground">
              Current ban note: <span className="text-foreground">{record.banReason}</span>
            </p>
          )}
          {isSelf && <p className="text-xs text-muted-foreground">Self-protection is enabled for the admin account.</p>}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AdminPanel({
  users,
  adminEmail,
}: {
  users: AdminUserRecord[];
  adminEmail: string;
}) {
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;

    return users.filter((record) => {
      return (
        record.name.toLowerCase().includes(needle) ||
        record.email.toLowerCase().includes(needle) ||
        record.id.toLowerCase().includes(needle)
      );
    });
  }, [query, users]);

  const totalUsers = users.length;
  const proUsers = users.filter((record) => record.isPro).length;
  const bannedUsers = users.filter((record) => record.isBanned).length;
  const activeSessions = users.reduce((sum, record) => sum + record.sessionCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardDescription>Total users</CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">All accounts in the auth table.</CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardDescription>Pro accounts</CardDescription>
            <CardTitle className="text-3xl">{proUsers}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Derived from active subscription records.</CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardDescription>Banned accounts</CardDescription>
            <CardTitle className="text-3xl">{bannedUsers}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Stored in admin preference flags and enforced on chat.</CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardDescription>Active sessions</CardDescription>
            <CardTitle className="text-3xl">{activeSessions}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Useful for force sign-out after bans.</CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription>Hard-gated to {adminEmail}. Manual Pro grants create real subscription records.</CardDescription>
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <HugeiconsIcon icon={Analytics01Icon} size={18} strokeWidth={1.5} className="text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email, or user ID"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Timestamps</TableHead>
                  <TableHead>Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((record) => (
                  <UserRow key={record.id} record={record} adminEmail={adminEmail} />
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No users matched your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
