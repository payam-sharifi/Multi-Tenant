import type { ThemeTokens } from '@/lib/theme';
import { surfaceClass } from '@/lib/theme';
import SectionHeader from '@/components/SectionHeader';

function getFaqs(data: any): any[] {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data)) return data;
  return [];
}

export default function FAQSection({ data, theme }: { data: any; theme: ThemeTokens }) {
  const faqs = getFaqs(data);
  if (!faqs.length) return null;
  const title = data?.title || data?.data?.title || 'سوالات متداول';

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-16">
      <SectionHeader eyebrow="راهنما" title={title} theme={theme} />
      <div className="space-y-3">
        {faqs.map((faq: any, index: number) => {
          const question = faq?.question;
          const answer = faq?.answer;
          if (!question && !answer) return null;

          return (
            <details
              key={index}
              className={`${surfaceClass(theme, 'px-5 py-2 open:shadow-md open:[&_.faq-icon]:rotate-45')}`}
            >
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-bold ${theme.textPrimary} [&::-webkit-details-marker]:hidden`}
              >
                <span>{question}</span>
                <span
                  className={`faq-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition-transform duration-300 ${theme.badgeBg}`}
                >
                  +
                </span>
              </summary>
              {answer && <p className={`pb-4 text-sm leading-relaxed ${theme.textSecondary}`}>{answer}</p>}
            </details>
          );
        })}
      </div>
    </section>
  );
}
