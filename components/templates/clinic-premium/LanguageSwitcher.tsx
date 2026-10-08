"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LANGS } from "@/components/templates/clinic-premium/content";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";

/**
 * Locale is part of the URL in Multi-Tenant (de = no prefix, en = "/en"), so these are plain links.
 * The current path is kept, which also works in localhost path mode ("/en/<subdomain>").
 */
function hrefFor(pathname: string, target: "de" | "en") {
  const rest = pathname.replace(/^\/(de|en)(?=\/|$)/, "");
  if (target === "de") return rest || "/";
  return `/en${rest}`;
}

export function LanguageSwitcher({ className, id = "desk" }: { className?: string; id?: string }) {
  const { lang, t } = useI18n();
  const pathname = usePathname() || "/";
  return (
    <div
      role="group"
      aria-label={t.header.language}
      className={cn("relative flex items-center rounded-full bg-brand-900/5 p-1", className)}
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <a
            key={l.code}
            href={hrefFor(pathname, l.code)}
            hrefLang={l.htmlLang}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-colors",
              active ? "text-brand-900" : "text-muted hover:text-brand-900",
            )}
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${id}`}
                className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            {l.label}
          </a>
        );
      })}
    </div>
  );
}
