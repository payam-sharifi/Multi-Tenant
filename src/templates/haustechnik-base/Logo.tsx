'use client';

import { useHaustechnik } from '@/templates/haustechnik-base/context';

export function Logo({ light = false }: { light?: boolean }) {
  const { name, tagline, homeHref } = useHaustechnik();
  return (
    <a href={homeHref} className="group flex items-center gap-3" aria-label={`${name} – Startseite`}>
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm transition group-hover:scale-[1.03] ${
          light ? 'bg-white/10 text-white ring-1 ring-white/20' : 'bg-[var(--mh-navy)] text-white'
        }`}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
          <path
            d="M16 4.5c-4.2 0-7.5 3.1-7.5 7.6 0 5.4 7.5 15 7.5 15s7.5-9.6 7.5-15c0-4.5-3.3-7.6-7.5-7.6Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M16 8.2v7.2" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13.2 12.4h5.6" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block text-[15px] font-bold tracking-tight sm:text-base ${light ? 'text-white' : 'text-[var(--mh-navy)]'}`}>
          {name}
        </span>
        <span className={`block text-[11px] font-medium ${light ? 'text-white/70' : 'text-[var(--mh-muted)]'}`}>
          {tagline}
        </span>
      </span>
    </a>
  );
}
