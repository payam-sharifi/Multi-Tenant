"use client";

import Image from "next/image";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";

export function Team() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.team} className="hw-section scroll-mt-24 bg-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.team.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.team.title}</h2>
        {t.team.subtitle && <p className="mt-4 max-w-3xl text-[var(--hw-stone)]">{t.team.subtitle}</p>}
        {t.team.mission && <p className="mt-3 max-w-3xl text-[var(--hw-forest)]">{t.team.mission}</p>}
        {t.team.note && <p className="mt-2 text-sm text-[var(--hw-clay-dark)]">{t.team.note}</p>}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {t.team.items.map((member) => (
            <article key={member.id} className="text-center">
              <div className="relative mx-auto aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--hw-sand)]">
                {member.image ? (
                  <Image src={member.image} alt="" fill sizes="160px" className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center font-display text-3xl text-[var(--hw-forest)]">
                    {member.name.split(" ").map((part) => part[0]).join("")}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[var(--hw-forest)]">{member.name}</h3>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--hw-stone)]">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
