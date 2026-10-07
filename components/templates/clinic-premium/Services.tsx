"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, FlaskConical, Timer, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { resolveIcon } from "@/components/templates/clinic-premium/icons";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { cn } from "@/components/templates/clinic-premium/utils";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

const smooth = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Services() {
  const { t } = useI18n();
  const { open } = useBooking();
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 1024px)").matches;

  const clearTimer = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  // small "hover intent" delay so moving across cards doesn't make the layout flicker
  const hoverCard = (i: number) => {
    if (!canHover()) return;
    clearTimer();
    hoverTimer.current = setTimeout(() => setActive(i), 70);
  };

  return (
    <section id={sectionIds.services} className="section-y scroll-mt-16">
      <div className="container-x">
        <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} subtitle={t.services.subtitle} />

        <div className="mt-14 flex flex-col gap-3 lg:flex-row lg:gap-4" onMouseLeave={clearTimer}>
          {t.services.items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            const isActive = active === i;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, delay: i * 0.07, ease }}
                style={{ flexGrow: isActive ? 3.4 : 1 }}
                onMouseEnter={() => hoverCard(i)}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-3xl border bg-brand-900 p-5 text-white shadow-card",
                  "transition-[flex-grow,border-color,box-shadow] duration-[750ms]",
                  smooth,
                  "lg:h-[460px] lg:basis-0 lg:justify-between lg:p-6",
                  isActive ? "border-brand-900 shadow-soft" : "border-white/10 hover:border-mint/60",
                )}
              >
                {/* photo — always visible; fixed width on desktop so the card simply "reveals" more of it */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-full lg:left-1/2 lg:w-[480px] lg:-translate-x-1/2"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 480px, 100vw"
                      className={cn(
                        "object-cover transition-transform duration-[900ms]",
                        smooth,
                        isActive ? "scale-100" : "scale-110 group-hover:scale-[1.04]",
                      )}
                    />
                  )}
                </div>
                {/* overlays (cross-fade between collapsed / hover / active) */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/50 to-brand-900/25 transition-opacity duration-700",
                    isActive ? "opacity-0" : "opacity-100 group-hover:opacity-70",
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-900/65 to-brand-900/10 transition-opacity duration-700",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />

                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={isActive}
                  aria-label={item.title}
                  className="relative flex w-full items-center gap-4 text-left lg:items-start"
                >
                  <span
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors duration-500",
                      isActive
                        ? "bg-mint text-brand-900"
                        : "bg-white/15 text-white backdrop-blur-sm group-hover:bg-mint group-hover:text-brand-900",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <span className="flex-1 text-xl font-bold tracking-tight lg:hidden">{item.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-white/80 transition-transform duration-500 lg:hidden",
                      isActive && "rotate-180 text-mint",
                    )}
                  />
                </button>

                <div className="relative">
                  {/* vertical title for the collapsed state (desktop) */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute bottom-0 left-0 hidden whitespace-nowrap text-xl font-bold tracking-tight transition-opacity lg:block lg:[writing-mode:vertical-rl] lg:rotate-180",
                      isActive ? "opacity-0 duration-200" : "opacity-100 delay-300 duration-500",
                    )}
                  >
                    {item.title}
                  </span>

                  {/* details — height + opacity are transitioned, never unmounted */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity]",
                      smooth,
                      isActive
                        ? "grid-rows-[1fr] opacity-100 delay-150 duration-[750ms]"
                        : "grid-rows-[0fr] opacity-0 duration-300",
                    )}
                    aria-hidden={!isActive}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-4 lg:min-w-[300px] lg:pt-0">
                        <h3 className="mb-3 hidden text-2xl font-bold tracking-tight lg:block">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-white/80">{item.desc}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
                          <span className="text-sm font-semibold text-mint">{item.price}</span>
                          {item.bookable && (
                            <button
                              type="button"
                              tabIndex={isActive ? 0 : -1}
                              onClick={(e) => {
                                e.stopPropagation();
                                open({ service: i });
                              }}
                              className="group/btn inline-flex items-center gap-2 rounded-full bg-mint py-2 pl-4 pr-2 text-sm font-bold text-brand-900 transition-all hover:bg-[#3AF0AB] hover:shadow-glow"
                            >
                              {t.services.book}
                              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-900 text-mint transition-transform group-hover/btn:rotate-45">
                                <ArrowUpRight className="h-4 w-4" />
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {t.services.express.enabled && <ExpressBanner />}
      </div>
    </section>
  );
}

function ExpressBanner() {
  const { t } = useI18n();
  const { open } = useBooking();
  const e = t.services.express;
  const expressServiceIndex = e.serviceId ? t.services.items.findIndex((s) => s.id === e.serviceId) : -1;
  const rows = [
    { name: e.resultRows[0], value: "14.2", unit: "g/dL", pct: 72 },
    { name: e.resultRows[1], value: "38", unit: "ng/mL", pct: 58 },
    { name: e.resultRows[2], value: "2.1", unit: "mIU/L", pct: 44 },
  ];

  return (
    <Reveal className="relative mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-6 text-white shadow-soft sm:p-10 lg:mt-8 lg:p-14">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-mint/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full border border-white/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 left-[38%] h-52 w-52 rounded-full border border-white/10" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-brand-900">
            <Zap className="h-3.5 w-3.5 fill-brand-900" />
            {e.badge}
          </span>
          <h3 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{e.title}</h3>
          <p className="mt-4 max-w-xl text-white/75">{e.desc}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {e.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.07 }}
                whileHover={{ y: -2, backgroundColor: "rgba(32,226,152,0.25)" }}
                className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium"
              >
                <FlaskConical className="h-3.5 w-3.5 text-mint" />
                {tag}
              </motion.span>
            ))}
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {e.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm font-medium text-white/90">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-brand-900">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <Button className="mt-8" size="lg" onClick={() => open({ service: expressServiceIndex >= 0 ? expressServiceIndex : undefined })}>
            {e.cta}
            <ArrowUpRight className="h-5 w-5" />
          </Button>
        </div>

        {/* results mock card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mx-auto w-full max-w-md rounded-3xl bg-white p-5 text-ink shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <p className="font-bold text-brand-900">{e.resultTitle}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 text-[11px] font-bold text-brand-700">
              <Timer className="h-3.5 w-3.5" />
              {e.resultTime}
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {rows.map((r, i) => (
              <div key={r.name} className="rounded-2xl bg-surface p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-brand-900">{r.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-mint-dark">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    {e.resultNorm}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-brand-900">{r.value}</span>
                  <span className="text-xs text-muted">{r.unit}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-900/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease }}
                    className="h-full rounded-full bg-gradient-to-r from-mint-dark to-mint"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Reveal>
  );
}
