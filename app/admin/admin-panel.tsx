'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Crown02Icon,
  Analytics01Icon,
  UserBlock01Icon,
  Logout01Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@/components/ui/hugeicons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  clearUserSessionsAction,
  setUserBanStatusAction,
  setUserLimitOverridesAction,
  setUserMaxStatusAction,
  setUserProStatusAction,
} from '@/app/admin/actions';
import type { AdminUserRecord } from '@/lib/admin';
import {
  DEFAULT_LIMITS,
  LIMIT_LABELS,
  type UserLimitOverrideInput,
  type UserLimitOverrides,
  type UserLimits,
} from '@/lib/limits';
import { cn } from '@/lib/utils';

const LIMIT_KEYS = Object.keys(DEFAULT_LIMITS) as (keyof UserLimits)[];
const FREE_LIMIT_KEYS: (keyof UserLimits)[] = ['dailySearch', 'extremeSearch'];
const MAX_LIMIT_KEYS: (keyof UserLimits)[] = ['anthropicWeekly', 'googleMonthly'];

const USAGE_LABELS: Record<keyof UserLimits, string> = {
  dailySearch: 'Searches today',
  extremeSearch: 'Extreme this month',
  anthropicWeekly: 'Anthropic this week',
  googleMonthly: 'Gemini this month',
};

type LimitDraft = Record<keyof UserLimits, string>;

function draftFromOverrides(overrides: UserLimitOverrides): LimitDraft {
  return LIMIT_KEYS.reduce((draft, key) => {
    draft[key] = overrides[key] !== undefined ? String(overrides[key]) : '';
    return draft;
  }, {} as LimitDraft);
}

