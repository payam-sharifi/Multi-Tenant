'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || 'ورود ناموفق بود');
        return;
      }
      const next = searchParams.get('next') || '/admin';
      router.replace(next.startsWith('/') ? next : '/admin');
      router.refresh();
    } catch {
      setError('ارتباط با سرور برقرار نشد');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-zinc-500">یوزر</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-zinc-500">پسورد</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
        />
      </label>
      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-60"
      >
        {saving ? 'در حال ورود...' : 'ورود'}
      </button>
    </form>
  );
}
