import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminNav } from '@/components/dashboard/AdminNav';
import { SupportInbox } from '@/components/dashboard/SupportInbox';
import { getWebsiteById } from '@/lib/tenant';
import { extractSiteFields } from '@/lib/website-admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'پیام‌های سایت',
};

export default async function SiteMessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { siteId } = await params;
  const { from } = await searchParams;
  const site = await getWebsiteById(siteId);
  if (!site) notFound();

  const fields = extractSiteFields(site);
  const backHref = from ? `/dashboard/${from}` : '/admin';

  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link href={backHref} className="text-sm font-semibold text-zinc-500 hover:text-zinc-800">
              ← برگشت به سایت‌ها
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight">پیام‌ها</h1>
            <p className="mt-2 text-sm text-zinc-600">
              {fields.businessName || fields.subdomain}
              {fields.subdomain ? ` · ${fields.subdomain}.easywebbuilder.de` : ''}
            </p>
          </div>
          <AdminNav />
        </div>
        <div className="mt-8">
          <SupportInbox siteId={siteId} />
        </div>
      </div>
    </main>
  );
}
