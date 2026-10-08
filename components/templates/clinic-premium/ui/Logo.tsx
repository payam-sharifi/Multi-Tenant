"use client";

import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const { brandName } = useI18n();
  const [first, ...rest] = brandName.split(" ");
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand-900 shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z" fill="#20E298" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-mint" />
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-brand-900")}>
        {first}
        {rest.length > 0 && <span className="ml-1 font-medium text-mint-dark">{rest.join(" ")}</span>}
      </span>
    </span>
  );
}
