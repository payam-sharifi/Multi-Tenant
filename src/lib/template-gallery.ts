export type GalleryLink = {
  label: string;
  href: string;
};

export type GalleryCard = {
  id: string;
  title: string;
  titleFa: string;
  blurb: string;
  href: string;
  variants?: GalleryLink[];
};

export const TEMPLATE_GALLERY: GalleryCard[] = [
  {
    id: 'clinic-base',
    title: 'clinic-base',
    titleFa: 'کلینیک بیس',
    blurb: 'قالب کامل مطب و کلینیک',
    href: '/preview?fixture=clinic-base',
    variants: [
      { label: 'Hermes کامل', href: '/preview?fixture=clinic-hermes-full' },
      { label: 'Hermes ساده', href: '/preview?fixture=clinic-hermes-minimal' },
    ],
  },
  {
    id: 'handwerk-base',
    title: 'handwerk-base',
    titleFa: 'بازسازی بیس',
    blurb: 'قالب کامل بازسازی خانه',
    href: '/preview?fixture=handwerk-base',
    variants: [
      { label: 'Hermes کامل', href: '/preview?fixture=handwerk-hermes-full' },
      { label: 'Hermes ساده', href: '/preview?fixture=handwerk-hermes-minimal' },
    ],
  },
  {
    id: 'haustechnik-base',
    title: 'haustechnik-base',
    titleFa: 'هاوس تکنیک بیس',
    blurb: 'قالب شرکت‌های خدماتی',
    href: '/preview?fixture=haustechnik-base',
  },
];
