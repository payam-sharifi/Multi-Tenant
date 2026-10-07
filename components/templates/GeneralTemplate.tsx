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

export default function GeneralTemplate({ data, dict, locale }: TemplateProps) {
  return (
    <BrandScope data={data} className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <SiteHeader
        data={data}
        dict={dict}
        locale={locale}
        links={[
          { href: '#services', label: dict.nav.services },
          { href: '#hours', label: dict.nav.hours },
          { href: '#contact', label: dict.nav.contact },
          { href: '#faq', label: dict.nav.faq },
        ]}
        cta={{ href: '#contact', label: dict.nav.contact }}
      />

      <main id="top">
        <section className="relative flex min-h-[70vh] items-center overflow-hidden">
          {data.hero.bgImage ? (
            <>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: cssImage(data.hero.bgImage) }} />
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[var(--brand-primary)] opacity-20 blur-3xl" />
              <div className="pointer-events-none absolute right-1/4 -bottom-28 h-96 w-96 rounded-full bg-[var(--brand-secondary)] opacity-20 blur-3xl" />
            </>
          )}
          <div className={`relative z-10 mx-auto max-w-4xl px-6 py-24 text-center ${data.hero.bgImage ? 'text-white' : ''}`}>
            <SectionEyebrow>{dict.hero.officialSite}</SectionEyebrow>
            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">{data.hero.title}</h1>
            <p className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed ${data.hero.bgImage ? 'text-white/80' : 'text-gray-600'}`}>
              {data.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#services"
                className="rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white"
              >
                {dict.hero.viewServices}
              </a>
              <a
                href="#contact"
                className={`rounded-full border px-6 py-3 text-sm font-semibold ${
                  data.hero.bgImage ? 'border-white/30' : 'border-gray-300'
                }`}
              >
                {data.hero.ctaText || dict.hero.contactUs}
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
          <div className="mb-10 text-center">
            <SectionEyebrow>{dict.services.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{dict.services.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">{service.title}</h3>
                {service.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{service.description}</p>
                ) : null}
                {service.price ? (
                  <p className="mt-5 text-xl font-extrabold text-[var(--brand-primary)]">{service.price}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-6 py-8 sm:grid-cols-2">
          <HoursBlock
            data={data}
            dict={dict}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          />
          <ContactBlock
            data={data}
            dict={dict}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          />
        </section>

        <FaqList data={data} dict={dict} />
      </main>

      <SiteFooter data={data} dict={dict} />
    </BrandScope>
  );
}
