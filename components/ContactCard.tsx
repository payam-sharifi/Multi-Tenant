import type { ThemeTokens } from '@/lib/theme';
import { iconClass, surfaceClass } from '@/lib/theme';

export default function ContactCard({ siteData, theme }: { siteData: any; theme: ThemeTokens }) {
  const owner = siteData.owner_name;
  const phone = siteData.phone || siteData.contact_phone;
  const email = siteData.email || siteData.contact_email;
  const address = siteData.address;

  return (
    <article id="contact" className={surfaceClass(theme, 'h-full scroll-mt-24 p-8')}>
      <div className={`mb-5 ${iconClass(theme)}`}>
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className={`mb-4 text-2xl font-extrabold ${theme.textPrimary}`}>اطلاعات تماس</h2>
      <p className={`mb-4 text-lg font-semibold ${theme.accentText}`}>{siteData.business_name}</p>
      <div className={`space-y-2 text-sm ${theme.textSecondary}`}>
        <p>مالک: {owner || 'ثبت شده در سیستم'}</p>
        {phone && <p>تلفن: {phone}</p>}
        {email && <p>ایمیل: {email}</p>}
        {address && <p>آدرس: {address}</p>}
      </div>
    </article>
  );
}
