"use client";

import { About } from "@/templates/clinic-base/About";
import { BookingModal } from "@/templates/clinic-base/BookingModal";
import { Checkup } from "@/templates/clinic-base/Checkup";
import { Doctors } from "@/templates/clinic-base/Doctors";
import { Faq } from "@/templates/clinic-base/Faq";
import { Footer } from "@/templates/clinic-base/Footer";
import { Header } from "@/templates/clinic-base/Header";
import { Hero } from "@/templates/clinic-base/Hero";
import { useI18n } from "@/templates/clinic-base/i18n";
import { Locations } from "@/templates/clinic-base/Locations";
import { Services } from "@/templates/clinic-base/Services";

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
