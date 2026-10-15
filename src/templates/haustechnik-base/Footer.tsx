'use client';

import { Logo } from '@/templates/haustechnik-base/Logo';
import { useHaustechnik } from '@/templates/haustechnik-base/context';

export function Footer() {
  const { legalName, nav, impressumHref, datenschutzHref, content } = useHaustechnik();
  return (
    <footer className="bg-[var(--mh-navy-deep)] text-white">
      <div className="mh-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">{content.footerAbout}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Navigation</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Rechtliches</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <a href={impressumHref} className="hover:text-white">
                Impressum
              </a>
            </li>
            <li>
              <a href={datenschutzHref} className="hover:text-white">
                Datenschutz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mh-container py-6 text-xs text-white/50">
          © {new Date().getFullYear()} {legalName}. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
