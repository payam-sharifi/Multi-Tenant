"use client";

import { BeforeAfter } from "@/templates/handwerk-base/BeforeAfter";
import { Contact } from "@/templates/handwerk-base/Contact";
import { Faq } from "@/templates/handwerk-base/Faq";
import { Financing } from "@/templates/handwerk-base/Financing";
import { Footer } from "@/templates/handwerk-base/Footer";
import { Guarantees } from "@/templates/handwerk-base/Guarantees";
import { Header } from "@/templates/handwerk-base/Header";
import { Hero } from "@/templates/handwerk-base/Hero";
import { Materials } from "@/templates/handwerk-base/Materials";
import { Process } from "@/templates/handwerk-base/Process";
import { Projects } from "@/templates/handwerk-base/Projects";
import { Quality } from "@/templates/handwerk-base/Quality";
import { QuoteModal } from "@/templates/handwerk-base/QuoteModal";
import { Reviews } from "@/templates/handwerk-base/Reviews";
import { Services } from "@/templates/handwerk-base/Services";
import { Team } from "@/templates/handwerk-base/Team";
import { useHandwerk } from "@/templates/handwerk-base/i18n";

export function HandwerkPage() {
  const { t } = useHandwerk();
  const s = t.sections;

  return (
    <>
      <Header />
      <main>
        {s.hero && <Hero />}
        {s.services && <Services />}
        {s.guarantees && <Guarantees />}
        {s.projects && <Projects />}
        {s.reviews && <Reviews />}
        {s.quality && <Quality />}
        {s.team && <Team />}
        {s.beforeAfter && <BeforeAfter />}
        {s.financing && <Financing />}
        {s.process && <Process />}
        {s.faq && <Faq />}
        {s.contact && <Contact />}
        {s.materials && <Materials />}
      </main>
      <Footer />
      <QuoteModal />
    </>
  );
}
