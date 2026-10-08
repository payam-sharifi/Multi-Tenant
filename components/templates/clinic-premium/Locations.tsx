"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { useI18n, type ClinicBranchView } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Locations() {
  const { t, brandName } = useI18n();
  const { open } = useBooking();
  const branches = t.locations.items;
  const [activeId, setActiveId] = useState(branches[0]?.id ?? "");
  const active = branches.find((b) => b.id === activeId) ?? branches[0];
  if (!active) return null;

  return (
    <section id={sectionIds.locations} className="section-y scroll-mt-16">
      <div className="container-x">
        <SectionHeading eyebrow={t.locations.eyebrow} title={t.locations.title} subtitle={t.locations.subtitle} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* branch list */}
          <Reveal className="min-w-0">
            <div
              role="tablist"
              aria-orientation="vertical"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {branches.map((b) => {
                const isActive = b.id === activeId;
                return (
                  <button
                    key={b.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveId(b.id)}
                    className={cn(
                      "relative flex min-w-[220px] items-center gap-4 rounded-2xl border p-4 text-left transition-colors lg:min-w-0",
                      isActive
                        ? "border-transparent text-white"
                        : "border-brand-900/10 bg-white hover:border-mint hover:bg-sage-soft",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="branch-active"
                        className="absolute inset-0 -z-0 rounded-2xl bg-brand-900 shadow-soft"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors",
                        isActive ? "bg-mint text-brand-900" : "bg-mint-soft text-brand-700",
                      )}
                    >
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="relative min-w-0">
                      <span className={cn("block font-bold", !isActive && "text-brand-900")}>{b.name}</span>
                      <span className={cn("block truncate text-xs", isActive ? "text-white/70" : "text-muted")}>
                        {b.address}
                      </span>
                    </span>
                  </button>
                );
              })}
              {t.locations.more && <p className="hidden px-2 pt-2 text-xs text-muted lg:block">{t.locations.more}</p>}
            </div>
          </Reveal>

          {/* map + detail */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-900/10 bg-white shadow-card">
              <MapArt branches={branches} activeId={active.id} onSelect={setActiveId} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease }}
                  className="relative border-t border-brand-900/10 bg-white p-6 sm:p-8"
                >
                  {active.image && (
                    <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/6] overflow-hidden bg-sage sm:-mx-8 sm:-mt-8 sm:mb-8">
                      <Image
                        src={active.image}
                        alt={active.name}
                        fill
                        sizes="(min-width: 1024px) 700px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      {t.locations.open && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-brand-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-mint-dark" />
                          {t.locations.open}
                        </span>
                      )}
                      <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-900">
                        {brandName.split(" ")[0]} · {active.name}
                      </h3>
                    </div>
                  </div>

                  <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    {active.address && (
                      <li className="flex items-start gap-3 text-ink/80">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mint-dark" />
                        {active.address}
                      </li>
                    )}
                    {active.hours && (
                      <li className="flex items-start gap-3 text-ink/80">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mint-dark" />
                        {active.hours}
                      </li>
                    )}
                    {active.phone && (
                      <li className="flex items-start gap-3 text-ink/80">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mint-dark" />
                        <a href={active.phoneHref} className="font-semibold hover:text-mint-dark">
                          {active.phone}
                        </a>
                      </li>
                    )}
                  </ul>

                  {active.services.some((si) => t.services.items[si]) && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.locations.offers}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {active.services.filter((si) => t.services.items[si]).map((si) => (
                        <span
                          key={si}
                          className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-700"
                        >
                          {t.services.items[si]?.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button onClick={() => open()}>{t.locations.book}</Button>
                    <Button
                      variant="outline"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        brandName + " " + active.address,
                      )}`}
                      aria-label={`${t.locations.directions}: ${active.name}`}
                    >
                      <Navigation className="h-4 w-4" />
                      {t.locations.directions}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Stylised, dependency-free city map with interactive pins. */
function MapArt({
  branches,
  activeId,
  onSelect,
}: {
  branches: ClinicBranchView[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative h-[260px] w-full overflow-hidden bg-[#E8F1ED] sm:h-[320px]">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* river */}
        <path
          d="M62 -5 C 58 20, 64 35, 60 50 S 56 80, 62 105"
          fill="none"
          stroke="#BFE3F2"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* parks */}
        <rect x="8" y="10" width="16" height="14" rx="3" fill="#CFE9D6" />
        <rect x="70" y="72" width="20" height="16" rx="3" fill="#CFE9D6" />
        <rect x="14" y="68" width="14" height="12" rx="3" fill="#CFE9D6" />
        {/* main roads */}
        <g stroke="#fff" strokeLinecap="round" fill="none">
          <path d="M0 40 L100 48" strokeWidth="2.2" />
          <path d="M0 72 L100 62" strokeWidth="1.6" />
          <path d="M30 0 L38 100" strokeWidth="1.8" />
          <path d="M50 0 L46 100" strokeWidth="2.2" />
          <path d="M82 0 L74 100" strokeWidth="1.4" />
          <path d="M0 18 L100 24" strokeWidth="1.2" />
          <path d="M0 90 L100 84" strokeWidth="1.2" />
        </g>
      </svg>

      {branches.map((b) => {
        const isActive = b.id === activeId;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b.id)}
            aria-label={b.name}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${b.x}%`, top: `${b.y}%`, zIndex: isActive ? 20 : 10 }}
          >
            {isActive && (
              <span className="absolute left-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-ping2 rounded-full bg-mint/60" />
            )}
            <motion.span
              animate={{ scale: isActive ? 1.25 : 1, y: isActive ? -4 : 0 }}
              whileHover={{ scale: 1.25 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="relative flex flex-col items-center"
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-2 border-white shadow-lg transition-colors",
                  isActive ? "bg-brand-900 text-mint" : "bg-white text-brand-900",
                )}
              >
                <MapPin className="h-4 w-4" />
              </span>
              <span className={cn("-mt-1 h-2 w-2 rotate-45 transition-colors", isActive ? "bg-brand-900" : "bg-white")} />
            </motion.span>
            {isActive && (
              <span className="absolute left-full top-1 ml-2.5 whitespace-nowrap rounded-full bg-brand-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                {b.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
