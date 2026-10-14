"use client";

import { BeforeAfter } from "@/components/templates/handwerk-premium/BeforeAfter";
import { Contact } from "@/components/templates/handwerk-premium/Contact";
import { Faq } from "@/components/templates/handwerk-premium/Faq";
import { Financing } from "@/components/templates/handwerk-premium/Financing";
import { Footer } from "@/components/templates/handwerk-premium/Footer";
import { Guarantees } from "@/components/templates/handwerk-premium/Guarantees";
import { Header } from "@/components/templates/handwerk-premium/Header";
import { Hero } from "@/components/templates/handwerk-premium/Hero";
import { Materials } from "@/components/templates/handwerk-premium/Materials";
import { Process } from "@/components/templates/handwerk-premium/Process";
import { Projects } from "@/components/templates/handwerk-premium/Projects";
import { Quality } from "@/components/templates/handwerk-premium/Quality";
import { QuoteModal } from "@/components/templates/handwerk-premium/QuoteModal";
import { Reviews } from "@/components/templates/handwerk-premium/Reviews";
import { Services } from "@/components/templates/handwerk-premium/Services";
import { Team } from "@/components/templates/handwerk-premium/Team";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";

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
