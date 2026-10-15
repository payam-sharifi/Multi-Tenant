const IDENTITY_KEYS = new Set([
  'business_name',
  'phone',
  'email',
  'address',
  'working_hours',
  'legal_name',
  'tagline',
  'owner_name',
  'owner',
  'contact_phone',
  'contact_email',
  'emergency_hours',
  'about',
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function unwrapFixture(fixture: unknown): Record<string, unknown> {
  const root = asRecord(fixture);
  if (!root) return {};
  const inner = asRecord(root.site_data);
  const data = { ...(inner ?? root) };
  delete data.demo;
  return data;
}

function itemKey(item: Record<string, unknown>): string {
  for (const key of ['type', 'name', 'title', 'heading', 'id', 'days', 'label']) {
    const value = asString(item[key]);
    if (value) return `${key}:${value.toLowerCase()}`;
  }
  return '';
}

function isObjectArray(value: unknown[]): value is Record<string, unknown>[] {
  return value.every((item) => Boolean(asRecord(item)));
}

function looksLikeTypedList(items: Record<string, unknown>[]): boolean {
  return items.length > 0 && items.every((item) => Boolean(asString(item.type)));
}

function mergeValue(base: unknown, incoming: unknown, path: string[]): unknown {
  if (incoming === undefined) return base;

  if (Array.isArray(incoming)) {
    if (!incoming.length && Array.isArray(base) && base.length) return base;
    if (Array.isArray(base) && isObjectArray(base) && isObjectArray(incoming)) {
      if (looksLikeTypedList(base) || looksLikeTypedList(incoming)) {
        return mergeTypedList(base, incoming, path);
      }
      return mergeKeyedList(base, incoming, path);
    }
    return incoming;
  }

  const incomingRecord = asRecord(incoming);
  const baseRecord = asRecord(base);
  if (incomingRecord && baseRecord) return mergeRecords(baseRecord, incomingRecord, path);

  if (incoming === '' || incoming === null) {
    const leaf = path[path.length - 1] || '';
    if (path.length === 1 && IDENTITY_KEYS.has(leaf)) return incoming ?? '';
    if (typeof base === 'string' && base) return base;
    if (base !== undefined && incoming === null) return base;
    return incoming ?? '';
  }

  return incoming;
}

function mergeRecords(
  base: Record<string, unknown>,
  incoming: Record<string, unknown>,
  path: string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  delete result.demo;
  for (const [key, value] of Object.entries(incoming)) {
    if (key === 'demo') continue;
    result[key] = mergeValue(base[key], value, [...path, key]);
  }
  return result;
}

function mergeTypedList(
  base: Record<string, unknown>[],
  incoming: Record<string, unknown>[],
  path: string[],
): Record<string, unknown>[] {
  const incomingByType = new Map<string, Record<string, unknown>>();
  for (const item of incoming) {
    const type = asString(item.type).toLowerCase();
    if (type) incomingByType.set(type, item);
  }

  const used = new Set<string>();
  const result: Record<string, unknown>[] = [];
  for (const row of base) {
    const type = asString(row.type).toLowerCase();
    const overlay = type ? incomingByType.get(type) : undefined;
    if (overlay) {
      result.push(mergeRecords(row, overlay, [...path, type || String(result.length)]));
      used.add(type);
    } else {
      result.push(row);
    }
  }
  for (const item of incoming) {
    const type = asString(item.type).toLowerCase();
    if (type && used.has(type)) continue;
    result.push(item);
  }
  return result;
}

function mergeKeyedList(
  base: Record<string, unknown>[],
  incoming: Record<string, unknown>[],
  path: string[],
): Record<string, unknown>[] {
  const merged = new Map<string, Record<string, unknown>>();
  const fallbackOrder: string[] = [];
  for (const row of base) {
    const key = itemKey(row);
    if (!key) continue;
    merged.set(key, { ...row });
    fallbackOrder.push(key);
  }

  const incomingOrder: string[] = [];
  for (const item of incoming) {
    const key = itemKey(item);
    if (!key) {
      incomingOrder.push('');
      continue;
    }
    const current = merged.get(key) ?? {};
    merged.set(key, mergeRecords(current, item, [...path, key]));
    incomingOrder.push(key);
  }

  const used = new Set<string>();
  const result: Record<string, unknown>[] = [];
  for (const key of incomingOrder) {
    if (!key || used.has(key)) continue;
    const row = merged.get(key);
    if (row) {
      result.push(row);
      used.add(key);
    }
  }
  for (const key of fallbackOrder) {
    if (used.has(key)) continue;
    const row = merged.get(key);
    if (row) {
      result.push(row);
      used.add(key);
    }
  }
  for (const item of incoming) {
    if (!itemKey(item)) result.push(item);
  }
  return result.length ? result : incoming;
}

export function fillTemplateWithSiteData(fixture: unknown, siteData: unknown): Record<string, unknown> {
  const defaults = unwrapFixture(fixture);
  const incoming = asRecord(siteData) ?? {};
  return mergeRecords(defaults, incoming, []);
}
