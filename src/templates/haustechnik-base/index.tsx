import { HaustechnikProvider } from '@/templates/haustechnik-base/context';
import { HaustechnikPage } from '@/templates/haustechnik-base/HaustechnikPage';
import { buildHaustechnikContent } from '@/lib/haustechnik-base';
import type { TemplateProps } from '@/shared';

export default function HaustechnikPremiumTemplate({ data, locale }: TemplateProps) {
  const content =
    data.haustechnik ??
    buildHaustechnikContent({}, data.services, data.branding.name);

  return (
    <HaustechnikProvider data={data} locale={locale} content={content}>
      <HaustechnikPage />
    </HaustechnikProvider>
  );
}
