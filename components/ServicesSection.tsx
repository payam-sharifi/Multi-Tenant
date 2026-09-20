import type { ThemeTokens } from '@/lib/theme';
import { iconClass, surfaceClass } from '@/lib/theme';
import SectionHeader from '@/components/SectionHeader';

function getServices(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
}

function ServiceIcon({ name }: { name?: string }) {
  const key = String(name || '').toLowerCase();
  const common = 'h-6 w-6';

  if (/ماساژ|massage|spa|ریلکس/.test(key)) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 18c2-6 6-9 8-9s6 3 8 9" strokeLinecap="round" />
        <circle cx="12" cy="7" r="2.2" />
      </svg>
    );
  }
  if (/سنگ|stone|hot/.test(key)) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 16c1.5-4 4-7 8-7s6.5 3 8 7-3.5 4-8 4-9.5 0-8-4Z" />
      </svg>
    );
  }
  if (/مو|hair|رنگ|کات/.test(key)) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M8 20c0-6 2-10 4-12 2 2 4 6 4 12" strokeLinecap="round" />
        <path d="M7 9c2-3 8-3 10 0" strokeLinecap="round" />
      </svg>
    );
  }
  if (/پزشک|ویزیت|clinic|consult|درمان/.test(key)) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4.5 13.8 9l4.7.4-3.6 3.2 1.1 4.6L12 15.4 7.99 17.2l1.1-4.6L5.5 9.4 10.2 9 12 4.5Z" />
    </svg>
  );
}

export default function ServicesSection({ data, theme }: { data: any; theme: ThemeTokens }) {
  const services = getServices(data);
  if (!services.length) return null;
  const title = data?.title || data?.data?.title || 'خدمات ما';

  return (
    <section id="services" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
      <SectionHeader eyebrow="خدمات" title={title} theme={theme} />
      <div
        className={
          services.length === 1
            ? 'mx-auto grid max-w-md grid-cols-1'
            : 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'
        }
      >
        {services.map((service: any, index: number) => {
          const name = service?.name;
          const price = service?.price;
          if (!name && !price) return null;

          return (
            <article key={index} className={surfaceClass(theme, 'p-7')}>
              <div className={`mb-5 ${iconClass(theme)}`}>
                <ServiceIcon name={name} />
              </div>
              {name && <h3 className={`mb-2 text-xl font-bold ${theme.textPrimary}`}>{name}</h3>}
              {service.description && (
                <p className={`mb-5 text-sm leading-relaxed ${theme.textSecondary}`}>{service.description}</p>
              )}
              {price && (
                <div className={`text-xl font-extrabold ${theme.accentText}`}>
                  <span dir="ltr" className="inline-block">
                    {price}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
