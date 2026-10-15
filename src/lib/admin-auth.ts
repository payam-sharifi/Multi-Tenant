import { createHmac } from 'node:crypto';

export const ADMIN_COOKIE = 'ew_admin';

export function adminUser(): string {
  return process.env.ADMIN_USER || 'admin';
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || '123';
}

export function adminToken(): string {
  return createHmac('sha256', adminPassword()).update(adminUser()).digest('hex');
}

export function checkAdminCredentials(username: string, password: string): boolean {
  return username.trim() === adminUser() && password === adminPassword();
}

export function hasAdminCookie(cookieValue: string | undefined): boolean {
  return Boolean(cookieValue) && cookieValue === adminToken();
}

export function isAdminPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/')
  );
}

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === '/admin/login' || pathname.startsWith('/admin/login/');
}

export function isAdminApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/templates') || pathname.startsWith('/api/dashboard');
}
