import type { ReactNode } from 'react';

export function LegalPage({
  title,
  backHref,
  backLabel,
  children,
  className = 'min-h-screen bg-white px-6 py-16 text-neutral-800',
  containerClassName = 'mx-auto max-w-3xl',
  titleClassName = 'mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl',
  backClassName = 'text-sm font-semibold text-[var(--brand-primary)] hover:opacity-80',
  bodyClassName = 'mt-8 space-y-4 text-sm leading-relaxed opacity-80',
}: {
  title: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  backClassName?: string;
  bodyClassName?: string;
}) {
  return (
    <article className={className}>
      <div className={containerClassName}>
        <a href={backHref} className={backClassName}>
          ← {backLabel}
        </a>
        <h1 className={titleClassName}>{title}</h1>
        <div className={bodyClassName}>{children}</div>
      </div>
    </article>
  );
}
