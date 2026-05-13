import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboardApi';
import SalesOverviewChart from '../components/charts/SalesOverviewChart';
import Badge from '../components/common/Badge';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import SimpleTable from '../components/tables/SimpleTable';
import { fallbackMetrics, salesTrend } from '../features/dashboard/metrics';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/date';

function DashboardPage() {
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [recentBills, setRecentBills] = useState([
    { id: 'draft-1', billNumber: 'BILL-1001', grandTotal: 1240, createdAt: new Date().toISOString(), paymentStatus: 'paid' },
    { id: 'draft-2', billNumber: 'BILL-1002', grandTotal: 860, createdAt: new Date().toISOString(), paymentStatus: 'partial' },
  ]);

  useEffect(() => {
    getDashboardStats()
      .then((response) => {
        setMetrics({
          totalSales: response.data.totalSales,
          todaysRevenue: response.data.todaysRevenue,
          totalMedicines: response.data.totalMedicines,
          lowStockMedicines: response.data.lowStockMedicines,
        });
        if (response.data.recentBills?.length) {
          setRecentBills(response.data.recentBills);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track sales, medicine movement, low stock, and recent billing activity from one place."
        action={<Badge tone="emerald">Today’s store status: healthy</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sales" value={metrics.totalSales} isCurrency helper="Overall completed billing revenue" />
        <StatCard label="Today’s revenue" value={metrics.todaysRevenue} isCurrency helper="Captured since midnight" />
        <StatCard label="Total medicines" value={metrics.totalMedicines} helper="Active medicine catalog entries" />
        <StatCard label="Low stock items" value={metrics.lowStockMedicines} helper="Needs attention from manager" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,0.6fr]">
        <SalesOverviewChart data={salesTrend} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Top action items</h3>
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="font-medium">Refill low-stock essentials</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Monitor antibiotics, pain relief, and insulin every day.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="font-medium">Check upcoming expiries</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Automate 7-day and 30-day alerts through backend cron jobs.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <PageHeader title="Recent bills" description="Use recent billing activity to quickly reopen, print, or review invoices." />
        <SimpleTable
          columns={[
            { key: 'billNumber', header: 'Bill no.' },
            { key: 'createdAt', header: 'Created at', render: (row) => formatDateTime(row.createdAt) },
            { key: 'grandTotal', header: 'Total', render: (row) => formatCurrency(row.grandTotal) },
            { key: 'paymentStatus', header: 'Payment', render: (row) => <Badge tone={row.paymentStatus === 'paid' ? 'emerald' : 'amber'}>{row.paymentStatus}</Badge> },
          ]}
          rows={recentBills}
        />
      </section>
    </div>
  );
}

export default DashboardPage;
