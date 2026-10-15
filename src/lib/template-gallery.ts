export type GalleryCard = {
  id: string;
  title: string;
  titleFa: string;
  blurb: string;
  href: string;
  dashboardHref: string;
};

export const TEMPLATE_GALLERY: GalleryCard[] = [
  {
    id: 'clinic-base',
    title: 'clinic-base',
    titleFa: 'کلینیک بیس',
    blurb: 'قالب کامل مطب و کلینیک',
    href: '/preview?fixture=clinic-base',
    dashboardHref: '/dashboard/clinic-base',
  },
  {
    id: 'handwerk-base',
    title: 'handwerk-base',
    titleFa: 'بازسازی بیس',
    blurb: 'قالب کامل بازسازی خانه',
    href: '/preview?fixture=handwerk-base',
    dashboardHref: '/dashboard/handwerk-base',
  },
  {
    id: 'haustechnik-base',
    title: 'haustechnik-base',
    titleFa: 'هاوس تکنیک بیس',
    blurb: 'قالب شرکت‌های خدماتی',
    href: '/preview?fixture=haustechnik-base',
    dashboardHref: '/dashboard/haustechnik-base',
  },
];
