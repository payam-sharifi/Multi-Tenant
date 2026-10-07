"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarCheck, Languages, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export function Hero() {
  const { t, brandName } = useI18n();
  const { open } = useBooking();
  const mainImage = t.hero.chiefImage || t.hero.heroImage;
  const chiefDoctor = t.doctors.items.find((d) => d.id === t.hero.chiefDoctorId);

  return (
    <section className="relative overflow-hidden pb-20 pt-[104px] sm:pt-32 lg:pb-28">
      {/* background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-pattern absolute inset-x-0 top-0 h-[720px]" />
        <div className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-mint/20 blur-[120px]" />
        <div className="absolute -right-32 top-40 h-[520px] w-[520px] rounded-full bg-sage blur-[120px]" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* LEFT */}
        <div>
          {t.hero.badge && (
            <motion.span {...fadeUp(0)} className="pill">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-mint" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-dark" />
              </span>
              {t.hero.badge}
            </motion.span>
          )}

          <motion.h1 {...fadeUp(0.08)} className={cn("heading-xl", t.hero.badge ? "mt-6" : "mt-0")}>
            {t.hero.titleA}{" "}
            {t.hero.titleB && (
              <>
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10">{t.hero.titleB}</span>
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.7, ease }}
                    className="absolute inset-x-[-4px] bottom-1 z-0 h-[0.34em] origin-left rounded-md bg-mint/70"
                  />
                </span>{" "}
              </>
            )}
            {t.hero.titleC}
          </motion.h1>

          {t.hero.subtitle && (
            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {t.hero.subtitle}
            </motion.p>
          )}

          <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => open()}>
              <CalendarCheck className="h-5 w-5" />
              {t.hero.ctaPrimary}
            </Button>
            {t.sections.services && (
              <Button size="lg" variant="outline" href={`#${sectionIds.services}`}>
                {t.hero.ctaSecondary}
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </motion.div>

          {/* stats bar */}
          {t.hero.stats.length > 0 && (
          <motion.dl
            {...fadeUp(0.32)}
            style={{ gridTemplateColumns: `repeat(${t.hero.stats.length}, minmax(0, 1fr))` }}
            className="mt-10 grid max-w-xl divide-x divide-brand-900/10 rounded-2xl border border-brand-900/10 bg-white/80 py-4 shadow-card backdrop-blur"
          >
            {t.hero.stats.map((s) => (
              <div key={s.label} className="px-3 text-center sm:px-5 sm:text-left">
                <dt className="text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">{s.value}</dt>
                <dd className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
          )}

          {/* avatars pill */}
          {t.hero.pillText && (
          <motion.div
            {...fadeUp(0.4)}
            className="mt-6 inline-flex max-w-xl items-center gap-4 rounded-full border border-brand-900/10 bg-white py-2 pl-2 pr-5 shadow-card"
          >
            <div className="flex -space-x-3">
              {t.hero.avatars.slice(0, 4).map((a, i) => (
                <motion.div
                  key={`${a.src}-${i}`}
                  whileHover={{ y: -4, zIndex: 10 }}
                  className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-sage"
                  style={{ zIndex: 4 - i }}
                >
                  <Avatar src={a.src} name={a.name} sizes="44px" className="text-xs" />
                </motion.div>
              ))}
              {t.hero.pillValue && (
                <div className="relative z-0 grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-brand-900 text-xs font-bold text-mint">
                  {t.hero.pillValue}
                </div>
              )}
            </div>
            <p className="text-sm font-medium leading-snug text-brand-900">{t.hero.pillText}</p>
          </motion.div>
          )}
        </div>

        {/* RIGHT — doctor highlight / image / brand panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-mint/30 via-sage to-transparent blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-800 shadow-soft ring-1 ring-brand-900/10">
            {mainImage ? (
              <>
                <Image
                  src={mainImage}
                  alt={t.hero.chiefName || brandName}
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
              </>
            ) : (
              <BrandPanel name={brandName} />
            )}

            {/* nameplate */}
            {t.hero.chiefName && (
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/15 p-4 text-white backdrop-blur-md">
                <div className="min-w-0">
                  {t.hero.available && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-0.5 text-[11px] font-bold text-brand-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-900" />
                      {t.hero.available}
                    </span>
                  )}
                  <p className="mt-2 truncate text-lg font-bold leading-tight">{t.hero.chiefName}</p>
                  {(t.hero.chiefRole || t.hero.chiefMeta) && (
                    <p className="truncate text-xs text-white/80">
                      {[t.hero.chiefRole, t.hero.chiefMeta].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => open({ doctor: chiefDoctor?.id, service: chiefDoctor?.serviceIndex })}
                  aria-label={t.header.book}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mint text-brand-900 shadow-glow"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Rating */}
          {t.hero.ratingScore && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease }}
              className="absolute -left-3 top-8 sm:-left-8"
            >
              <div className="animate-floaty flex items-center gap-3 rounded-2xl border border-brand-900/5 bg-white p-3 pr-5 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface text-xl font-extrabold text-[#4285F4]">
                  G
                </span>
                <div className="leading-tight">
                  <div className="flex items-center gap-1 text-lg font-extrabold text-brand-900">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    {t.hero.ratingScore}
                  </div>
                  {t.hero.reviews && <div className="text-[11px] text-muted">{t.hero.reviews}</div>}
                </div>
              </div>
            </motion.div>
          )}

          {/* language promise */}
          {t.hero.promiseTitle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6, ease }}
              className="absolute -right-3 top-[38%] sm:-right-8"
            >
              <div
                className="animate-floaty flex max-w-[210px] items-start gap-3 rounded-2xl bg-brand-900 p-4 text-white shadow-soft"
                style={{ animationDelay: "-3s" }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint text-brand-900">
                  <Languages className="h-5 w-5" />
                </span>
                <div className="leading-snug">
                  <p className="text-sm font-bold">{t.hero.promiseTitle}</p>
                  {t.hero.promiseText && <p className="mt-1 text-[11px] text-white/70">{t.hero.promiseText}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/** Used when the site has no hero photo: a calm brand panel instead of a missing/sample picture. */
function BrandPanel({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950">
      <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mint/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="relative flex flex-col items-center gap-6 px-8 text-center text-white">
        <span className="grid h-24 w-24 place-items-center rounded-3xl bg-mint text-brand-900 shadow-glow">
          <Plus className="h-12 w-12" strokeWidth={3} />
        </span>
        <p className="text-2xl font-extrabold tracking-tight">{name}</p>
      </div>
    </div>
  );
}
