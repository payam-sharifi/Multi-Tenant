import Link from 'next/link';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

type Props = {
  current?: 'templates' | 'messages';
};

export function AdminNav({ current = 'templates' }: Props) {
  const item = (href: string, label: string, key: Props['current']) => {
    const active = current === key;
    return (
      <Link
        href={href}
        className={
          active
            ? 'rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white'
            : 'rounded-full px-3 py-1.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100'
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {item('/admin', 'قالب‌ها', 'templates')}
      {item('/admin/messages', 'پیام‌ها', 'messages')}
      <LogoutButton />
    </div>
  );
}
