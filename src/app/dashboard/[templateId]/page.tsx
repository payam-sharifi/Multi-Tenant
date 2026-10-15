import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TemplateDashboard } from '@/components/dashboard/TemplateDashboard';
import { loadTemplateDashboard } from '@/lib/template-dashboard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> {
  const { templateId } = await params;
  const data = await loadTemplateDashboard(templateId);
  return {
    title: data ? `داشبورد ${data.template.titleFa}` : 'داشبورد قالب',
  };
}

export default async function TemplateDashboardPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const data = await loadTemplateDashboard(templateId);
  if (!data) notFound();
  return <TemplateDashboard {...data} />;
}
