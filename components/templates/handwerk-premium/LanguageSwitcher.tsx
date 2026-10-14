"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LANGS } from "@/components/templates/handwerk-premium/content";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";
import { cn } from "@/components/templates/handwerk-premium/utils";

function hrefFor(pathname: string, target: "de" | "en") {
  const rest = pathname.replace(/^\/(de|en)(?=\/|$)/, "");
  if (target === "de") return rest || "/";
  return `/en${rest}`;
}

export function LanguageSwitcher({ className, id = "desk" }: { className?: string; id?: string }) {
  const { lang, t } = useHandwerk();
  const pathname = usePathname() || "/";
  return (
    <div
      role="group"
      aria-label={t.header.language}
      className={cn("relative flex items-center rounded-full bg-white/10 p-1", className)}
    >
      {LANGS.map((item) => {
        const active = item.code === lang;
        return (
          <a
            key={item.code}
            href={hrefFor(pathname, item.code)}
            hrefLang={item.htmlLang}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-colors",
              active ? "text-[var(--hw-forest)]" : "text-white/70 hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId={`hw-lang-${id}`}
                className="absolute inset-0 -z-10 rounded-full bg-[var(--hw-cream)] shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            {item.label}
          </a>
        );
      })}
    </div>
  );
}
