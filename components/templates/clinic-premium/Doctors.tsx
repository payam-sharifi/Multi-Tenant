"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { useBooking } from "@/components/templates/clinic-premium/booking";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Doctors() {
  const { t } = useI18n();
  const { open } = useBooking();
  const doctors = t.doctors.items;

  return (
    <section id={sectionIds.doctors} className="section-y scroll-mt-16 bg-surface">
      <div className="container-x">
        <SectionHeading eyebrow={t.doctors.eyebrow} title={t.doctors.title} subtitle={t.doctors.subtitle} />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {doctors.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 0.08}>
              <motion.button
                type="button"
                initial="rest"
                whileHover="hover"
                whileFocus="hover"
                animate="rest"
                onClick={() => open({ doctor: d.id, service: d.serviceIndex })}
                aria-label={`${t.doctors.book}: ${d.name}${d.spec ? `, ${d.spec}` : ""}`}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-brand-800 text-left shadow-card"
              >
                <motion.div
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Avatar
                    src={d.image}
                    name={d.name}
                    sizes="(min-width: 1024px) 380px, 50vw"
                    imageClassName="object-top"
                    className="text-6xl"
                  />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent transition-opacity duration-500 group-hover:from-brand-950" />

                {/* rating */}
                {d.rating !== undefined && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold text-brand-900 shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:text-sm">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {d.rating.toFixed(1)}
                  </span>
                )}

                {/* arrow */}
                <motion.span
                  variants={{
                    rest: { opacity: 0, scale: 0.6, rotate: -45 },
                    hover: { opacity: 1, scale: 1, rotate: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-mint text-brand-900 shadow-glow sm:right-4 sm:top-4 sm:h-12 sm:w-12"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </motion.span>

                {/* info */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  {d.spec && (
                    <span className="inline-block rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-bold text-brand-900 sm:text-xs">
                      {d.spec}
                    </span>
                  )}
                  <h3 className="mt-2 text-base font-bold leading-tight sm:text-xl">{d.name}</h3>
                  <motion.div
                    variants={{
                      rest: { height: 0, opacity: 0 },
                      hover: { height: "auto", opacity: 1 },
                    }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-1.5 text-xs text-white/75 sm:text-sm">
                      {d.years !== undefined ? `${d.years} ${t.doctors.experience} · ` : ""}
                      {t.doctors.book} →
                    </p>
                  </motion.div>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
