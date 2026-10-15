'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';

export type LeadKind = 'contact' | 'quote' | 'inquiry' | 'booking' | 'appointment' | 'reservation';

type LeadContextValue = {
  subdomain: string;
  locale: Locale;
  businessName: string;
};

const LeadContext = createContext<LeadContextValue | null>(null);

function inferSubdomain(): string {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname.toLowerCase();
  if (host.endsWith('.localhost')) return host.split('.')[0] || '';
  if (host !== 'localhost' && host !== '127.0.0.1') {
    const parts = host.split('.');
    if (parts.length > 2) return parts[0] || '';
  }
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments[0] === 'en' || segments[0] === 'de') return segments[1] || '';
  return segments[0] || '';
}

export function LeadProvider({
  subdomain,
  locale,
  businessName,
  children,
}: {
  subdomain?: string;
  locale: Locale;
  businessName: string;
  children: ReactNode;
}) {
  const value = useMemo<LeadContextValue>(
    () => ({
      subdomain: subdomain || inferSubdomain(),
      locale,
      businessName,
    }),
    [subdomain, locale, businessName],
  );
  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export type LeadStatus = 'idle' | 'sending' | 'sent' | 'error';

export function formDataToFields(form: HTMLFormElement): { fields: Record<string, string>; honeypot: string } {
  const data = new FormData(form);
  const fields: Record<string, string> = {};
  for (const [key, value] of data.entries()) {
    if (typeof value !== 'string') continue;
    if (key === 'website' || key === 'privacy') continue;
    const text = value.trim();
    if (text) fields[key] = text;
  }
  return { fields, honeypot: String(data.get('website') || '').trim() };
}

export function LeadHoneypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;
}

export function useLeadSubmit(kind: LeadKind) {
  const ctx = useContext(LeadContext);
  const [status, setStatus] = useState<LeadStatus>('idle');
  const [error, setError] = useState('');

  const submit = useCallback(
    async (fields: Record<string, string>, honeypot = '') => {
      setStatus('sending');
      setError('');
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subdomain: ctx?.subdomain || inferSubdomain(),
            locale: ctx?.locale,
            kind,
            fields,
            website: honeypot,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) {
          setStatus('error');
          setError(
            payload.error ||
              (ctx?.locale === 'en'
                ? 'The message could not be sent. Please try again.'
                : 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.'),
          );
          return false;
        }
        setStatus('sent');
        return true;
      } catch {
        setStatus('error');
        setError(
          ctx?.locale === 'en'
            ? 'The message could not be sent. Please try again.'
            : 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
        );
        return false;
      }
    },
    [ctx, kind],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
  }, []);

  return { status, error, submit, reset, sending: status === 'sending' };
}
