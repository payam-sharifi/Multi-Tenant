'use client';

import { CalendarCheck, Mail, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/templates/haustechnik-base/Logo';
import { useHaustechnik } from '@/templates/haustechnik-base/context';

export function Header() {
  const { emergencyHours, hours, nav, phoneHref, email } = useHaustechnik();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <div className="bg-[var(--mh-navy)] py-2 text-xs text-white/85">
        <p className="mh-container flex items-center justify-between gap-4">
          <span className="font-medium tracking-wide">{emergencyHours} bei Rohrbruch &amp; Heizungsausfall</span>
          <span className="hidden md:inline">{hours}</span>
        </p>
      </div>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-[var(--mh-line)] bg-white/95 shadow-[0_8px_30px_-18px_rgba(11,37,69,0.35)] backdrop-blur-md'
            : 'border-transparent bg-white'
        }`}
      >
        <div className="mh-container flex h-[72px] items-center justify-between gap-3">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--mh-navy)]/80 transition hover:bg-[var(--mh-bg)] hover:text-[var(--mh-navy)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {email && (
              <a
                href={`mailto:${email}`}
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--mh-navy)]/80 hover:text-[var(--mh-navy)] xl:inline-flex"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {email}
              </a>
            )}
            <a href={phoneHref} className="mh-btn mh-btn-accent hidden h-11 px-4 text-sm lg:inline-flex">
              <Phone className="h-4 w-4" aria-hidden />
              24/7 Notdienst anrufen
            </a>
            <a href="#kontakt" className="mh-btn mh-btn-navy hidden h-11 px-3 text-sm sm:inline-flex">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Termin vereinbaren
            </a>
            <a
              href={phoneHref}
              className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--mh-accent)] text-white lg:hidden"
              aria-label="24/7 Notdienst anrufen"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--mh-line)] text-[var(--mh-navy)] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-nav" className="border-t border-[var(--mh-line)] bg-white lg:hidden">
            <nav className="mh-container flex flex-col gap-1 py-4" aria-label="Mobilnavigation">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-[var(--mh-navy)]"
                >
                  {item.label}
                </a>
              ))}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[var(--mh-navy)]"
                  onClick={() => setOpen(false)}
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {email}
                </a>
              )}
              <a href={phoneHref} className="mh-btn mh-btn-accent mt-3 h-12" onClick={() => setOpen(false)}>
                <Phone className="h-4 w-4" aria-hidden />
                24/7 Notdienst anrufen
              </a>
              <a href="#kontakt" className="mh-btn mh-btn-navy mt-2 h-12" onClick={() => setOpen(false)}>
                <CalendarCheck className="h-4 w-4" aria-hidden />
                Termin vereinbaren
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
