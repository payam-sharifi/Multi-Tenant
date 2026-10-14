"use client";

import Image from "next/image";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";
import { cn } from "@/components/templates/handwerk-premium/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const { brandName, t } = useHandwerk();
  const [first, ...rest] = brandName.split(" ");
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {t.logo ? (
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white/95 ring-1 ring-white/20">
          <Image src={t.logo} alt="" fill sizes="44px" className="object-contain p-0.5" />
        </span>
      ) : (
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--hw-clay)]" aria-hidden>
          <svg viewBox="0 0 40 40" className="h-8 w-8">
            <path d="M6 18 L20 7 L34 18 V33 H24 V24 H16 V33 H6 Z" fill="none" stroke="#F6F1E8" strokeWidth="1.8" />
            <rect x="17.2" y="14" width="5.6" height="5.6" fill="#F6F1E8" />
          </svg>
        </span>
      )}
      <span className={cn("leading-tight", light ? "text-[var(--hw-cream)]" : "text-[var(--hw-forest)]")}>
        <span className="block font-display text-xl font-semibold tracking-[0.14em]">{first}</span>
        {rest.length > 0 && (
          <span className={cn("block text-[10px] font-semibold uppercase tracking-[0.28em]", light ? "text-[var(--hw-clay)]" : "text-[var(--hw-clay-dark)]")}>
            {rest.join(" ")}
          </span>
        )}
      </span>
    </span>
  );
}
