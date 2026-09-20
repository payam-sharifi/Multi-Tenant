import type { ThemeTokens } from '@/lib/theme';

function unwrap(data: any) {
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    return { ...data, ...data.data };
  }
  return data;
}

export default function HeroSection({ data, theme }: { data: any; theme: ThemeTokens }) {
  const source = unwrap(data);
  const bgImage = source?.image_url || source?.image || source?.cover;
  const title = source?.title || 'به وب‌سایت ما خوش آمدید';
  const subtitle = source?.subtitle || '';

  return (
    <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url('${String(bgImage).replace(/'/g, '%27')}')` }}
          />
          <div className="absolute inset-0 bg-black/55" />
        </>
      ) : (
        <>
          <div className="absolute inset-0" />
          <div
            className={`pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full opacity-30 blur-3xl ${theme.accent}`}
          />
          <div
            className={`pointer-events-none absolute right-1/4 -bottom-28 h-96 w-96 rounded-full opacity-20 blur-3xl ${theme.accent}`}
          />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div
          className={`mb-6 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide ${
            bgImage ? 'border-white/20 bg-white/10 text-white' : theme.badgeBg
          }`}
        >
          وب‌سایت رسمی
        </div>
        <h1
          className={`mb-6 text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl ${
            bgImage ? 'text-white' : theme.textPrimary
          }`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={`mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl ${
              bgImage ? 'text-white/80' : theme.textSecondary
            }`}
          >
            {subtitle}
          </p>
        ) : (
          <div className="mb-10" />
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#services"
            className={`rounded-full px-6 py-3 text-sm font-bold text-white shadow-sm transition ${theme.accent} ${theme.accentHover}`}
          >
            مشاهده خدمات
          </a>
          <a
            href="#contact"
            className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
              bgImage
                ? 'border-white/30 text-white hover:bg-white/10'
                : `${theme.border} ${theme.textPrimary} hover:opacity-80`
            }`}
          >
            تماس با ما
          </a>
        </div>
      </div>
    </section>
  );
}
