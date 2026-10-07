import { QuoteRequestForm } from '@/components/templates/forms';
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

export default function ServicesTemplate({ data, dict, locale }: TemplateProps) {
  const booking = data.booking.enabled;

  return (
    <BrandScope data={data} className="min-h-screen bg-slate-100 text-slate-900 antialiased">
      <SiteHeader
        data={data}
        dict={dict}
        locale={locale}
        links={[
          { href: '#services', label: dict.nav.services },
          { href: '#projects', label: dict.nav.projects },
          ...(booking ? [{ href: '#quote', label: dict.nav.quote }] : []),
          { href: '#contact', label: dict.nav.contact },
        ]}
        cta={
          booking
            ? { href: '#quote', label: dict.templates.quote }
            : { href: '#contact', label: dict.nav.contact }
        }
      />

      <main id="top">
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: cssImage(data.hero.bgImage) }}
          />
          <div className="relative mx-auto max-w-6xl px-6 py-20">
            <SectionEyebrow>{dict.hero.officialSite}</SectionEyebrow>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">{data.hero.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">{data.hero.subtitle}</p>
            <a
              href={booking ? '#quote' : '#contact'}
              className="mt-8 inline-flex rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white"
            >
              {data.hero.ctaText}
            </a>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
          <SectionEyebrow>{dict.services.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-black">{dict.services.title}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {data.services.map((service, index) => (
              <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-xs font-bold tracking-widest text-[var(--brand-primary)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-xl font-bold">{service.title}</h3>
                {service.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                ) : null}
                <p className="mt-5 font-extrabold text-[var(--brand-primary)]">{service.price}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-black">{dict.templates.projects}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((project, index) => (
                <figure key={`${project.title}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image} alt={project.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="flex h-48 items-end bg-[color:color-mix(in_srgb,var(--brand-primary)_18%,#e2e8f0)] p-4">
                      <span className="text-sm font-semibold">{project.title}</span>
                    </div>
                  )}
                  <figcaption className="p-4">
                    <p className="font-bold">{project.title}</p>
                    {project.description ? (
                      <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`mx-auto grid max-w-6xl gap-6 px-6 py-16 ${
            booking ? 'lg:grid-cols-[1fr_1.1fr]' : 'sm:grid-cols-2'
          }`}
        >
          <div className={booking ? 'space-y-5' : undefined}>
            <HoursBlock
              data={data}
              dict={dict}
              className="rounded-2xl border border-slate-200 bg-white p-8"
            />
            {booking ? (
              <ContactBlock
                data={data}
                dict={dict}
                className="rounded-2xl border border-slate-200 bg-white p-8"
              />
            ) : null}
          </div>
          {booking ? (
            <div id="quote" className="scroll-mt-24">
              <QuoteRequestForm dict={dict} booking={data.booking} />
            </div>
          ) : (
            <ContactBlock
              data={data}
              dict={dict}
              className="rounded-2xl border border-slate-200 bg-white p-8"
            />
          )}
        </section>

        <FaqList data={data} dict={dict} />
      </main>

      <SiteFooter data={data} dict={dict} />
    </BrandScope>
  );
}
