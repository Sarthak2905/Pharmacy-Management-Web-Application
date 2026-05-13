import { formatCurrency } from '../../utils/currency';

function StatCard({ label, value, isCurrency = false, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="mt-2 text-2xl font-semibold">{isCurrency ? formatCurrency(value) : value}</h3>
      {helper ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}

export default StatCard;
