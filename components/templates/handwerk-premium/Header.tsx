"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { sectionIds } from "@/components/templates/handwerk-premium/data";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";
import { LanguageSwitcher } from "@/components/templates/handwerk-premium/LanguageSwitcher";
import { Logo } from "@/components/templates/handwerk-premium/Logo";
import { useQuote } from "@/components/templates/handwerk-premium/quote";
import { cn } from "@/components/templates/handwerk-premium/utils";

export function Header() {
  const { t, brandName } = useHandwerk();
  const { open } = useQuote();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: sectionIds.services, label: t.nav.services, on: t.sections.services },
    { id: sectionIds.projects, label: t.nav.projects, on: t.sections.projects },
    { id: sectionIds.reviews, label: t.nav.reviews, on: t.sections.reviews },
    { id: sectionIds.team, label: t.nav.team, on: t.sections.team },
    { id: sectionIds.contact, label: t.nav.contact, on: t.sections.contact },
  ].filter((item) => item.on);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled ? "border-white/10 bg-[var(--hw-forest-deep)]/95 backdrop-blur-md" : "border-transparent bg-[var(--hw-forest-deep)]",
        )}
      >
        <div className="hw-container flex h-[78px] items-center justify-between gap-4">
          <a href="#top" aria-label={brandName} className="shrink-0">
            <Logo light />
          </a>
          <nav className="hidden items-center lg:flex" aria-label="Main">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--hw-cream)]/80 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            {t.header.hours && (
              <a href={`#${sectionIds.hours}`} className="hidden items-center gap-2 text-xs text-[var(--hw-cream)]/70 hover:text-white 2xl:inline-flex">
                <Clock className="h-3.5 w-3.5" />
                {t.header.hours}
              </a>
            )}
            {t.contact.phoneHref && (
              <a href={t.contact.phoneHref} className="hidden items-center gap-2 text-sm text-[var(--hw-cream)]/80 hover:text-white 2xl:inline-flex">
                <Phone className="h-4 w-4" />
                {t.contact.phone}
              </a>
            )}
            <button type="button" onClick={open} className="hw-btn hw-btn-clay h-11 px-5 text-sm">
              {t.header.cta}
            </button>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md text-[var(--hw-cream)] lg:hidden"
            aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--hw-forest-deep)] pt-[78px] lg:hidden"
          >
            <nav className="hw-container flex flex-col gap-2 py-8">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/10 py-4 font-display text-3xl text-[var(--hw-cream)]"
                >
                  {link.label}
                </a>
              ))}
              <LanguageSwitcher id="mobile" className="mt-6 self-start" />
              <button type="button" onClick={() => { setMenuOpen(false); open(); }} className="hw-btn hw-btn-clay mt-6 h-12">
                {t.header.cta}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
