import { formatCurrency } from '../../utils/currency';

function BillSummary({ items }) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = items.reduce((sum, item) => sum + item.quantity * item.price * (item.gstRate / 100), 0);
  const total = subtotal + tax;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">Live bill summary</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span>GST</span><span>{formatCurrency(tax)}</span></div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold dark:border-slate-800"><span>Total</span><span>{formatCurrency(total)}</span></div>
      </div>
    </div>
  );
}

export default BillSummary;
