import PageHeader from '../components/common/PageHeader';

function CustomerProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customer profile" description="Show previous purchases, due collection history, and billing preferences for frequent buyers." />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Connect this page to GET /api/customers/:id and /api/customers/:id/bills.
      </div>
    </div>
  );
}

export default CustomerProfilePage;
