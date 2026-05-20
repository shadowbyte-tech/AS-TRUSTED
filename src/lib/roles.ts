import { ELITE_ROLES, PREMIUM_ROLES, USER_ROLES } from './constants';

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isOwnerRole(role?: string | null): boolean {
  return role === USER_ROLES.OWNER;
}

export function isPremiumRole(role?: string | null): boolean {
  return !!role && (PREMIUM_ROLES as readonly string[]).includes(role);
}

export function isEliteRole(role?: string | null): boolean {
  return !!role && (ELITE_ROLES as readonly string[]).includes(role);
}

export function getPostLoginPath(user?: { role?: string | null } | null): string {
  const role = user?.role;
  if (isOwnerRole(role)) return '/dashboard';
  if (isPremiumRole(role)) return '/premium-properties';
  return '/normal-properties';
}
