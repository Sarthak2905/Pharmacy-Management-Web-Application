import PageHeader from '../components/common/PageHeader';

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure pharmacy profile, GST details, invoice footer, and future SaaS billing plan settings." />
      <div className="grid gap-4 md:grid-cols-2">
        {['Store profile', 'GST & license', 'Invoice branding', 'Staff roles'].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold">{item}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This starter keeps these settings ready for future SaaS customization.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage;
