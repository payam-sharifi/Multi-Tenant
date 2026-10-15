import type { Metadata } from 'next';
import { TemplateGallery } from '@/components/dashboard/TemplateGallery';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ادمین قالب‌ها',
  description: 'داشبورد ادمین قالب‌های easyWeb',
};

export default function AdminPage() {
  return <TemplateGallery />;
}
