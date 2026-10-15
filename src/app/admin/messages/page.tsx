import type { Metadata } from 'next';
import { AdminNav } from '@/components/dashboard/AdminNav';
import { SupportInbox } from '@/components/dashboard/SupportInbox';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'پیام‌های پشتیبانی',
};

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>;
}) {
  const params = await searchParams;
  return (
    <main dir="rtl" className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-500">صفحهٔ ادمین</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">پیام‌ها</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              به هر کاربر از طرف تیم پشتیبانی پیام بدهید. تلگرام، واتساپ یا هر دو را انتخاب کنید. جواب کاربر همین‌جا دیده می‌شود.
            </p>
          </div>
          <AdminNav current="messages" />
        </div>
        <div className="mt-8">
          <SupportInbox initialUserId={params.user || ''} />
        </div>
      </div>
    </main>
  );
}
