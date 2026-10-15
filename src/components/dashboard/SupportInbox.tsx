'use client';

import { useCallback, useEffect, useState } from 'react';
import { markSupportSeen } from '@/lib/support-seen';
import type { SupportChannel, SupportMessage, SupportUser } from '@/lib/support';

type ThreadPayload = {
  user?: SupportUser;
  messages?: SupportMessage[];
  missingTable?: boolean;
  error?: string;
};

function formatTime(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function SupportInbox({ siteId }: { siteId: string }) {
  const [thread, setThread] = useState<SupportUser | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [body, setBody] = useState('');
  const [channels, setChannels] = useState<SupportChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [missingTable, setMissingTable] = useState(false);

  const loadThread = useCallback(async () => {
    if (!siteId) return;
    const response = await fetch(`/api/admin/support/site/${siteId}`);
    const payload = (await response.json()) as ThreadPayload;
    if (!response.ok) {
      setError(payload.error || 'گفتگو باز نشد');
      setLoading(false);
      return;
    }
    setThread(payload.user || null);
    setMessages(payload.messages || []);
    setMissingTable(Boolean(payload.missingTable));
    setError('');
    setChannels((current) => {
      if (current.length) return current;
      const next: SupportChannel[] = [];
      if (payload.user?.telegramId) next.push('telegram');
      if (payload.user?.whatsappPhone) next.push('whatsapp');
      return next;
    });
    const lastUser = [...(payload.messages || [])].reverse().find((item) => item.sender === 'user');
    markSupportSeen(siteId, lastUser?.createdAt || new Date().toISOString());
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    void loadThread();
  }, [loadThread]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadThread();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [loadThread]);

  function toggleChannel(channel: SupportChannel) {
    setChannels((current) =>
      current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel],
    );
  }

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/support/site/${siteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, channels }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: SupportMessage;
        missingTable?: boolean;
      };
      if (!response.ok) {
        setError(payload.error || 'ارسال نشد');
        setMissingTable(Boolean(payload.missingTable));
        return;
      }
      setBody('');
      if (payload.message) setMessages((current) => [...current, payload.message!]);
      await loadThread();
    } catch {
      setError('ارتباط با سرور برقرار نشد');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {loading && !thread ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">در حال بارگذاری...</div>
      ) : !thread ? (
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-zinc-500">
          {error || 'گفتگوی این سایت باز نشد.'}
        </div>
      ) : (
        <>
          <header className="border-b border-zinc-100 px-5 py-4">
            <p className="text-xs font-semibold text-zinc-400">گفتگوی این سایت</p>
            <h2 className="text-lg font-black">{thread.businessName || thread.name}</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {thread.subdomain ? `${thread.subdomain}.easywebbuilder.de` : 'بدون زیردامنه'}
              {thread.telegramId ? ' · تلگرام' : ''}
              {thread.whatsappPhone ? ' · واتساپ' : ''}
            </p>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {missingTable ? (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                جدول پیام‌ها هنوز در Supabase ساخته نشده. فایل
                <span className="mx-1 font-mono" dir="ltr">
                  sql/support_messages.sql
                </span>
                را یک‌بار اجرا کنید.
              </p>
            ) : null}
            {messages.length === 0 ? (
              <p className="text-sm text-zinc-500">هنوز پیامی برای این سایت نیست.</p>
            ) : (
              messages.map((item) => {
                const fromAdmin = item.sender === 'admin';
                return (
                  <article
                    key={item.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      fromAdmin ? 'ms-auto bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    <p className={`text-[11px] font-bold ${fromAdmin ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {fromAdmin ? 'از طرف تیم پشتیبانی' : 'از طرف کاربر'}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed">{item.body}</p>
                    <p className={`mt-2 text-[11px] ${fromAdmin ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {formatTime(item.createdAt)}
                      {fromAdmin && item.channels.length
                        ? ` · ${item.channels.map((channel) => (channel === 'telegram' ? 'تلگرام' : 'واتساپ')).join(' و ')}`
                        : ''}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          <form
            className="border-t border-zinc-100 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <div className="mb-3 flex flex-wrap gap-3 text-sm">
              <label className={`flex items-center gap-2 ${thread.telegramId ? '' : 'opacity-40'}`}>
                <input
                  type="checkbox"
                  checked={channels.includes('telegram')}
                  disabled={!thread.telegramId}
                  onChange={() => toggleChannel('telegram')}
                />
                تلگرام
              </label>
              <label className={`flex items-center gap-2 ${thread.whatsappPhone ? '' : 'opacity-40'}`}>
                <input
                  type="checkbox"
                  checked={channels.includes('whatsapp')}
                  disabled={!thread.whatsappPhone}
                  onChange={() => toggleChannel('whatsapp')}
                />
                واتساپ
              </label>
            </div>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={3}
              placeholder="پیام تیم پشتیبانی..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
            />
            {error ? <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p> : null}
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={sending || !body.trim() || !channels.length}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                {sending ? 'در حال ارسال...' : 'ارسال'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
