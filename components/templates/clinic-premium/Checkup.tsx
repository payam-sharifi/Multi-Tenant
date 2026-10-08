"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, BadgePercent } from "lucide-react";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { resolveIcon } from "@/components/templates/clinic-premium/icons";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Checkup() {
  const { t } = useI18n();
  const { open } = useBooking();

  return (
    <section id={sectionIds.checkup} className="section-y relative scroll-mt-16 bg-surface">
      <div className="container-x">
        <SectionHeading eyebrow={t.checkup.eyebrow} title={t.checkup.title} subtitle={t.checkup.subtitle} />

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {t.checkup.plans.map((plan, i) => {
            const Icon = resolveIcon(plan.icon);
            const featured = plan.featured;
            return (
              <Reveal key={plan.id} delay={i * 0.1} className="flex">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "relative flex w-full flex-col rounded-3xl p-7 sm:p-8",
                    featured
                      ? "bg-gradient-to-b from-brand-800 to-brand-950 text-white shadow-soft ring-1 ring-mint/30 lg:-my-4 lg:py-12"
                      : "border border-brand-900/10 bg-white shadow-card",
                  )}
                >
                  {featured && (
                    <>
                      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-mint/25 blur-3xl" />
                      </div>
                      <span className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-mint px-4 py-1.5 text-xs font-extrabold text-brand-900 shadow-glow">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t.checkup.featured}
                      </span>
                    </>
                  )}

                  <div className="relative flex items-start justify-between">
                    <span
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-2xl",
                        featured ? "bg-mint text-brand-900" : "bg-mint-soft text-brand-700",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    {featured && t.checkup.discount && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-bold text-[#FBBF24]">
                        <BadgePercent className="h-3.5 w-3.5" />
                        {t.checkup.discount}
                      </span>
                    )}
                  </div>

                  <h3 className={cn("mt-6 text-2xl font-extrabold tracking-tight", !featured && "text-brand-900")}>
                    {plan.name}
                  </h3>
                  <p className={cn("mt-2 text-sm", featured ? "text-white/70" : "text-muted")}>{plan.desc}</p>

                  {plan.price !== undefined && (
                    <div className="mt-6 flex items-end gap-2">
                      <span className={cn("pb-1.5 text-sm font-medium", featured ? "text-white/70" : "text-muted")}>
                        {t.checkup.from}
                      </span>
                      <span className={cn("text-5xl font-extrabold tracking-tight", featured ? "text-mint" : "text-brand-900")}>
                        {plan.price}
                      </span>
                      <span className={cn("pb-1.5 text-lg font-bold", featured ? "text-white" : "text-brand-900")}>
                        {t.checkup.currency}
                      </span>
                      {plan.oldPrice !== undefined && (
                        <span className="pb-1.5 text-sm text-white/50 line-through">
                          {plan.oldPrice} {t.checkup.currency}
                        </span>
                      )}
                    </div>
                  )}

                  <div className={cn("my-6 h-px", featured ? "bg-white/15" : "bg-brand-900/10")} />

                  <ul className="flex-1 space-y-3.5">
                    {plan.features.map((f, fi) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + fi * 0.06 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                            featured ? "bg-mint text-brand-900" : "bg-mint-soft text-brand-700",
                          )}
                        >
                          <Check className="h-3 w-3" strokeWidth={3.5} />
                        </span>
                        <span className={featured ? "text-white/90" : "text-ink/80"}>{f}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    variant={featured ? "primary" : "dark"}
                    className="mt-8 w-full"
                    onClick={() => open({ service: plan.serviceIndex })}
                  >
                    {t.checkup.book}
                  </Button>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          {t.checkup.note && <p className="mt-12 text-center text-xs text-muted">{t.checkup.note}</p>}
        </Reveal>
      </div>
    </section>
  );
}
