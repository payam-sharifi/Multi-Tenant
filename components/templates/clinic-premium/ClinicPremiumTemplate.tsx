import { ClinicPage } from "@/components/templates/clinic-premium/ClinicPage";
import { ClinicProvider } from "@/components/templates/clinic-premium/i18n";
import type { ClinicPremiumContent } from "@/lib/types/clinic-premium";
import type { TemplateProps } from "@/components/templates/shared";

const EMPTY: ClinicPremiumContent = {
  sample: false,
  present: { hero: true, services: false, checkup: false, about: false, doctors: false, locations: false, faq: false },
  serviceItems: [],
};

/**
 * Premium clinic landing page.
 * Activated with theme_config.theme = "clinic-premium" (or theme_config.template) on a medical site.
 * Every section is data-driven: sections missing from the site JSON are not rendered.
 */
export default function ClinicPremiumTemplate({ data, locale }: TemplateProps) {
  return (
    <div data-template="clinic-premium" id="top" className="min-h-screen bg-surface-alt text-ink antialiased">
      <ClinicProvider locale={locale} brandName={data.branding.name} content={data.clinic ?? EMPTY}>
        <ClinicPage />
      </ClinicProvider>
    </div>
  );
}
