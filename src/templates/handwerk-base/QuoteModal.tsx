"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FormEvent, useEffect } from "react";
import {
  formDataToFields,
  LeadHoneypot,
  useLeadSubmit,
} from "@/components/shared/LeadProvider";
import { useHandwerk } from "@/templates/handwerk-base/i18n";
import { useQuote } from "@/templates/handwerk-base/quote";

export function QuoteModal() {
  const { t } = useHandwerk();
  const { isOpen, close } = useQuote();
  const { status, error, submit, sending, reset } = useLeadSubmit("quote");

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const { fields, honeypot } = formDataToFields(form);
    const ok = await submit(fields, honeypot);
    if (ok) form.reset();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-[var(--hw-forest-deep)]/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-lg rounded-2xl bg-[var(--hw-cream)] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-3xl text-[var(--hw-forest)]">
                {t.quote.title}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t.quote.close}
                className="grid h-9 w-9 place-items-center rounded-full bg-[var(--hw-sand)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="mt-6">
              <LeadHoneypot />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="firstName"
                  placeholder={t.contact.firstName}
                  className="hw-input"
                />
                <input
                  required
                  name="lastName"
                  placeholder={t.contact.lastName}
                  className="hw-input"
                />
              </div>
              <input
                required
                type="email"
                name="email"
                placeholder={t.contact.emailPlaceholder}
                className="hw-input mt-4"
              />
              <input
                required
                name="phone"
                placeholder={t.contact.phonePlaceholder}
                className="hw-input mt-4"
              />
              <textarea
                name="message"
                rows={4}
                placeholder={t.contact.message}
                className="hw-input mt-4 resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="hw-btn hw-btn-clay mt-5 h-12 w-full disabled:opacity-60"
              >
                {sending ? t.contact.sending : t.contact.submit}
              </button>
              {status === "sent" && (
                <p className="mt-3 text-sm text-[var(--hw-forest)]">
                  {t.contact.success}
                </p>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-red-700">
                  {error || t.contact.error}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
