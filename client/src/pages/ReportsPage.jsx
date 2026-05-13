import PageHeader from '../components/common/PageHeader';
import SimpleTable from '../components/tables/SimpleTable';
import { formatCurrency } from '../utils/currency';

const reportRows = [
  { id: 'r1', metric: 'Daily sales', value: 22450, note: '12 bills today' },
  { id: 'r2', metric: 'Top seller', value: 8200, note: 'Paracetamol 650' },
  { id: 'r3', metric: 'Outstanding dues', value: 1450, note: 'Pending collections' },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Prepare daily and monthly sales reports, revenue analytics, and top-selling medicine trends." />
      <SimpleTable
        columns={[
          { key: 'metric', header: 'Metric' },
          { key: 'value', header: 'Value', render: (row) => formatCurrency(row.value) },
          { key: 'note', header: 'Insight' },
        ]}
        rows={reportRows}
      />
    </div>
  );
}

export default ReportsPage;
