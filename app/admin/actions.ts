'use server';

import { revalidatePath } from 'next/cache';
import {
  clearUserSessions,
  getAdminUsers,
  requireAdminSessionUser,
  setManualBanStatus,
  setManualLimitOverrides,
  setManualMaxStatus,
  setManualProStatus,
} from '@/lib/admin';
import type { UserLimitOverrideInput } from '@/lib/limits';

export async function getAdminUsersAction() {
  return getAdminUsers();
}

export async function setUserProStatusAction(userId: string, makePro: boolean) {
  const adminUser = await requireAdminSessionUser();
  await setManualProStatus(userId, makePro, adminUser.email);
  revalidatePath('/admin');
  revalidatePath('/settings');
  return { success: true };
}

export async function setUserMaxStatusAction(userId: string, makeMax: boolean) {
  const adminUser = await requireAdminSessionUser();
  await setManualMaxStatus(userId, makeMax, adminUser.email);
  revalidatePath('/admin');
  revalidatePath('/settings');
  return { success: true };
}

export async function setUserBanStatusAction(userId: string, banned: boolean, reason?: string) {
  const adminUser = await requireAdminSessionUser();
  await setManualBanStatus(userId, banned, reason ?? null, adminUser.email);
  revalidatePath('/admin');
  revalidatePath('/settings');
  return { success: true };
}

export async function clearUserSessionsAction(userId: string) {
  await requireAdminSessionUser();
  await clearUserSessions(userId);
  revalidatePath('/admin');
  return { success: true };
}

export async function setUserLimitOverridesAction(userId: string, overrides: UserLimitOverrideInput) {
  const adminUser = await requireAdminSessionUser();
  await setManualLimitOverrides(userId, overrides, adminUser.email);
  revalidatePath('/admin');
  revalidatePath('/settings');
  return { success: true };
}
