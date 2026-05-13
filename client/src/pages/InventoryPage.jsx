import PageHeader from '../components/common/PageHeader';
import SimpleTable from '../components/tables/SimpleTable';

const movements = [
  { id: 1, medicine: 'Paracetamol 650', type: 'sale', quantityChange: -2, quantityAfter: 42, notes: 'BILL-1001' },
  { id: 2, medicine: 'Azithromycin', type: 'purchase', quantityChange: 20, quantityAfter: 70, notes: 'Restock batch' },
];

function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Monitor stock changes, manual adjustments, and restock operations with traceable movements." />
      <SimpleTable
        columns={[
          { key: 'medicine', header: 'Medicine' },
          { key: 'type', header: 'Movement type' },
          { key: 'quantityChange', header: 'Change' },
          { key: 'quantityAfter', header: 'Available after' },
          { key: 'notes', header: 'Reference' },
        ]}
        rows={movements}
      />
    </div>
  );
}

export default InventoryPage;
