'use client';

/**
 * @file src/hooks/use-auto-logout.ts
 * Auto-logout on navigation — DISABLED.
 * 
 * This was causing false logouts on dashboard access because the route
 * tracking fired during initial mount before auth state settled.
 * Session is now managed entirely by the auth_access_token cookie (7-day TTL).
 * Users must click the Logout button to end their session.
 */
export function useAutoLogout() {
  // Intentionally disabled — JWT cookie handles session lifetime.
  // Re-enable only if you add an idle-timeout mechanism with proper state tracking.
}
