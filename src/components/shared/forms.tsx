'use client';

import { useMemo, type FormEvent } from 'react';
import { formDataToFields, LeadHoneypot, useLeadSubmit, type LeadKind } from '@/components/shared/LeadProvider';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { BookingConfig } from '@/lib/types/template';

type FormKind = 'appointment' | 'reservation' | 'quote';

function Field({
  id,
  label,
  type = 'text',
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  const className =
    'w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-[var(--brand-primary)] focus:ring-2';

  if (type === 'textarea') {
    return (
      <label className="block text-sm font-medium">
        <span className="mb-1.5 block">{label}</span>
        <textarea id={id} name={id} rows={4} required={required} className={className} />
      </label>
    );
  }

  return (
    <label className="block text-sm font-medium">
      <span className="mb-1.5 block">{label}</span>
      <input id={id} name={id} type={type} required={required} className={className} />
    </label>
  );
}

function StaticForm({
  title,
  note,
  success,
  submitLabel,
  dict,
  fields,
  extra,
  kind,
}: {
  title: string;
  note: string;
  success: string;
  submitLabel: string;
  dict: Dictionary;
  fields: string[];
  extra?: 'guests';
  kind: LeadKind;
}) {
  const visible = useMemo(() => new Set(fields.map((field) => field.toLowerCase())), [fields]);
  const { status, error, submit, sending } = useLeadSubmit(kind);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = formDataToFields(event.currentTarget);
    await submit(parsed.fields, parsed.honeypot);
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm leading-relaxed">
        <p className="font-semibold text-[var(--brand-primary)]">{success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <LeadHoneypot />
      <h3 className="text-xl font-extrabold">{title}</h3>
      {visible.has('name') ? <Field id="name" label={dict.templates.formName} /> : null}
      {visible.has('phone') ? <Field id="phone" label={dict.templates.formPhone} type="tel" /> : null}
      {visible.has('email') ? <Field id="email" label={dict.templates.formEmail} type="email" /> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.has('date') ? <Field id="date" label={dict.templates.formDate} type="date" /> : null}
        {visible.has('time') ? <Field id="time" label={dict.templates.formTime} type="time" /> : null}
      </div>
      {extra === 'guests' ? (
        <Field id="guests" label={dict.templates.formGuests} type="number" />
      ) : null}
      {visible.has('message') || visible.has('note') ? (
        <Field id="message" label={dict.templates.formMessage} type="textarea" required={false} />
      ) : null}
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-[var(--brand-primary)] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {sending ? dict.templates.formSending : submitLabel}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">{error || dict.templates.formError}</p>}
      <p className="text-xs opacity-60">{note}</p>
    </form>
  );
}

export function AppointmentForm({
  dict,
  booking,
}: {
  dict: Dictionary;
  booking: BookingConfig;
}) {
  return (
    <StaticForm
      title={booking.title || dict.templates.bookingTitle}
      note={dict.templates.formNote}
      success={dict.templates.formSuccess}
      submitLabel={dict.templates.formSubmit}
      dict={dict}
      fields={booking.fields}
      kind="appointment"
    />
  );
}

export function ReservationForm({
  dict,
  booking,
}: {
  dict: Dictionary;
  booking: BookingConfig;
}) {
  return (
    <StaticForm
      title={booking.title || dict.templates.reservationTitle}
      note={dict.templates.formNote}
      success={dict.templates.formSuccess}
      submitLabel={dict.templates.formSubmit}
      dict={dict}
      fields={booking.fields}
      extra="guests"
      kind="reservation"
    />
  );
}

export function QuoteRequestForm({
  dict,
  booking,
}: {
  dict: Dictionary;
  booking: BookingConfig;
}) {
  return (
    <StaticForm
      title={booking.title || dict.templates.quoteTitle}
      note={dict.templates.formNote}
      success={dict.templates.formSuccess}
      submitLabel={dict.templates.formSubmit}
      dict={dict}
      fields={booking.fields.length ? booking.fields : ['name', 'phone', 'email', 'message']}
      kind="quote"
    />
  );
}

export type { FormKind };
