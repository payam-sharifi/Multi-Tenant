import Link from 'next/link';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { listActiveTenantsByTemplate } from '@/lib/template-dashboard';
import { TEMPLATE_GALLERY } from '@/lib/template-gallery';
import type { TemplateId } from '@/templates/registry';

export async function TemplateGallery() {
  const tenantsByTemplate = await listActiveTenantsByTemplate();

  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-500">صفحهٔ ادمین قالب‌ها</p>
          <LogoutButton />
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">همهٔ قالب‌ها</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
          پیش‌نمایش همان قالب را با دادهٔ پیش‌فرض باز می‌کند. داشبورد زیردامنه‌ها و جیسون قابل‌ویرایش قالب را نشان می‌دهد.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {TEMPLATE_GALLERY.map((item) => {
            const activeCount = tenantsByTemplate[item.id as TemplateId]?.length ?? 0;
            return (
              <li
                key={item.id}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs text-zinc-400" dir="ltr">
                    {item.title}
                  </p>
                  <p className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
                    {activeCount} کاربر فعال
                  </p>
                </div>
                <h2 className="mt-1 text-xl font-extrabold">{item.titleFa}</h2>
                <p className="mt-2 text-sm text-zinc-600">{item.blurb}</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 hover:border-zinc-400"
                  >
                    پیش‌نمایش
                  </Link>
                  <Link
                    href={item.dashboardHref}
                    className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-700"
                  >
                    داشبورد
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
