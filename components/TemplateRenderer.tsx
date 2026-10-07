import GeneralTemplate from '@/components/templates/GeneralTemplate';
import MedicalTemplate from '@/components/templates/MedicalTemplate';
import RestaurantTemplate from '@/components/templates/RestaurantTemplate';
import SalonTemplate from '@/components/templates/SalonTemplate';
import ServicesTemplate from '@/components/templates/ServicesTemplate';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import type { SiteConfig } from '@/lib/types/template';

export default function TemplateRenderer({
  data,
  dict,
  locale,
}: {
  data: SiteConfig;
  dict: Dictionary;
  locale: Locale;
}) {
  switch (data.businessType) {
    case 'medical':
      return <MedicalTemplate data={data} dict={dict} locale={locale} />;
    case 'salon':
      return <SalonTemplate data={data} dict={dict} locale={locale} />;
    case 'restaurant':
      return <RestaurantTemplate data={data} dict={dict} locale={locale} />;
    case 'services':
      return <ServicesTemplate data={data} dict={dict} locale={locale} />;
    default:
      return <GeneralTemplate data={data} dict={dict} locale={locale} />;
  }
}
