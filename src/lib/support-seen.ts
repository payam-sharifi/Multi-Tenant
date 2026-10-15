const prefix = 'ew-support-seen:';

export function markSupportSeen(siteId: string, at = new Date().toISOString()): void {
  if (!siteId || typeof window === 'undefined') return;
  window.localStorage.setItem(`${prefix}${siteId}`, at);
}

export function getSupportSeen(siteId: string): string | null {
  if (!siteId || typeof window === 'undefined') return null;
  return window.localStorage.getItem(`${prefix}${siteId}`);
}

export function hasUnseenSupport(siteId: string, lastUserAt: string | null | undefined): boolean {
  if (!lastUserAt) return false;
  const seen = getSupportSeen(siteId);
  return !seen || lastUserAt > seen;
}
