import { AppointmentForm } from '@/components/templates/forms';
import {
  BrandScope,
  ContactBlock,
  FaqList,
  HoursBlock,
  SiteFooter,
  SiteHeader,
  cssImage,
  type TemplateProps,
} from '@/components/templates/shared';

export default function SalonTemplate({ data, dict, locale }: TemplateProps) {
  const booking = data.booking.enabled;

  return (
    <BrandScope data={data} className="min-h-screen bg-stone-950 text-stone-100 antialiased">
      <SiteHeader
        data={data}
        dict={dict}
        locale={locale}
        inverted
        links={[
          { href: '#services', label: dict.nav.services },
          { href: '#gallery', label: dict.nav.gallery },
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
        <section className="relative flex min-h-[78vh] items-center overflow-hidden pt-24 pb-16">
          {data.hero.bgImage ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: cssImage(data.hero.bgImage) }} />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--brand-primary)_35%,transparent),transparent_55%)]" />
          )}
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <div className="mb-6 inline-flex rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--brand-primary)]">
              {dict.hero.officialSite}
            </div>
            <h1 className="font-display text-6xl font-semibold tracking-tight sm:text-7xl">{data.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">{data.hero.subtitle}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={booking ? '#booking' : '#contact'}
                className="rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-black"
              >
                {data.hero.ctaText}
              </a>
              <a href="#services" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold">
                {dict.hero.viewServices}
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-primary)]">
            {dict.services.eyebrow}
          </p>
          <h2 className="mt-3 text-center font-display text-4xl">{dict.services.title}</h2>
          <div className="mt-10 divide-y divide-stone-800 border-y border-stone-800">
            {data.services.map((service) => (
              <article key={service.title} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  {service.description ? (
                    <p className="mt-1 text-sm text-stone-400">{service.description}</p>
                  ) : null}
                </div>
                <div className="text-right font-display text-2xl text-[var(--brand-primary)]">
                  {service.price}
                  {service.duration ? (
                    <div className="text-xs font-sans text-stone-500">{service.duration}</div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="bg-black/40 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-4xl">{dict.templates.gallery}</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {data.gallery.map((item, index) => (
                <figure
                  key={`${item.title}-${index}`}
                  className="relative min-h-40 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full min-h-40 items-end p-4"
                      style={{
                        background: `linear-gradient(160deg, color-mix(in srgb, var(--brand-primary) ${18 + (index % 4) * 8}%, #1c1917), #0c0a09)`,
                      }}
                    >
                      <figcaption className="text-sm font-semibold">{item.title}</figcaption>
                    </div>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`mx-auto grid max-w-6xl gap-6 px-6 py-16 ${
            booking ? 'lg:grid-cols-[0.95fr_1.05fr]' : 'sm:grid-cols-2'
          }`}
        >
          <div className={booking ? 'space-y-5' : undefined}>
            <HoursBlock
              data={data}
              dict={dict}
              className="rounded-2xl border border-stone-800 bg-stone-900 p-8"
            />
            {booking ? (
              <ContactBlock
                data={data}
                dict={dict}
                className="rounded-2xl border border-stone-800 bg-stone-900 p-8"
              />
            ) : null}
          </div>
          {booking ? (
            <div id="booking" className="scroll-mt-24 [&_form]:bg-stone-900 [&_form]:border-stone-800 [&_form]:text-stone-100 [&_input]:bg-stone-950 [&_input]:border-stone-700 [&_input]:text-stone-100 [&_textarea]:bg-stone-950 [&_textarea]:border-stone-700 [&_textarea]:text-stone-100">
              <AppointmentForm dict={dict} booking={data.booking} />
            </div>
          ) : (
            <ContactBlock
              data={data}
              dict={dict}
              className="rounded-2xl border border-stone-800 bg-stone-900 p-8"
            />
          )}
        </section>

        <div className="[&_details]:border-stone-800 [&_details]:bg-stone-900">
          <FaqList data={data} dict={dict} />
        </div>
      </main>

      <SiteFooter data={data} dict={dict} inverted />
    </BrandScope>
  );
}
