import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMedicines } from '../api/medicineApi';
import Badge from '../components/common/Badge';
import PageHeader from '../components/common/PageHeader';
import SimpleTable from '../components/tables/SimpleTable';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

const fallbackMedicines = [
  { id: '1', name: 'Paracetamol 650', categoryId: { name: 'Pain Relief' }, batchNumber: 'PCM-024', stockQuantity: 42, sellingPrice: 32, expiryDate: '2026-10-14' },
  { id: '2', name: 'Azithromycin', categoryId: { name: 'Antibiotic' }, batchNumber: 'AZI-111', stockQuantity: 9, sellingPrice: 118, expiryDate: '2026-07-02' },
];

function MedicinesPage() {
  const [medicines, setMedicines] = useState(fallbackMedicines);

  useEffect(() => {
    getMedicines({ limit: 10 })
      .then((response) => setMedicines(response.data.items))
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicines"
        description="Manage categories, prices, batch tracking, stock quantity, and expiry details."
        action={
          <Link className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white dark:bg-cyan-500 dark:text-slate-950" to="/medicines/new">
            Add medicine
          </Link>
        }
      />
      <SimpleTable
        columns={[
          { key: 'name', header: 'Medicine' },
          { key: 'category', header: 'Category', render: (row) => row.categoryId?.name || '-' },
          { key: 'batchNumber', header: 'Batch' },
          { key: 'stockQuantity', header: 'Stock', render: (row) => <Badge tone={row.stockQuantity <= 10 ? 'amber' : 'emerald'}>{row.stockQuantity}</Badge> },
          { key: 'sellingPrice', header: 'Selling price', render: (row) => formatCurrency(row.sellingPrice) },
          { key: 'expiryDate', header: 'Expiry', render: (row) => formatDate(row.expiryDate) },
          { key: 'actions', header: 'Actions', render: (row) => <Link className="text-cyan-600" to={`/medicines/${row.id || row._id}/edit`}>Edit</Link> },
        ]}
        rows={medicines}
      />
    </div>
  );
}

export default MedicinesPage;
