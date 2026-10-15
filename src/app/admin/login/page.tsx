import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/dashboard/LoginForm';

export const metadata: Metadata = {
  title: 'ورود ادمین',
};

export default function AdminLoginPage() {
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold text-zinc-400">ادمین قالب‌ها</p>
        <h1 className="mt-1 text-2xl font-black">ورود</h1>
        <p className="mt-2 text-sm text-zinc-500">برای دیدن داشبورد یوزر و پسورد را بزن.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
