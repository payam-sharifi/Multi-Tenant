import { Hero } from '@/templates/haustechnik-base/Hero';
import { InquiryForm } from '@/templates/haustechnik-base/InquiryForm';
import { Services } from '@/templates/haustechnik-base/Services';
import { Trust } from '@/templates/haustechnik-base/Trust';
import { Header } from '@/templates/haustechnik-base/Header';
import { Footer } from '@/templates/haustechnik-base/Footer';

export function HaustechnikPage() {
  return (
    <div data-template="haustechnik-base" id="top" className="flex min-h-screen flex-col bg-white">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--mh-navy)]"
      >
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt" className="flex-1">
        <Hero />
        <Services />
        <Trust />
        <InquiryForm />
      </main>
      <Footer />
    </div>
  );
}
