"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";
import { cn } from "@/templates/handwerk-base/utils";

export function Faq() {
  const { t } = useHandwerk();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={sectionIds.faq} className="hw-section scroll-mt-24 bg-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.faq.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.faq.title}</h2>
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={cn("overflow-hidden rounded-2xl border bg-white", isOpen ? "border-[var(--hw-clay)]" : "border-[var(--hw-forest)]/10")}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[var(--hw-forest)]"
                  >
                    {item.question}
                    <Plus className={cn("h-5 w-5 shrink-0 text-[var(--hw-clay)] transition-transform", isOpen && "rotate-45")} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--hw-stone)]">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
