import type { CSSProperties, ReactNode } from 'react';
import type { SiteConfig } from '@/lib/types/template';

export function BrandScope({
  data,
  className,
  children,
}: {
  data: SiteConfig;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-template={data.templateId || data.businessCategory}
      className={className}
      style={
        {
          '--brand-primary': data.branding.primaryColor,
          '--brand-secondary': data.branding.secondaryColor,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
