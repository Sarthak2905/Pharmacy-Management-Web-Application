import PageHeader from '../components/common/PageHeader';

function BillDetailsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bill details" description="Preview invoice HTML, trigger print, and connect PDF/WhatsApp flows from this page." />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Integrate this view with GET /api/bills/:id, /invoice, /pdf, and /print for a full invoice workflow.
      </div>
    </div>
  );
}

export default BillDetailsPage;
