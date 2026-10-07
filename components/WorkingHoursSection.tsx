import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { ThemeTokens } from "@/lib/theme";
import { iconClass, surfaceClass } from "@/lib/theme";

function getWorkingHoursSource(data: any) {
  if (
    data?.data &&
    typeof data.data === "object" &&
    !Array.isArray(data.data)
  ) {
    return { ...data, ...data.data };
  }
  return data;
}

function getWorkingHoursText(data: any, separator: string): string {
  const source = getWorkingHoursSource(data);

  if (typeof source === "string") return source;
  if (source?.text) return String(source.text);

  const open = source?.open;
  const close = source?.close;
  if (!open && !close) return "";

  const hours = [open, close].filter(Boolean).join(` ${separator} `);
  return source?.days ? `${source.days}, ${hours}` : hours;
}

export default function WorkingHoursSection({
  data,
  theme,
  dict,
}: {
  data: any;
  theme: ThemeTokens;
  dict: Dictionary;
  locale: Locale;
}) {
  const source = getWorkingHoursSource(data);
  const text = getWorkingHoursText(data, dict.hours.separator);
  if (!text && !source?.open && !source?.close && !source?.days) return null;

  return (
    <article
      id="hours"
      className={surfaceClass(theme, "h-full scroll-mt-24 p-8")}
    >
      <div className={`mb-5 ${iconClass(theme)}`}>
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.5 1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className={`mb-4 text-2xl font-extrabold ${theme.textPrimary}`}>
        {dict.hours.title}
      </h2>
      {source?.days && (
        <span
          className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${theme.badgeBg}`}
        >
          {source.days}
        </span>
      )}
      {text && (
        <p className={`text-xl font-bold ${theme.accentText}`}>{text}</p>
      )}
      {(source?.open || source?.close) && (
        <p className={`mt-2 text-sm ${theme.textSecondary}`}>
          <span dir="ltr" className="inline-block">
            {[source.open, source.close].filter(Boolean).join(" — ")}
          </span>
        </p>
      )}
    </article>
  );
}
