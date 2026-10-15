"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";
import { useQuote } from "@/templates/handwerk-base/quote";

export function Hero() {
  const { t } = useHandwerk();
  const { open } = useQuote();

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-[var(--hw-forest-deep)] pt-[78px] text-[var(--hw-cream)]">
      {t.hero.image && (
        <Image
          src={t.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--hw-forest-deep)] via-[var(--hw-forest-deep)]/88 to-[var(--hw-forest-deep)]/40" />
      <div className="hw-container relative grid min-h-[calc(92vh-78px)] items-center py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl">
          {t.hero.badge && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--hw-clay)]"
            >
              {t.hero.badge}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 font-display text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-6xl"
          >
            {t.hero.title}
          </motion.h1>
          {t.hero.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[var(--hw-cream)]/80 sm:text-lg"
            >
              {t.hero.subtitle}
            </motion.p>
          )}
          {t.hero.bullets.length > 0 && (
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {t.hero.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 text-sm text-[var(--hw-cream)]/90">
                  <Check className="h-4 w-4 text-[var(--hw-clay)]" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={open} className="hw-btn hw-btn-clay h-12 px-7">
              {t.hero.ctaPrimary}
            </button>
            {t.sections.services && (
              <a href={`#${sectionIds.services}`} className="hw-btn hw-btn-ghost h-12 px-7">
                {t.hero.ctaSecondary}
              </a>
            )}
          </div>
        </div>
      </div>
      {t.hero.stats.length > 0 && (
        <div className="relative border-t border-white/10 bg-[var(--hw-forest)]/80">
          <dl className="hw-container grid grid-cols-2 gap-px divide-white/10 sm:grid-cols-4">
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="px-4 py-6 sm:px-6">
                <dt className="font-display text-3xl text-[var(--hw-clay)]">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--hw-cream)]/70">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
