import BillSummary from '../components/billing/BillSummary';
import PageHeader from '../components/common/PageHeader';
import SimpleTable from '../components/tables/SimpleTable';

const cartItems = [
  { id: 'm1', medicine: 'Paracetamol 650', quantity: 2, price: 32, gstRate: 5 },
  { id: 'm2', medicine: 'Azithromycin', quantity: 1, price: 118, gstRate: 12 },
];

function BillingPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
      <div className="space-y-6">
        <PageHeader title="Billing / POS" description="Search medicines quickly, add quantities, and generate GST-ready invoices for walk-in customers." />
        <SimpleTable
          columns={[
            { key: 'medicine', header: 'Medicine' },
            { key: 'quantity', header: 'Qty' },
            { key: 'price', header: 'Unit price' },
            { key: 'gstRate', header: 'GST %' },
          ]}
          rows={cartItems}
        />
      </div>
      <BillSummary items={cartItems} />
    </div>
  );
}

export default BillingPage;
