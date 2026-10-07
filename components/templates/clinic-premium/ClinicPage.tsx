"use client";

import { About } from "@/components/templates/clinic-premium/About";
import { BookingModal } from "@/components/templates/clinic-premium/BookingModal";
import { Checkup } from "@/components/templates/clinic-premium/Checkup";
import { Doctors } from "@/components/templates/clinic-premium/Doctors";
import { Faq } from "@/components/templates/clinic-premium/Faq";
import { Footer } from "@/components/templates/clinic-premium/Footer";
import { Header } from "@/components/templates/clinic-premium/Header";
import { Hero } from "@/components/templates/clinic-premium/Hero";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { Locations } from "@/components/templates/clinic-premium/Locations";
import { Services } from "@/components/templates/clinic-premium/Services";

/** Renders only the sections that exist in the site JSON and have enough content to look right. */
export function ClinicPage() {
  const { t } = useI18n();
  const s = t.sections;

  return (
    <>
      <Header />
      <main>
        {s.hero && <Hero />}
        {s.services && <Services />}
        {s.checkup && <Checkup />}
        {s.about && <About />}
        {s.doctors && <Doctors />}
        {s.locations && <Locations />}
        {s.faq && <Faq />}
      </main>
      <Footer />
      <BookingModal />
    </>
  );
}
