'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TemplateJsonEditor } from '@/components/dashboard/TemplateJsonEditor';
import { hasUnseenSupport } from '@/lib/support-seen';
import type { SiteUnread } from '@/lib/support';
import type { TemplateTenant } from '@/lib/template-dashboard';

type Props = {
  templateId: string;
  fixture: unknown;
  tenants: TemplateTenant[];
};

const PAGE_SIZE = 12;

const FIELDS: {
  key: keyof Pick<
    TemplateTenant,
    'businessName' | 'subdomain' | 'businessType' | 'phone' | 'email' | 'address' | 'hours'
  >;
  label: string;
  dir?: 'ltr';
}[] = [
  { key: 'businessName', label: 'اسم کسب‌وکار' },
  { key: 'subdomain', label: 'زیردامنه', dir: 'ltr' },
  { key: 'businessType', label: 'نوع کار' },
  { key: 'phone', label: 'شماره تماس', dir: 'ltr' },
  { key: 'email', label: 'ایمیل', dir: 'ltr' },
  { key: 'address', label: 'آدرس' },
  { key: 'hours', label: 'ساعات کاری' },
];

function cloneTenant(tenant: TemplateTenant): TemplateTenant {
  return { ...tenant };
}

export function SiteEditor({ templateId, fixture, tenants }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(tenants);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState<TemplateTenant | null>(null);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [unread, setUnread] = useState<Record<string, SiteUnread>>({});
  const [seenReady, setSeenReady] = useState(false);

  useEffect(() => {
    setSeenReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadUnread() {
      try {
        const response = await fetch('/api/admin/support/unread');
        const payload = (await response.json()) as { unread?: Record<string, SiteUnread> };
        if (!cancelled) setUnread(payload.unread || {});
      } catch {
        if (!cancelled) setUnread({});
      }
    }
    void loadUnread();
    const timer = window.setInterval(() => {
      void loadUnread();
    }, 12000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.name, item.businessName, item.subdomain, item.businessType, item.phone, item.email, item.address]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [items, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function open(tenant: TemplateTenant) {
    setDraft(cloneTenant(tenant));
    setMessage('');
    setError('');
  }

  function update<K extends keyof TemplateTenant>(key: K, value: TemplateTenant[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setMessage('');
    setError('');
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/dashboard/sites/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: draft.subdomain,
          businessName: draft.businessName,
          businessType: draft.businessType,
          phone: draft.phone,
          email: draft.email,
          address: draft.address,
          hours: draft.hours,
          published: draft.published,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || 'ذخیره نشد');
        return;
      }
      const next = {
        ...draft,
        name: draft.businessName || draft.name || draft.subdomain,
        subdomain: draft.subdomain.trim().toLowerCase(),
      };
      setItems((current) => current.map((item) => (item.id === next.id ? next : item)));
      setDraft(next);
      setMessage('ذخیره شد.');
      router.refresh();
    } catch {
      setError('ارتباط با سرور برقرار نشد');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft) return;
    const ok = window.confirm(`سایت «${draft.name}» حذف شود؟ این کار برنمی‌گردد.`);
    if (!ok) return;
    setDeleting(true);
    setError('');
    try {
      const response = await fetch(`/api/dashboard/sites/${draft.id}`, { method: 'DELETE' });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || 'حذف نشد');
        return;
      }
      setItems((current) => current.filter((item) => item.id !== draft.id));
      setDraft(null);
      router.refresh();
    } catch {
      setError('ارتباط با سرور برقرار نشد');
    } finally {
      setDeleting(false);
    }
  }

  const jsonModal = jsonOpen ? (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-900/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black">جیسون قالب</h3>
          <button
            type="button"
            onClick={() => setJsonOpen(false)}
            className="text-sm font-bold text-zinc-500 hover:text-zinc-800"
          >
            بستن
          </button>
        </div>
        <TemplateJsonEditor templateId={templateId} initialValue={fixture} />
      </div>
    </div>
  ) : null;

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center">
        <p className="font-semibold text-zinc-800">هنوز سایتی روی این قالب نیست</p>
        <button
          type="button"
          onClick={() => setJsonOpen(true)}
          className="mt-4 rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700 hover:border-zinc-400"
        >
          جیسون قالب
        </button>
        {jsonModal}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          placeholder="جستجو بین سایت‌ها..."
          className="w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
        />
        <p className="text-xs font-semibold text-zinc-500">{filtered.length} سایت</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-3 text-right font-semibold">اسم</th>
              <th className="px-4 py-3 text-right font-semibold">زیردامنه</th>
              <th className="px-4 py-3 text-right font-semibold">نوع کار</th>
              <th className="px-4 py-3 text-right font-semibold">تماس</th>
              <th className="px-4 py-3 text-left font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((tenant) => (
              <tr key={tenant.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                <td className="px-4 py-3 font-semibold">{tenant.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500" dir="ltr">
                  {tenant.subdomain}
                </td>
                <td className="px-4 py-3 text-zinc-600">{tenant.businessType || '—'}</td>
                <td className="px-4 py-3 text-zinc-600" dir="ltr">
                  {tenant.phone || '—'}
                </td>
                <td className="px-4 py-3 text-left">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => open(tenant)}
                      className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-700"
                    >
                      ویرایش
                    </button>
                    <button
                      type="button"
                      onClick={() => setJsonOpen(true)}
                      className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:border-zinc-400"
                    >
                      جیسون قالب
                    </button>
                    <Link
                      href={`/admin/messages/${tenant.id}?from=${templateId}`}
                      className="relative rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:border-zinc-400"
                    >
                      پیام‌ها
                      {seenReady && hasUnseenSupport(tenant.id, unread[tenant.id]?.lastUserAt) ? (
                        <span className="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                      ) : null}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE ? (
        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-xs font-semibold text-zinc-500">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            className="disabled:opacity-40"
          >
            قبلی
          </button>
          <p>
            صفحه {safePage + 1} از {pageCount}
          </p>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            className="disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      ) : null}

      {jsonModal}

      {draft ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-900/40 p-4 sm:items-center">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-zinc-400">ویرایش سایت</p>
                <h3 className="mt-1 text-lg font-black">{draft.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="text-sm font-bold text-zinc-500 hover:text-zinc-800"
              >
                بستن
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <label
                  key={field.key}
                  className={field.key === 'address' || field.key === 'hours' ? 'sm:col-span-2' : ''}
                >
                  <span className="mb-1 block text-xs font-bold text-zinc-500">{field.label}</span>
                  <input
                    value={String(draft[field.key] ?? '')}
                    onChange={(event) => update(field.key, event.target.value)}
                    dir={field.dir}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
                  />
                </label>
              ))}
            </div>

            {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
            {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-60"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <a
                href={`/${draft.subdomain}`}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700 hover:border-zinc-400"
              >
                باز کردن
              </a>
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className="mr-auto rounded-full px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
              >
                {deleting ? 'در حال حذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
