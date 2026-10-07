"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ChevronDown, Clock, Loader2, Phone, ShieldCheck, Stethoscope, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { timeSlots } from "@/components/templates/clinic-premium/data";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { Button } from "./ui/Button";

type Form = { name: string; phone: string; spec: string; doctor: string; date: string; time: string };
type Errors = Partial<Record<keyof Form, string>>;

const empty: Form = { name: "", phone: "", spec: "", doctor: "", date: "", time: "" };

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const inputBase =
  "w-full rounded-xl border bg-surface-alt px-4 py-3 text-sm font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-muted/70 focus:border-mint focus:bg-white focus:ring-4 focus:ring-mint/20";

export function BookingModal() {
  const { t } = useI18n();
  const { isOpen, prefill, close } = useBooking();
  const b = t.booking;
  const doctors = t.doctors.items;
  const hasServices = t.services.items.length > 0;
  const hasDoctors = doctors.length > 0;

  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const firstRef = useRef<HTMLInputElement>(null);

  // reset + prefill each time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    const doc = doctors.find((d) => d.id === prefill.doctor);
    const requested = doc?.serviceIndex ?? prefill.service;
    const service = requested !== undefined && t.services.items[requested] ? requested : undefined;
    // Intentional: reset the form each time the dialog opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...empty, spec: service !== undefined ? String(service) : "", doctor: doc?.id ?? "" });
    setErrors({});
    setStatus("idle");
    const id = setTimeout(() => firstRef.current?.focus(), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefill]);

  // scroll lock + Esc
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const availableDoctors = useMemo(
    () =>
      form.spec === ""
        ? doctors
        : doctors.filter((d) => d.serviceIndex === undefined || d.serviceIndex === Number(form.spec)),
    [form.spec, doctors],
  );

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSpecChange = (v: string) => {
    setForm((f) => {
      const stillValid = doctors.some(
        (d) => d.id === f.doctor && (d.serviceIndex === undefined || String(d.serviceIndex) === v),
      );
      return { ...f, spec: v, doctor: stillValid ? f.doctor : "" };
    });
    setErrors((e) => ({ ...e, spec: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = b.errName;
    if (form.phone.replace(/\D/g, "").length < 9) e.phone = b.errPhone;
    if (hasServices && form.spec === "") e.spec = b.errSpec;
    if (!form.date || form.date < todayStr()) e.date = b.errDate;
    if (!form.time) e.time = b.errTime;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    // Demo only: replace with a real API call (e.g. POST /api/appointments)
    setTimeout(() => setStatus("done"), 1000);
  };

  const doc = doctors.find((d) => d.id === form.doctor);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="booking"
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            onClick={close}
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
          >
            {/* header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 to-brand-950 px-6 py-6 text-white sm:px-8">
              <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-mint/25 blur-3xl" />
              <button
                type="button"
                onClick={close}
                aria-label={b.close}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 id="booking-title" className="relative pr-12 text-2xl font-extrabold tracking-tight">
                {b.title}
              </h2>
              <p className="relative mt-1 text-sm text-white/70">{b.subtitle}</p>
            </div>

            <div className="overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {status !== "done" ? (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5 p-6 sm:p-8"
                  >
                    <Field label={b.name} icon={User} error={errors.name}>
                      <input
                        ref={firstRef}
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder={b.namePh}
                        aria-invalid={!!errors.name}
                        className={cn(inputBase, "pl-11", errors.name ? "border-red-400" : "border-brand-900/10")}
                      />
                    </Field>

                    <Field label={b.phone} icon={Phone} error={errors.phone}>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value.replace(/[^\d+\s()-]/g, ""))}
                        placeholder={b.phonePh}
                        aria-invalid={!!errors.phone}
                        className={cn(inputBase, "pl-11", errors.phone ? "border-red-400" : "border-brand-900/10")}
                      />
                    </Field>

                    <div className={cn("grid gap-5", hasServices && hasDoctors && "sm:grid-cols-2")}>
                      {hasServices && (
                      <Field label={b.spec} icon={Stethoscope} error={errors.spec} chevron>
                        <select
                          value={form.spec}
                          onChange={(e) => onSpecChange(e.target.value)}
                          aria-invalid={!!errors.spec}
                          className={cn(inputBase, "appearance-none pl-11 pr-10", errors.spec ? "border-red-400" : "border-brand-900/10", form.spec === "" && "text-muted")}
                        >
                          <option value="">{b.specPh}</option>
                          {t.services.items.map((s, i) => (
                            <option key={s.id} value={i}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </Field>
                      )}

                      {hasDoctors && (
                      <Field label={b.doctor} icon={User} chevron>
                        <select
                          value={form.doctor}
                          onChange={(e) => set("doctor", e.target.value)}
                          className={cn(inputBase, "appearance-none pl-11 pr-10 border-brand-900/10")}
                        >
                          <option value="">{b.doctorAny}</option>
                          {availableDoctors.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      )}
                    </div>

                    <Field label={b.date} icon={CalendarDays} error={errors.date}>
                      <input
                        type="date"
                        min={todayStr()}
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                        aria-invalid={!!errors.date}
                        className={cn(inputBase, "pl-11", errors.date ? "border-red-400" : "border-brand-900/10")}
                      />
                    </Field>

                    <div>
                      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                        <Clock className="h-3.5 w-3.5" />
                        {b.time}
                      </span>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                        {timeSlots.map((slot) => {
                          const sel = form.time === slot;
                          return (
                            <motion.button
                              key={slot}
                              type="button"
                              whileTap={{ scale: 0.93 }}
                              onClick={() => set("time", slot)}
                              aria-pressed={sel}
                              className={cn(
                                "rounded-xl border py-2 text-sm font-semibold transition-colors",
                                sel
                                  ? "border-mint bg-mint text-brand-900 shadow-glow"
                                  : "border-brand-900/10 bg-surface-alt text-ink/80 hover:border-mint hover:bg-mint-soft",
                              )}
                            >
                              {slot}
                            </motion.button>
                          );
                        })}
                      </div>
                      {errors.time && <p className="mt-2 text-xs font-medium text-red-500">{errors.time}</p>}
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {b.sending}
                        </>
                      ) : (
                        b.submit
                      )}
                    </Button>
                    <p className="flex items-start justify-center gap-2 text-center text-xs text-muted">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-dark" />
                      {b.privacy}
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 text-center sm:p-10"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint-soft text-mint-dark"
                    >
                      <CheckCircle2 className="h-11 w-11" />
                    </motion.div>
                    <h3 className="mt-6 text-2xl font-extrabold text-brand-900">{b.successTitle}</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                      {b.successText.replace("{name}", form.name.trim().split(" ")[0])}
                    </p>

                    <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-surface p-4 text-left text-sm">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{b.summary}</p>
                      <dl className="space-y-1.5">
                        {hasServices && <Row k={b.spec} v={t.services.items[Number(form.spec)]?.title} />}
                        {doc && <Row k={b.doctor} v={doc.name} />}
                        <Row k={b.date} v={`${form.date} · ${form.time}`} />
                        <Row k={b.phone} v={form.phone} />
                      </dl>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button variant="dark" onClick={close}>
                        {b.close}
                      </Button>
                      <Button variant="outline" onClick={() => { setForm(empty); setStatus("idle"); }}>
                        {b.another}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-semibold text-brand-900">{v}</dd>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  chevron,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  chevron?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-700">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted" />
        {children}
        {chevron && (
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        )}
      </span>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="block overflow-hidden pt-1.5 text-xs font-medium text-red-500"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
