"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Faq() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={sectionIds.faq} className="section-y scroll-mt-16 bg-surface">
      <div className="container-x">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} subtitle={t.faq.subtitle} />

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {t.faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={`${item.question}-${i}`} delay={Math.min(i, 5) * 0.05}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white shadow-card transition-colors",
                    isOpen ? "border-mint/60" : "border-brand-900/10",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-brand-900 sm:px-6 sm:py-5"
                    >
                      {item.question}
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                          isOpen ? "bg-mint text-brand-900" : "bg-mint-soft text-brand-700",
                        )}
                      >
                        <Plus className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-45")} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