function formatDate(date: Date | string | null) {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getInitials(name: string) {
  return (
    name
      ?.split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  );
}

/** Which limit keys actually apply to this user's tier. */
function applicableLimitKeys(record: AdminUserRecord): (keyof UserLimits)[] {
  if (record.isMax) return MAX_LIMIT_KEYS;
  if (record.isPro) return [];
  return FREE_LIMIT_KEYS;
}

function PlanBadge({ record }: { record: AdminUserRecord }) {
  if (record.isMax) return <Badge className="bg-purple-600 text-white">Max</Badge>;
  if (record.isPro) return <Badge className="bg-primary text-primary-foreground">Pro</Badge>;
  return <Badge variant="outline">Free</Badge>;
}

function UserIdentity({
  record,
  adminEmail,
  size = 'sm',
}: {
  record: AdminUserRecord;
  adminEmail: string;
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className={size === 'lg' ? 'h-12 w-12' : 'h-9 w-9'}>
        <AvatarImage src={record.image ?? ''} />
        <AvatarFallback>{getInitials(record.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className={cn('truncate font-medium', size === 'lg' && 'text-base')}>{record.name}</p>
          {record.email.toLowerCase() === adminEmail.toLowerCase() && <Badge variant="secondary">Admin</Badge>}
          <PlanBadge record={record} />
          {record.isBanned && <Badge variant="destructive">Banned</Badge>}
        </div>
        <p className="truncate text-xs text-muted-foreground">{record.email}</p>
      </div>
    </div>
  );
}

function UsageSummary({ record }: { record: AdminUserRecord }) {
  const keys = applicableLimitKeys(record);
  if (keys.length === 0) {
    return <p className="text-xs text-muted-foreground">Unlimited</p>;
  }
  return (
    <div className="space-y-0.5 text-xs">
      {keys.map((key) => {
        const used = record.usage[key];
        const limit = record.limits[key];
        const isOverride = record.limitOverrides[key] !== undefined;
        return (
          <p key={key} className={cn('text-muted-foreground', used >= limit && 'text-destructive')}>
            <span className="tabular-nums text-foreground">
              {used}/{limit}
            </span>{' '}
            {USAGE_LABELS[key].toLowerCase()}
            {isOverride && <span className="ml-1 text-[10px] text-primary">(custom)</span>}
          </p>
        );
      })}
    </div>
  );
}

function UsageMeter({ record, limitKey }: { record: AdminUserRecord; limitKey: keyof UserLimits }) {
  const used = record.usage[limitKey];
  const limit = record.limits[limitKey];
  const percent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isOverride = record.limitOverrides[limitKey] !== undefined;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {USAGE_LABELS[limitKey]}
          {isOverride && (
            <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px] leading-4">
              custom
            </Badge>
          )}
        </span>
        <span className={cn('tabular-nums', used >= limit ? 'text-destructive' : 'text-foreground')}>
          {used} / {limit}
        </span>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

function LimitOverridesForm({
  record,
  disabled,
  onSave,
}: {
  record: AdminUserRecord;
  disabled: boolean;
  onSave: (overrides: UserLimitOverrideInput, successMessage: string) => void;
}) {
  const [draft, setDraft] = useState<LimitDraft>(() => draftFromOverrides(record.limitOverrides));

  // Re-sync the draft when the server record changes (after save / refresh).
  useEffect(() => {
    setDraft(draftFromOverrides(record.limitOverrides));
  }, [record.limitOverrides]);

  const hasOverrides = LIMIT_KEYS.some((key) => record.limitOverrides[key] !== undefined);
  const isDirty = LIMIT_KEYS.some((key) => draft[key] !== (record.limitOverrides[key]?.toString() ?? ''));

  const handleSave = () => {
    const overrides: UserLimitOverrideInput = {};
    for (const key of LIMIT_KEYS) {
      const raw = draft[key].trim();
      if (raw === '') {
        overrides[key] = null;
        continue;
      }
      const value = Number(raw);
      if (!Number.isInteger(value) || value < DEFAULT_LIMITS[key]) {
        toast.error(`${LIMIT_LABELS[key]} must be a whole number of at least ${DEFAULT_LIMITS[key]}`);
        return;
      }
      overrides[key] = value;
    }
    onSave(overrides, 'Limits updated');
  };

  const handleReset = () => {
    onSave(
      LIMIT_KEYS.reduce((cleared, key) => {
        cleared[key] = null;
        return cleared;
      }, {} as UserLimitOverrideInput),
      'Limits reset to defaults',
    );
  };

  const renderGroup = (title: string, keys: (keyof UserLimits)[], active: boolean) => (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        {title}
        {!active && <span className="ml-1 font-normal">(not active for this plan)</span>}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {keys.map((key) => (
          <div key={key} className="space-y-1">
            <Label htmlFor={`limit-${record.id}-${key}`} className="text-xs">
              {LIMIT_LABELS[key]}
            </Label>
            <Input
              id={`limit-${record.id}-${key}`}
              type="number"
              inputMode="numeric"
              min={DEFAULT_LIMITS[key]}
              step={1}
              value={draft[key]}
              placeholder={`${DEFAULT_LIMITS[key]} (default)`}
              onChange={(event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))}
              disabled={disabled}
              className="h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderGroup('Free tier', FREE_LIMIT_KEYS, !record.isPro)}
      {renderGroup('Max tier', MAX_LIMIT_KEYS, record.isMax)}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={disabled || !isDirty} onClick={handleSave}>
          Save limits
        </Button>
        <Button size="sm" variant="outline" disabled={disabled || !hasOverrides} onClick={handleReset}>
          Reset to defaults
        </Button>
        {record.limitsUpdatedAt && (
          <span className="text-xs text-muted-foreground">Last changed {formatDate(record.limitsUpdatedAt)}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Overrides are permanent for this user. Leave a field blank to use the default. Values can&apos;t go below the
        default.
      </p>
    </div>
  );
}

function ManageUserSheet({
  record,
  adminEmail,
  open,
  onOpenChange,
}: {
  record: AdminUserRecord | null;
  adminEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    setBanReason(record?.banReason ?? '');
  }, [record?.id, record?.banReason]);

  const isSelf = Boolean(record && record.email.toLowerCase() === adminEmail.toLowerCase());

  const runAction = (fn: () => Promise<unknown>, successMessage: string) => {
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

  const planDescription = record
    ? `${record.subscriptionStatus === 'none' ? 'No subscription' : `Status: ${record.subscriptionStatus}`}${
        record.subscriptionEndsAt ? ` · ends ${formatDate(record.subscriptionEndsAt)}` : ''
      }`
    : '';

  const banDescription = record
    ? record.isBanned
      ? `Banned${record.banUpdatedAt ? ` ${formatDate(record.banUpdatedAt)}` : ''}${
          record.banReason ? ` · ${record.banReason}` : ''
        }`
      : 'Blocks chat access and clears all sessions.'
    : '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        {record && (
          <>
            <SheetHeader className="pr-10">
              <SheetTitle asChild>
                <div>
                  <UserIdentity record={record} adminEmail={adminEmail} size="lg" />
                </div>
              </SheetTitle>
              <SheetDescription>
                Joined {formatDate(record.createdAt)} · {record.chatCount} chats · {record.lookoutCount} lookouts ·{' '}
                {record.sessionCount} active sessions
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              {isSelf && (
                <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                  Self-protection is enabled: plan, ban, and session controls are disabled for the admin account.
                </p>
              )}

              <section className="space-y-3">
                <SectionTitle title="Plan" description={planDescription} />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={record.isPro ? 'outline' : 'default'}
                    disabled={pending || isSelf}
                    onClick={() =>
                      runAction(
                        () => setUserProStatusAction(record.id, !record.isPro),
                        record.isPro ? 'Pro access removed' : 'Pro access granted',
                      )
                    }
                  >
                    <HugeiconsIcon icon={Crown02Icon} size={16} strokeWidth={1.5} />
                    {record.isPro ? 'Revoke Pro' : 'Make Pro'}
                  </Button>
                  <Button
                    size="sm"
                    variant={record.isMax ? 'outline' : 'default'}
                    className={!record.isMax ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}
                    disabled={pending || isSelf}
                    onClick={() =>
                      runAction(
                        () => setUserMaxStatusAction(record.id, !record.isMax),
                        record.isMax ? 'Max access removed' : 'Max access granted',
                      )
                    }
                  >
                    <HugeiconsIcon icon={Crown02Icon} size={16} strokeWidth={1.5} />
                    {record.isMax ? 'Revoke Max' : 'Make Max'}
                  </Button>
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <SectionTitle
                  title="Usage"
                  description="Current period consumption against this user's effective limits."
                />
                {applicableLimitKeys(record).length > 0 ? (
                  <div className="space-y-3">
                    {applicableLimitKeys(record).map((key) => (
                      <UsageMeter key={key} record={record} limitKey={key} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Pro users have unlimited searches.</p>
                )}
              </section>

              <section className="space-y-3">
                <SectionTitle title="Limit overrides" description="Raise this user's caps above the defaults." />
                <LimitOverridesForm
                  key={record.id}
                  record={record}
                  disabled={pending}
                  onSave={(overrides, successMessage) =>
                    runAction(() => setUserLimitOverridesAction(record.id, overrides), successMessage)
                  }
                />
              </section>

              <Separator />

              <section className="space-y-3">
                <SectionTitle title="Sessions" description={`${record.sessionCount} active session(s).`} />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending || isSelf || record.sessionCount === 0}
                  onClick={() => runAction(() => clearUserSessionsAction(record.id), 'Sessions cleared')}
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.5} />
                  Force sign out
                </Button>
              </section>

              <Separator />

              <section className="space-y-3 rounded-lg border border-destructive/30 p-3">
                <SectionTitle title={record.isBanned ? 'Banned' : 'Ban user'} description={banDescription} />
                {!record.isBanned && (
                  <Textarea
                    value={banReason}
                    onChange={(event) => setBanReason(event.target.value)}
                    placeholder="Reason (kept for the audit trail)"
                    className="min-h-[72px] text-sm"
                    disabled={pending || isSelf}
                  />
                )}
                <Button
                  size="sm"
                  variant={record.isBanned ? 'outline' : 'destructive'}
                  disabled={pending || isSelf}
                  onClick={() =>
                    runAction(
                      () => setUserBanStatusAction(record.id, !record.isBanned, banReason),
                      record.isBanned ? 'User unbanned' : 'User banned and sessions cleared',
                    )
                  }
                >
                  <HugeiconsIcon icon={UserBlock01Icon} size={16} strokeWidth={1.5} />
                  {record.isBanned ? 'Unban' : 'Ban user'}
                </Button>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function AdminPanel({ users, adminEmail }: { users: AdminUserRecord[]; adminEmail: string }) {
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  // Derive from the latest server data so the sheet updates after router.refresh().
  const selectedUser = useMemo(
    () => (selectedUserId ? (users.find((record) => record.id === selectedUserId) ?? null) : null),
    [selectedUserId, users],
  );

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
          <CardContent className="text-xs text-muted-foreground">
            Stored in admin preference flags and enforced on chat.
          </CardContent>
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
              <CardDescription>
                Hard-gated to {adminEmail}. Select a user to manage plan, limits, sessions, and bans.
              </CardDescription>
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
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="hidden lg:table-cell">Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((record) => (
                  <TableRow
                    key={record.id}
                    className={cn('cursor-pointer', record.isBanned && 'bg-destructive/5')}
                    onClick={() => setSelectedUserId(record.id)}
                  >
                    <TableCell className="min-w-[240px]">
                      <UserIdentity record={record} adminEmail={adminEmail} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      <p className="font-medium capitalize">{record.subscriptionStatus}</p>
                      {record.subscriptionEndsAt && (
                        <p className="text-muted-foreground">Ends {formatDate(record.subscriptionEndsAt)}</p>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <UsageSummary record={record} />
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground lg:table-cell">
                      <p>
                        {record.chatCount} chats · {record.sessionCount} sessions
                      </p>
                      <p>Joined {formatDate(record.createdAt)}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedUserId(record.id);
                        }}
                      >
                        <HugeiconsIcon icon={Settings02Icon} size={16} strokeWidth={1.5} />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
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

      <ManageUserSheet
        record={selectedUser}
        adminEmail={adminEmail}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUserId(null);
        }}
      />
    </div>
  );
}
