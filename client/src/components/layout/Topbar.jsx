import { useAppSelector } from '../../app/hooks';
import ThemeToggle from '../common/ThemeToggle';

function Topbar() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-950">
      <div className="flex-1">
        <input
          type="search"
          placeholder="Search medicines, customers, or bills"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
          {user?.name || 'Guest'}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
