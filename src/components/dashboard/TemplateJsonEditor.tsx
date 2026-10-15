'use client';

import { useEffect, useMemo, useState } from 'react';

type JsonEditorProps = {
  templateId: string;
  initialValue?: unknown;
  siteId?: string;
  siteLabel?: string;
};

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function cloneJson(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

function setAtPath(root: unknown, path: Array<string | number>, next: unknown): unknown {
  if (path.length === 0) return next;
  const [head, ...rest] = path;
  if (typeof head === 'number' && Array.isArray(root)) {
    const copy = [...root];
    copy[head] = setAtPath(copy[head], rest, next);
    return copy;
  }
  if (typeof head === 'string' && isRecord(root)) {
    return { ...root, [head]: setAtPath(root[head], rest, next) };
  }
  return root;
}

function valueLabel(value: unknown): string {
  if (Array.isArray(value)) return `آرایه · ${value.length}`;
  if (isRecord(value)) return `آبجکت · ${Object.keys(value).length}`;
  if (value === null) return 'null';
  return typeof value;
}

function PrimitiveField({
  value,
  onChange,
}: {
  value: string | number | boolean | null;
  onChange: (next: unknown) => void;
}) {
  if (typeof value === 'boolean') {
    return (
      <label className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-zinc-900"
        />
        {value ? 'true' : 'false'}
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(event.target.value === '' ? 0 : Number(event.target.value))}
        className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-xs text-zinc-800"
        dir="ltr"
      />
    );
  }

  return (
    <textarea
      value={value == null ? '' : String(value)}
      onChange={(event) => onChange(event.target.value)}
      rows={value && String(value).length > 80 ? 3 : 1}
      className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-xs text-zinc-800"
      dir="ltr"
    />
  );
}

