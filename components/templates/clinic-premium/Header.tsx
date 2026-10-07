"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Clock, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { LanguageSwitcher } from "@/components/templates/clinic-premium/LanguageSwitcher";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";

export function Header() {
  const { t, brandName } = useI18n();
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const links = [
    { id: sectionIds.services, label: t.nav.services, on: t.sections.services },
    { id: sectionIds.checkup, label: t.nav.checkup, on: t.sections.checkup },
    { id: sectionIds.about, label: t.nav.about, on: t.sections.about },
    { id: sectionIds.doctors, label: t.nav.doctors, on: t.sections.doctors },
    { id: sectionIds.locations, label: t.nav.locations, on: t.sections.locations },
    { id: sectionIds.faq, label: t.nav.faq, on: t.sections.faq },
  ].filter((l) => l.on);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // highlight the section currently in view
  useEffect(() => {
    const els = Object.values(sectionIds)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-brand-900/10 bg-white/80 shadow-[0_8px_30px_-12px_rgba(10,56,50,0.18)]"
            : "border-transparent bg-white/60",
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <a href="#top" aria-label={brandName} className="shrink-0">
            <Logo />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors xl:px-3.5",
                  active === l.id ? "text-brand-900" : "text-muted hover:text-brand-900",
                )}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-mint-soft"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {t.contact.phone && (
            <a
              href={t.contact.phoneHref}
              className="group hidden items-center gap-3 rounded-full border border-brand-900/10 bg-white px-4 py-1.5 transition-colors hover:border-mint xl:flex"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-mint-soft text-brand-900 transition-colors group-hover:bg-mint">
                <Phone className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                {t.header.hours && (
                  <span className="hidden items-center gap-1 text-[11px] font-medium text-muted 2xl:flex">
                    <Clock className="h-3 w-3" /> {t.header.hours}
                  </span>
                )}
                <span className="block text-sm font-bold text-brand-900">{t.contact.phone}</span>
              </span>
            </a>
            )}

            <LanguageSwitcher className="hidden lg:flex" id="desk" />

            <Button size="sm" className="hidden sm:inline-flex" onClick={() => open()}>
              <CalendarCheck className="h-4 w-4" />
              {t.header.book}
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.header.openMenu}
              className="grid h-11 w-11 place-items-center rounded-full bg-brand-900/5 text-brand-900 transition-colors hover:bg-brand-900/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-brand-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,380px)] flex-col bg-white p-6 shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t.header.closeMenu}
                  className="grid h-11 w-11 place-items-center rounded-full bg-brand-900/5 text-brand-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col" aria-label="Mobile">
                {links.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className="flex items-center justify-between border-b border-brand-900/10 py-4 text-lg font-bold text-brand-900"
                  >
                    {l.label}
                    <span className="h-2 w-2 rounded-full bg-mint" />
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto space-y-4 pt-8">
                <LanguageSwitcher className="w-full justify-between" id="mob" />
                {t.contact.phone && (
                <a
                  href={t.contact.phoneHref}
                  className="flex items-center gap-3 rounded-2xl bg-surface p-4"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-mint text-brand-900">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    {t.header.hours && <span className="block text-xs text-muted">{t.header.hours}</span>}
                    <span className="font-bold text-brand-900">{t.contact.phone}</span>
                  </span>
                </a>
                )}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    open();
                  }}
                >
                  <CalendarCheck className="h-5 w-5" />
                  {t.header.book}
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
