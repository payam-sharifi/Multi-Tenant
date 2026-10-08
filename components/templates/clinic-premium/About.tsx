"use client";

import { motion } from "framer-motion";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { resolveIcon } from "@/components/templates/clinic-premium/icons";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { CountUp } from "./ui/CountUp";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function About() {
  const { t } = useI18n();

  return (
    <section id={sectionIds.about} className="section-y scroll-mt-16">
      <div className="container-x">
        <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} subtitle={t.about.subtitle} />

        {t.about.values.length > 0 && (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.values.map((v, i) => {
            const Icon = resolveIcon(v.icon);
            return (
              <Reveal key={v.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-brand-900/10 bg-white p-7 shadow-card transition-colors hover:border-mint/60"
                >
                  <div
                    aria-hidden
                    className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-mint/0 blur-2xl transition-colors duration-500 group-hover:bg-mint/30"
                  />
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-900 text-mint transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <h3 className="relative mt-6 text-lg font-bold text-brand-900">{v.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
        )}

        {/* stats */}
        {t.about.stats.length > 0 && (
        <Reveal className={`relative ${t.about.values.length > 0 ? "mt-10" : "mt-14"} overflow-hidden rounded-[2rem] bg-brand-900 px-6 py-10 text-white shadow-soft sm:px-10 sm:py-12`}>
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-mint/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
          <dl
            style={{ "--cols": t.about.stats.length } as React.CSSProperties}
            className="relative grid grid-cols-2 gap-y-10 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] lg:divide-x lg:divide-white/10"
          >
            {t.about.stats.map((s) => (
              <div key={s.label} className="px-4 text-center">
                <dt className="text-4xl font-extrabold tracking-tight text-mint sm:text-5xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dt>
                <dd className="mt-2 text-sm text-white/70">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        )}
      </div>
    </section>
  );
}
