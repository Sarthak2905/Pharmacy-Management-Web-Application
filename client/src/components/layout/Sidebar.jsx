import { NavLink } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 lg:block dark:border-slate-800 dark:bg-slate-950">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-600">Pharma SaaS</p>
        <h2 className="mt-2 text-xl font-semibold">Store Console</h2>
      </div>
      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
