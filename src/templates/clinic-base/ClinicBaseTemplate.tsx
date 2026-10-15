import { ClinicPage } from "@/templates/clinic-base/ClinicPage";
import { ClinicProvider } from "@/templates/clinic-base/i18n";
import type { ClinicBaseContent } from "@/lib/types/clinic-base";
import type { TemplateProps } from "@/shared";

const EMPTY: ClinicBaseContent = {
  sample: false,
  present: { hero: true, services: false, checkup: false, about: false, doctors: false, locations: false, faq: false },
  serviceItems: [],
};

/**
 * Premium clinic landing page.
 * Activated with theme_config.theme = "clinic-base" (or theme_config.template) on a medical site.
 * Every section is data-driven: sections missing from the site JSON are not rendered.
 */
export default function ClinicBaseTemplate({ data, locale }: TemplateProps) {
  return (
    <div data-template="clinic-base" id="top" className="min-h-screen bg-surface-alt text-ink antialiased">
      <ClinicProvider locale={locale} brandName={data.branding.name} content={data.clinic ?? EMPTY}>
        <ClinicPage />
      </ClinicProvider>
    </div>
  );
}
