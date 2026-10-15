'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

export function SupportInbox({ initialUserId = '' }: { initialUserId?: string }) {
  const [users, setUsers] = useState<SupportUser[]>([]);
  const [missingTable, setMissingTable] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialUserId);
  const [thread, setThread] = useState<SupportUser | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [body, setBody] = useState('');
  const [channels, setChannels] = useState<SupportChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    const response = await fetch('/api/admin/support');
    const payload = (await response.json()) as { users?: SupportUser[]; missingTable?: boolean };
    setUsers(payload.users || []);
    setMissingTable(Boolean(payload.missingTable));
    setLoading(false);
  }, []);

  const loadThread = useCallback(async (userId: string) => {
    if (!userId) return;
    const response = await fetch(`/api/admin/support/${userId}`);
    const payload = (await response.json()) as ThreadPayload;
    if (!response.ok) {
      setError(payload.error || 'گفتگو باز نشد');
      return;
    }
    setThread(payload.user || null);
    setMessages(payload.messages || []);
    setMissingTable(Boolean(payload.missingTable));
    setChannels((current) => {
      if (current.length) return current;
      const next: SupportChannel[] = [];
      if (payload.user?.telegramId) next.push('telegram');
      if (payload.user?.whatsappPhone) next.push('whatsapp');
      return next;
    });
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!selectedId) return;
    void loadThread(selectedId);
  }, [selectedId, loadThread]);

  useEffect(() => {
    if (!selectedId) return;
    const timer = window.setInterval(() => {
      void loadThread(selectedId);
      void loadUsers();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [selectedId, loadThread, loadUsers]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) =>
      [user.name, user.businessName, user.subdomain].join(' ').toLowerCase().includes(needle),
    );
  }, [users, query]);

  function toggleChannel(channel: SupportChannel) {
    setChannels((current) =>
      current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel],
    );
  }

  async function send() {
    if (!selectedId || !body.trim()) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/support/${selectedId}`, {
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
      await Promise.all([loadThread(selectedId), loadUsers()]);
    } catch {
      setError('ارتباط با سرور برقرار نشد');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid min-h-[70vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-zinc-100 lg:border-b-0 lg:border-l">
        <div className="border-b border-zinc-100 p-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی کاربر..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>
        {missingTable ? (
          <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            جدول پیام‌ها هنوز در Supabase ساخته نشده. فایل
            <span className="mx-1 font-mono" dir="ltr">
              sql/support_messages.sql
            </span>
            را یک‌بار اجرا کنید.
          </p>
        ) : null}
        <ul className="max-h-[28vh] overflow-y-auto lg:max-h-[calc(70vh-58px)]">
          {loading ? (
            <li className="px-4 py-6 text-sm text-zinc-500">در حال بارگذاری...</li>
          ) : filtered.length === 0 ? (
            <li className="px-4 py-6 text-sm text-zinc-500">کاربری پیدا نشد</li>
          ) : (
            filtered.map((user) => {
              const active = user.id === selectedId;
              return (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(user.id);
                      setChannels([]);
                      setError('');
                    }}
                    className={`block w-full px-4 py-3 text-right ${
                      active ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className={`mt-0.5 text-xs ${active ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {user.businessName || user.subdomain || 'بدون سایت'}
                    </p>
                    {user.lastMessage ? (
                      <p className={`mt-1 truncate text-xs ${active ? 'text-zinc-200' : 'text-zinc-600'}`}>
                        {user.lastSender === 'admin' ? 'پشتیبانی: ' : 'کاربر: '}
                        {user.lastMessage}
                      </p>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      <section className="flex min-h-[42vh] flex-col">
        {!selectedId || !thread ? (
          <div className="flex flex-1 items-center justify-center px-6 text-sm text-zinc-500">
            {error || 'یک کاربر را انتخاب کنید تا گفتگو باز شود.'}
          </div>
        ) : (
          <>
            <header className="border-b border-zinc-100 px-5 py-4">
              <p className="text-xs font-semibold text-zinc-400">گفتگو</p>
              <h2 className="text-lg font-black">{thread.name}</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {thread.subdomain ? `${thread.subdomain}.easywebbuilder.de` : 'بدون سایت'}
                {thread.telegramId ? ' · تلگرام' : ''}
                {thread.whatsappPhone ? ' · واتساپ' : ''}
              </p>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {missingTable ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  جدول پیام‌ها هنوز در Supabase ساخته نشده. فایل
                  <span className="mx-1 font-mono" dir="ltr">
                    deploy/sql/support_messages.sql
                  </span>
                  را یک‌بار اجرا کنید.
                </p>
              ) : null}
              {messages.length === 0 ? (
                <p className="text-sm text-zinc-500">هنوز پیامی در این گفتگو نیست.</p>
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
      </section>
    </div>
  );
}