function TreeNode({
  value,
  path,
  label,
  onChange,
  onRemove,
}: {
  value: unknown;
  path: Array<string | number>;
  label: string;
  onChange: (path: Array<string | number>, next: unknown) => void;
  onRemove?: () => void;
}) {
  const [open, setOpen] = useState(path.length < 2);
  const [newKey, setNewKey] = useState('');
  const nested = Array.isArray(value) || isRecord(value);

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/70">
      <div className="flex items-center gap-2 px-3 py-2">
        {nested ? (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="text-xs font-bold text-zinc-500"
          >
            {open ? '▼' : '▶'}
          </button>
        ) : null}
        <p className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-zinc-700" dir="ltr">
          {label}
          <span className="mr-2 font-sans font-medium text-zinc-400"> · {valueLabel(value)}</span>
        </p>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full px-2 py-0.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50"
          >
            حذف
          </button>
        ) : null}
      </div>

      {!nested ? (
        <div className="px-3 pb-3">
          <PrimitiveField
            value={value as string | number | boolean | null}
            onChange={(next) => onChange(path, next)}
          />
        </div>
      ) : null}

      {nested && open ? (
        <div className="space-y-2 border-t border-zinc-200 px-3 py-3">
          {Array.isArray(value)
            ? value.map((item, index) => (
                <TreeNode
                  key={`${path.join('.')}.${index}`}
                  value={item}
                  path={[...path, index]}
                  label={`[${index}]`}
                  onChange={onChange}
                  onRemove={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}
                />
              ))
            : Object.entries(value as JsonRecord).map(([key, item]) => (
                <TreeNode
                  key={`${path.join('.')}.${key}`}
                  value={item}
                  path={[...path, key]}
                  label={key}
                  onChange={onChange}
                  onRemove={() => {
                    const next = { ...(value as JsonRecord) };
                    delete next[key];
                    onChange(path, next);
                  }}
                />
              ))}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {isRecord(value) ? (
              <input
                value={newKey}
                onChange={(event) => setNewKey(event.target.value)}
                placeholder="نام فیلد جدید"
                className="min-w-40 flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs"
              />
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (Array.isArray(value)) {
                  onChange(path, [...value, '']);
                  return;
                }
                const key = newKey.trim();
                if (!key || !isRecord(value) || key in value) return;
                onChange(path, { ...value, [key]: '' });
                setNewKey('');
              }}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100"
            >
              افزودن
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TemplateJsonEditor({ templateId, initialValue, siteId, siteLabel }: JsonEditorProps) {
  const [data, setData] = useState<unknown>(() => cloneJson(initialValue ?? {}));
  const [raw, setRaw] = useState(() => pretty(initialValue ?? {}));
  const [mode, setMode] = useState<'tree' | 'raw'>('tree');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(siteId));

  useEffect(() => {
    if (!siteId) return;
    let cancelled = false;
    async function loadSite() {
      setLoading(true);
      setError('');
      setStatus('');
      try {
        const response = await fetch(
          `/api/dashboard/sites/${siteId}?template=${encodeURIComponent(templateId)}`,
        );
        const payload = (await response.json()) as { siteData?: unknown; error?: string };
        if (cancelled) return;
        if (!response.ok) {
          setError(payload.error || 'دیتای سایت بارگذاری نشد');
          setLoading(false);
          return;
        }
        const next = payload.siteData ?? {};
        setData(cloneJson(next));
        setRaw(pretty(next));
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError('ارتباط با سرور برقرار نشد');
          setLoading(false);
        }
      }
    }
    void loadSite();
    return () => {
      cancelled = true;
    };
  }, [siteId, templateId]);

  const parsedRaw = useMemo(() => {
    try {
      return { value: JSON.parse(raw) as unknown, error: '' };
    } catch (err) {
      return { value: null, error: err instanceof Error ? err.message : 'جیسون نامعتبر است' };
    }
  }, [raw]);

  function applyTree(next: unknown) {
    setData(next);
    setRaw(pretty(next));
    setError('');
    setStatus('');
  }

  function applyRaw() {
    if (parsedRaw.error) {
      setError(parsedRaw.error);
      return false;
    }
    setData(parsedRaw.value);
    setRaw(pretty(parsedRaw.value));
    setError('');
    return true;
  }

  async function save() {
    const next = mode === 'raw' ? parsedRaw.value : data;
    if (mode === 'raw' && parsedRaw.error) {
      setError(parsedRaw.error);
      return;
    }
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const response = siteId
        ? await fetch(`/api/dashboard/sites/${siteId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteData: next }),
          })
        : await fetch(`/api/templates/${templateId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fixture: next }),
          });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || 'ذخیره نشد');
        return;
      }
      applyTree(next);
      setStatus('جیسون ذخیره شد.');
    } catch {
      setError('ارتباط با سرور برقرار نشد');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">جیسون قالب</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {siteId
              ? `قالب کامل با دادهٔ همین سایت${siteLabel ? ` (${siteLabel})` : ''} از دیتابیس. بخش‌های خالی را همین‌جا پر کن تا روی سایت دیده شوند.`
              : 'فیلد اضافه یا حذف کن. اگر راحت‌تری، متن خام جیسون را باز کن.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-full border border-zinc-200 p-0.5">
            <button
              type="button"
              onClick={() => {
                if (mode === 'raw' && !applyRaw()) return;
                setMode('tree');
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                mode === 'tree' ? 'bg-zinc-900 text-white' : 'text-zinc-600'
              }`}
            >
              ساده
            </button>
            <button
              type="button"
              onClick={() => setMode('raw')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                mode === 'raw' ? 'bg-zinc-900 text-white' : 'text-zinc-600'
              }`}
            >
              متن جیسون
            </button>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-700 disabled:opacity-60"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره جیسون'}
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
      {status ? <p className="mt-3 text-sm font-semibold text-emerald-700">{status}</p> : null}
      {loading ? <p className="mt-3 text-sm text-zinc-500">در حال بارگذاری دیتای سایت...</p> : null}

      {loading ? null : (
        <div className="mt-4">
          {mode === 'raw' ? (
            <textarea
              value={raw}
              onChange={(event) => {
                setRaw(event.target.value);
                setStatus('');
                setError('');
              }}
              spellCheck={false}
              className="min-h-[32rem] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-relaxed text-zinc-800"
              dir="ltr"
            />
          ) : (
            <TreeNode
              value={data}
              path={[]}
              label="root"
              onChange={(path, next) => {
                const updated = path.length === 0 ? next : setAtPath(data, path, next);
                applyTree(updated);
              }}
            />
          )}
        </div>
      )}
    </section>
  );
}
