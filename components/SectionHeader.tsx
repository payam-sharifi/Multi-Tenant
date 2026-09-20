import type { ThemeTokens } from '@/lib/theme';

export default function SectionHeader({
  eyebrow,
  title,
  theme,
}: {
  eyebrow?: string;
  title: string;
  theme: ThemeTokens;
}) {
  return (
    <div className="mb-10 text-center">
      {eyebrow ? (
        <span
          className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${theme.badgeBg}`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.textPrimary}`}>{title}</h2>
    </div>
  );
}
