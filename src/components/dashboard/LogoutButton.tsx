export function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="post">
      <button
        type="submit"
        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-600 hover:border-zinc-400"
      >
        خروج
      </button>
    </form>
  );
}
