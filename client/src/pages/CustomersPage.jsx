import PageHeader from '../components/common/PageHeader';
import SimpleTable from '../components/tables/SimpleTable';
import { formatCurrency } from '../utils/currency';

const customers = [
  { id: 'c1', name: 'Ravi Sharma', phone: '9876543210', outstandingDue: 450, totalPurchases: 6450 },
  { id: 'c2', name: 'Priya Patel', phone: '9876500011', outstandingDue: 0, totalPurchases: 3120 },
];

function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Maintain optional customer profiles, purchase history, dues, and repeat-buyer insights." />
      <SimpleTable
        columns={[
          { key: 'name', header: 'Customer' },
          { key: 'phone', header: 'Phone' },
          { key: 'outstandingDue', header: 'Outstanding due', render: (row) => formatCurrency(row.outstandingDue) },
          { key: 'totalPurchases', header: 'Lifetime purchases', render: (row) => formatCurrency(row.totalPurchases) },
        ]}
        rows={customers}
      />
    </div>
  );
}

export default CustomersPage;
