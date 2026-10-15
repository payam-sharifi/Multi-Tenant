import Link from 'next/link';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

export function AdminNav() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/admin"
        className="rounded-full px-3 py-1.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
      >
        قالب‌ها
      </Link>
      <LogoutButton />
    </div>
  );
}
