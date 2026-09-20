import { supabase } from '@/lib/supabase';
import { resolveThemeId, type ThemeTokens } from '@/lib/theme';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import WorkingHoursSection from '@/components/WorkingHoursSection';
import FAQSection from '@/components/FAQSection';
import ContactCard from '@/components/ContactCard';

const THEME_STYLES: Record<string, ThemeTokens> = {
  clinical: {
    bg: 'bg-slate-50',
    cardBg: 'bg-white',
    border: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    accentText: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  luxury: {
    bg: 'bg-stone-950',
    cardBg: 'bg-stone-900',
    border: 'border-stone-800',
    textPrimary: 'text-stone-100',
    textSecondary: 'text-stone-400',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  zen: {
    bg: 'bg-slate-950',
    cardBg: 'bg-slate-900/80',
    border: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accent: 'bg-teal-500',
    accentHover: 'hover:bg-teal-400',
    accentText: 'text-teal-400',
    badgeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  },
  default: {
    bg: 'bg-gray-50',
    cardBg: 'bg-white',
    border: 'border-gray-200',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'bg-indigo-600',
    accentHover: 'hover:bg-indigo-700',
    accentText: 'text-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
};

type SectionComponent = React.FC<{ data: any; theme: ThemeTokens }>;

const COMPONENT_MAP: Record<string, SectionComponent> = {
  hero: HeroSection,
  services: ServicesSection,
  working_hours: WorkingHoursSection,
  faq: FAQSection,
};

async function getWebsiteData(subdomain: string) {
  const { data, error } = await supabase
    .from('websites')
    .select('site_data, subdomain')
    .eq('subdomain', subdomain)
    .single();

  if (error || !data) return null;
  return data.site_data;
}

export default async function DynamicWebsitePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const resolvedParams = await params;
  const subdomain = resolvedParams.subdomain;
  const siteData = await getWebsiteData(subdomain);

  const fallbackTheme = THEME_STYLES.default;

  if (!siteData) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${fallbackTheme.bg} ${fallbackTheme.textPrimary}`} dir="rtl">
        <div className={`max-w-md rounded-3xl border p-8 text-center shadow-sm ${fallbackTheme.cardBg} ${fallbackTheme.border}`}>
          <h1 className="mb-3 text-3xl font-extrabold">۴۰۴ - سایت یافت نشد</h1>
          <p className={fallbackTheme.textSecondary}>این آدرس به هیچ وب‌سایتی متصل نیست.</p>
        </div>
      </div>
    );
  }

  const hasDynamicSections = Array.isArray(siteData.sections) && siteData.sections.length > 0;
  const theme = THEME_STYLES[resolveThemeId(siteData)] ?? THEME_STYLES.default;
  const sections = hasDynamicSections ? siteData.sections : [];
  const heroSection = sections.find((section: { type?: string }) => section?.type === 'hero');
  const servicesSection = sections.find((section: { type?: string }) => section?.type === 'services');
  const hoursSection = sections.find((section: { type?: string }) => section?.type === 'working_hours');
  const faqSection = sections.find((section: { type?: string }) => section?.type === 'faq');
  const extraSections = sections.filter(
    (section: { type?: string }) =>
      section?.type && !['hero', 'services', 'working_hours', 'faq'].includes(section.type)
  );

  const heroData =
    heroSection ||
    siteData.hero || {
      title: siteData.business_name,
      image_url: siteData.cover_image || siteData.image_url,
    };
  const servicesData = servicesSection || siteData.services;
  const hoursData = hoursSection || siteData.working_hours;
  const businessName = siteData.business_name || 'وب‌سایت رسمی';

  return (
    <div className={`min-h-screen font-sans antialiased ${theme.bg} ${theme.textPrimary}`} dir="rtl">
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${theme.cardBg} ${theme.border}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <a href="#top" className="text-lg font-black tracking-tight sm:text-xl">
            {businessName}
          </a>
          <nav className={`hidden items-center gap-6 text-sm font-medium md:flex ${theme.textSecondary}`}>
            <a href="#services" className="transition hover:opacity-80">
              خدمات
            </a>
            <a href="#hours" className="transition hover:opacity-80">
              ساعات کاری
            </a>
            <a href="#faq" className="transition hover:opacity-80">
              سوالات
            </a>
          </nav>
          <a
            href="#contact"
            className={`rounded-full px-4 py-2 text-sm font-bold text-white transition ${theme.accent} ${theme.accentHover}`}
          >
            تماس
          </a>
        </div>
      </header>

      <main id="top">
        <HeroSection data={heroData} theme={theme} />
        {servicesData && <ServicesSection data={servicesData} theme={theme} />}

        {extraSections.map((section: { type: string }, index: number) => {
          const Component = COMPONENT_MAP[section.type];
          return Component ? <Component key={`${section.type}-${index}`} data={section} theme={theme} /> : null;
        })}

        {(hoursData || siteData.owner_name || siteData.business_name) && (
          <section className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
              {hoursData && <WorkingHoursSection data={hoursData} theme={theme} />}
              <ContactCard siteData={siteData} theme={theme} />
            </div>
          </section>
        )}

        {faqSection && <FAQSection data={faqSection} theme={theme} />}
      </main>

      <footer className={`border-t px-6 py-8 text-sm ${theme.border} ${theme.textSecondary}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {businessName}
          </p>
          <p>طراحی‌شده برای کسب‌وکار شما</p>
        </div>
      </footer>
    </div>
  );
}
