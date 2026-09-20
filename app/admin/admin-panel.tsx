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

type LimitDraft = Record<keyof UserLimits, string>;

function draftFromOverrides(overrides: UserLimitOverrides): LimitDraft {
  return LIMIT_KEYS.reduce((draft, key) => {
    draft[key] = overrides[key] !== undefined ? String(overrides[key]) : '';
    return draft;
  }, {} as LimitDraft);
}

function UsageLine({
  label,
  used,
  limit,
  isOverride,
}: {
  label: string;
  used: number;
  limit: number;
  isOverride: boolean;
}) {
  const exhausted = used >= limit;
  return (
    <p className={cn(exhausted && 'text-destructive')}>
      <span className="tabular-nums">
        {used} / {limit}
      </span>{' '}
      {label}
      {isOverride && (
        <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px] leading-4">
          custom
        </Badge>
      )}
    </p>
  );
}

function LimitOverridesEditor({
  record,
  disabled,
  onSave,
}: {
  record: AdminUserRecord;
  disabled: boolean;
  onSave: (overrides: UserLimitOverrideInput, successMessage: string) => void;
}) {
  const [draft, setDraft] = useState<LimitDraft>(() => draftFromOverrides(record.limitOverrides));
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
    setDraft(draftFromOverrides({}));
    onSave(
      LIMIT_KEYS.reduce((cleared, key) => {
        cleared[key] = null;
        return cleared;
      }, {} as UserLimitOverrideInput),
      'Limits reset to defaults',
    );
  };

  return (
    <div className="space-y-2 rounded-lg border p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">Limit overrides</p>
        {record.limitsUpdatedAt && (
          <p className="text-[10px] text-muted-foreground">Updated {formatDate(new Date(record.limitsUpdatedAt))}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {LIMIT_KEYS.map((key) => (
          <label key={key} className="space-y-1">
            <span className="block text-[10px] text-muted-foreground">{LIMIT_LABELS[key]}</span>
            <Input
              type="number"
              inputMode="numeric"
              min={DEFAULT_LIMITS[key]}
              step={1}
              value={draft[key]}
              placeholder={`${DEFAULT_LIMITS[key]} (default)`}
              onChange={(event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))}
              disabled={disabled}
              className="h-8 text-xs"
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={disabled || !isDirty} onClick={handleSave}>
          Save limits
        </Button>
        <Button size="sm" variant="outline" disabled={disabled || !hasOverrides} onClick={handleReset}>
          Reset to defaults
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Permanent per-user caps. Blank fields use the default. Free-tier caps only apply to non-Pro users; Anthropic and
        Gemini caps only apply to Max users.
      </p>
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function UserRow({ record, adminEmail }: { record: AdminUserRecord; adminEmail: string }) {
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
              {record.isMax ? (
                <Badge className="bg-purple-600 text-white">Max</Badge>
              ) : record.isPro ? (
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
      <TableCell className="min-w-[200px]">
        <div className="space-y-1 text-xs text-muted-foreground">
          {!record.isPro && (
            <>
              <UsageLine
                label="searches today"
                used={record.usage.dailySearch}
                limit={record.limits.dailySearch}
                isOverride={record.limitOverrides.dailySearch !== undefined}
              />
              <UsageLine
                label="extreme this month"
                used={record.usage.extremeSearch}
                limit={record.limits.extremeSearch}
                isOverride={record.limitOverrides.extremeSearch !== undefined}
              />
            </>
          )}
          {record.isMax && (
            <>
              <UsageLine
                label="Anthropic this week"
                used={record.usage.anthropicWeekly}
                limit={record.limits.anthropicWeekly}
                isOverride={record.limitOverrides.anthropicWeekly !== undefined}
              />
              <UsageLine
                label="Gemini this month"
                used={record.usage.googleMonthly}
                limit={record.limits.googleMonthly}
                isOverride={record.limitOverrides.googleMonthly !== undefined}
              />
            </>
          )}
          {record.isPro && !record.isMax && <p>Unlimited searches (Pro)</p>}
          <p className="pt-1">
            {record.chatCount} chats · {record.lookoutCount} lookouts · {record.sessionCount} sessions
          </p>
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
              variant={record.isMax ? 'outline' : 'default'}
              className={!record.isMax ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
              disabled={pending || isSelf}
              onClick={() =>
                runAction(
                  () => setUserMaxStatusAction(record.id, !record.isMax).then(() => Promise.resolve()),
                  record.isMax ? 'Max access removed' : 'Max access granted',
                )
              }
            >
              <HugeiconsIcon icon={Crown02Icon} size={16} strokeWidth={1.5} />
              {record.isMax ? 'Revoke Max' : 'Make Max'}
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
                runAction(() => clearUserSessionsAction(record.id).then(() => Promise.resolve()), 'Sessions cleared')
              }
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.5} />
              Clear Sessions
            </Button>
          </div>
          <LimitOverridesEditor
            record={record}
            disabled={pending}
            onSave={(overrides, successMessage) =>
              runAction(
                () => setUserLimitOverridesAction(record.id, overrides).then(() => Promise.resolve()),
                successMessage,
              )
            }
          />
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

export function AdminPanel({ users, adminEmail }: { users: AdminUserRecord[]; adminEmail: string }) {
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
                Hard-gated to {adminEmail}. Manual Pro grants create real subscription records.
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
