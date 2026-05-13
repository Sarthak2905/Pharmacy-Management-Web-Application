import PageHeader from '../components/common/PageHeader';

function AddMedicinePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add medicine" description="Create a beginner-friendly medicine form backed by reusable inputs and validation." />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Suggested fields: medicine name, category, manufacturer, batch number, expiry date, purchase price, selling price, GST rate, quantity, reorder level, and barcode.
      </div>
    </div>
  );
}

export default AddMedicinePage;
