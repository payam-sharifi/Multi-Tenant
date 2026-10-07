import { ReservationForm } from '@/components/templates/forms';
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

export default function RestaurantTemplate({ data, dict, locale }: TemplateProps) {
  const highlights = data.menu.flatMap((category) => category.items).slice(0, 3);
  const booking = data.booking.enabled;

  return (
    <BrandScope data={data} className="min-h-screen bg-[#f7f0e6] text-[#3f1f16] antialiased">
      <SiteHeader
        data={data}
        dict={dict}
        locale={locale}
        links={[
          { href: '#menu', label: dict.nav.menu },
          { href: '#hours', label: dict.nav.hours },
          ...(booking ? [{ href: '#reserve', label: dict.nav.reserve }] : []),
          { href: '#contact', label: dict.nav.contact },
        ]}
        cta={
          booking
            ? { href: '#reserve', label: dict.templates.reserve }
            : { href: '#contact', label: dict.nav.contact }
        }
      />

      <main id="top">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: cssImage(data.hero.bgImage) }}
          />
          <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
            <SectionEyebrow>{dict.hero.officialSite}</SectionEyebrow>
            <h1 className="mt-4 font-display text-6xl font-semibold sm:text-7xl">{data.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6b4336]">{data.hero.subtitle}</p>
            <a
              href={booking ? '#reserve' : '#contact'}
              className="mt-8 inline-flex rounded-none bg-[var(--brand-primary)] px-8 py-3 text-sm font-bold tracking-wide text-white uppercase"
            >
              {data.hero.ctaText}
            </a>
          </div>
        </section>

        <section className="border-y border-[#e4d3bf] bg-[#fffaf3] py-14">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.name} className="border border-[#e4d3bf] bg-[#f7f0e6] p-6">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--brand-secondary)]">
                  {dict.templates.highlights}
                </p>
                <h3 className="mt-3 font-display text-2xl">{item.name}</h3>
                <p className="mt-2 text-sm text-[#6b4336]">{item.description}</p>
                <p className="mt-4 font-bold">{item.price}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="menu" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-16">
          <div className="text-center">
            <SectionEyebrow>{dict.templates.menu}</SectionEyebrow>
            <h2 className="mt-3 font-display text-4xl">{dict.templates.menu}</h2>
          </div>
          <div className="mt-12 space-y-12">
            {data.menu.map((category) => (
              <div key={category.category}>
                <h3 className="border-b border-[#e4d3bf] pb-2 font-display text-2xl">{category.category}</h3>
                <ul className="mt-4 space-y-4">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-6">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.description ? (
                          <p className="text-sm text-[#6b4336]">{item.description}</p>
                        ) : null}
                      </div>
                      <span className="shrink-0 font-bold">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#3f1f16] py-16 text-[#f7f0e6]">
          <div className={`mx-auto grid max-w-6xl gap-8 px-6 ${booking ? 'lg:grid-cols-2' : ''}`}>
            <div>
              <HoursBlock data={data} dict={dict} className="[&_h2]:font-display [&_h2]:text-[#f7f0e6]" />
              <ContactBlock data={data} dict={dict} className="mt-10 [&_h2]:font-display" />
            </div>
            {booking ? (
              <div id="reserve" className="scroll-mt-24 [&_form]:rounded-none [&_form]:bg-[#fffaf3] [&_form]:text-[#3f1f16]">
                <ReservationForm dict={dict} booking={data.booking} />
              </div>
            ) : null}
          </div>
        </section>

        <FaqList data={data} dict={dict} />
      </main>

      <SiteFooter data={data} dict={dict} />
    </BrandScope>
  );
}
