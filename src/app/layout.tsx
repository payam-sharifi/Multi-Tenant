import { headers } from 'next/headers';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { resolveLocale } from '@/lib/i18n/config';
import { DEFAULT_FAVICON } from '@/lib/site-icon';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

const display = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
});

export async function generateMetadata() {
  const headerList = await headers();
  const locale = resolveLocale(headerList.get('x-locale'));
  const dict = getDictionary(locale);

  return {
    title: dict.meta.defaultTitle,
    description: dict.meta.defaultDescription,
    icons: {
      icon: [{ url: DEFAULT_FAVICON, type: 'image/png' }],
      apple: DEFAULT_FAVICON,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const locale = resolveLocale(headerList.get('x-locale'));

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
