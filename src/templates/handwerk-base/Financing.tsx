"use client";

import { useMemo, useState } from "react";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";
import { euro, monthlyRate } from "@/templates/handwerk-base/utils";

export function Financing() {
  const { t } = useHandwerk();
  const [amount, setAmount] = useState(80000);
  const [years, setYears] = useState(12);
  const [rate, setRate] = useState(3.6);
  const monthly = useMemo(() => monthlyRate(amount, years, rate), [amount, years, rate]);

  return (
    <section id={sectionIds.financing} className="hw-section scroll-mt-24 bg-[var(--hw-cream)]">
      <div className="hw-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="hw-eyebrow">{t.financing.eyebrow}</p>
          <h2 className="hw-heading mt-4">{t.financing.title}</h2>
          <p className="mt-4 max-w-lg text-[var(--hw-stone)]">{t.financing.subtitle}</p>
        </div>
        <form className="rounded-2xl border border-[var(--hw-forest)]/10 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(21,36,28,0.4)]">
          <label className="block text-sm font-semibold text-[var(--hw-forest)]">
            {t.financing.amountLabel}
            <input
              type="range"
              min={10000}
              max={250000}
              step={1000}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-3 w-full accent-[var(--hw-clay)]"
            />
            <span className="mt-1 block text-[var(--hw-clay-dark)]">{euro(amount)}</span>
          </label>
          <label className="mt-6 block text-sm font-semibold text-[var(--hw-forest)]">
            {t.financing.yearsLabel}
            <input
              type="range"
              min={5}
              max={25}
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
              className="mt-3 w-full accent-[var(--hw-clay)]"
            />
            <span className="mt-1 block text-[var(--hw-clay-dark)]">{years}</span>
          </label>
          <label className="mt-6 block text-sm font-semibold text-[var(--hw-forest)]">
            {t.financing.rateLabel}
            <input
              type="range"
              min={1}
              max={8}
              step={0.1}
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
              className="mt-3 w-full accent-[var(--hw-clay)]"
            />
            <span className="mt-1 block text-[var(--hw-clay-dark)]">{rate.toFixed(1)} %</span>
          </label>
          <p className="mt-8 font-display text-4xl text-[var(--hw-forest)]">{euro(monthly)}</p>
          <p className="mt-1 text-sm text-[var(--hw-stone)]">{t.financing.resultLabel}</p>
          <p className="mt-4 text-xs text-[var(--hw-stone)]">{t.financing.note}</p>
        </form>
      </div>
    </section>
  );
}
