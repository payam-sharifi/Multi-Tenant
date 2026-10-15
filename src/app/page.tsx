import type { Metadata } from 'next';
import Link from 'next/link';
import { TEMPLATE_GALLERY } from '@/lib/template-gallery';

export const metadata: Metadata = {
  title: 'پیش‌نمایش قالب‌ها',
  description: 'لیست قالب‌های easyWeb برای چک کردن پیش‌فرض‌ها',
};

export default function TemplateGalleryPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-zinc-500">صفحهٔ چک قالب‌ها · بدون ورود</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">همهٔ قالب‌ها</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
          روی هر کارت بزن تا همان قالب با دادهٔ پیش‌فرض باز شود. این صفحه فقط برای چک کردن است.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {TEMPLATE_GALLERY.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <p className="font-mono text-xs text-zinc-400" dir="ltr">
                {item.title}
              </p>
              <h2 className="mt-1 text-xl font-extrabold">{item.titleFa}</h2>
              <p className="mt-2 text-sm text-zinc-600">{item.blurb}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-700"
              >
                باز کردن پیش‌فرض
              </Link>
              {item.variants?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.variants.map((variant) => (
                    <Link
                      key={variant.href}
                      href={variant.href}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:border-zinc-400"
                    >
                      {variant.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
