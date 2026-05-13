function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    red: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export default Badge;
