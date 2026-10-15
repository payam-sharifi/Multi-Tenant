import { LeadProvider } from "@/components/shared/LeadProvider";
import type { TemplateProps } from "@/shared";
import { resolveTemplateId, TEMPLATE_COMPONENTS } from "@/templates/registry";

export default function TemplateRenderer({
  data,
  dict,
  locale,
}: TemplateProps) {
  const templateId = resolveTemplateId(data);
  const Template = TEMPLATE_COMPONENTS[templateId];
  return (
    <LeadProvider subdomain={data.subdomain} locale={locale} businessName={data.branding.name}>
      <Template data={data} dict={dict} locale={locale} />
    </LeadProvider>
  );
}
