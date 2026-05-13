import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

function EditMedicinePage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit medicine" description={`Update medicine ${id} while preserving audit-friendly stock movement history.`} />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Hook this screen to GET /api/medicines/:id and PATCH /api/medicines/:id.
      </div>
    </div>
  );
}

export default EditMedicinePage;
