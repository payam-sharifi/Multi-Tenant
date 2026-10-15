import Link from 'next/link';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { SiteEditor } from '@/components/dashboard/SiteEditor';
import type { TemplateDashboard as DashboardData } from '@/lib/template-dashboard';

export function TemplateDashboard({ template, fixture, tenants }: DashboardData) {
  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <Link href="/" className="text-sm font-semibold text-zinc-500 hover:text-zinc-800">
              ← قالب‌ها
            </Link>
            <h1 className="mt-1 text-2xl font-black">{template.titleFa}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LogoutButton />
            <Link
              href={template.href}
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700"
            >
              پیش‌نمایش
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <SiteEditor templateId={template.id} fixture={fixture} tenants={tenants} />
      </div>
    </main>
  );
}
