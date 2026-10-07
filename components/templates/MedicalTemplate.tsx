import { AppointmentForm } from '@/components/templates/forms';
import {
  BrandScope,
  ContactBlock,
  FaqList,
  HoursBlock,
  SectionEyebrow,
  SiteFooter,
  SiteHeader,
  cssImage,
  type TemplateProps,
} from '@/components/templates/shared';

export default function MedicalTemplate({ data, dict, locale }: TemplateProps) {
  const booking = data.booking.enabled;

  return (
    <BrandScope data={data} className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <SiteHeader
        data={data}
        dict={dict}
        locale={locale}
        links={[
          { href: '#about', label: dict.nav.about },
          { href: '#services', label: dict.nav.services },
          ...(booking ? [{ href: '#booking', label: dict.nav.book }] : []),
          { href: '#contact', label: dict.nav.contact },
        ]}
        cta={
          booking
            ? { href: '#booking', label: dict.templates.book }
            : { href: '#contact', label: dict.nav.contact }
        }
      />

      <main id="top">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-30"
            style={{ backgroundImage: cssImage(data.hero.bgImage) }}
          />
          <div
            className={`relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:py-20 ${
              booking ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''
            }`}
          >
            <div>
              <SectionEyebrow>{dict.hero.officialSite}</SectionEyebrow>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                {data.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{data.hero.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={booking ? '#booking' : '#contact'}
                  className="rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white"
                >
                  {data.hero.ctaText}
                </a>
                <a href="#services" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold">
                  {dict.hero.viewServices}
                </a>
              </div>
            </div>
            {booking ? (
              <div id="booking" className="scroll-mt-24">
                <AppointmentForm dict={dict} booking={data.booking} />
              </div>
            ) : null}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
          <SectionEyebrow>{dict.templates.bio}</SectionEyebrow>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="font-display text-4xl font-semibold">{data.owner || data.branding.name}</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">{data.about}</p>
          </div>
        </section>

        <section id="services" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <SectionEyebrow>{dict.services.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-black tracking-tight">{dict.services.title}</h2>
            <div className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
              {data.services.map((service) => (
                <article key={service.title} className="grid gap-3 bg-white px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold">{service.title}</h3>
                    {service.description ? (
                      <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                    ) : null}
                  </div>
                  {service.duration ? (
                    <span className="text-sm font-medium text-slate-500">{service.duration}</span>
                  ) : (
                    <span />
                  )}
                  <span className="font-extrabold text-[var(--brand-primary)]">{service.price}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-6 py-16 sm:grid-cols-2">
          <HoursBlock
            data={data}
            dict={dict}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          />
          <ContactBlock
            data={data}
            dict={dict}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          />
        </section>

        <FaqList data={data} dict={dict} />
      </main>

      <SiteFooter data={data} dict={dict} />
    </BrandScope>
  );
}
