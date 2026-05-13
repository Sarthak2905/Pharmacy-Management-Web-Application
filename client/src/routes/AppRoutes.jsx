import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import BillingPage from '../pages/BillingPage';
import BillDetailsPage from '../pages/BillDetailsPage';
import CustomerProfilePage from '../pages/CustomerProfilePage';
import CustomersPage from '../pages/CustomersPage';
import DashboardPage from '../pages/DashboardPage';
import EditMedicinePage from '../pages/EditMedicinePage';
import InventoryPage from '../pages/InventoryPage';
import LoginPage from '../pages/LoginPage';
import MedicinesPage from '../pages/MedicinesPage';
import AddMedicinePage from '../pages/AddMedicinePage';
import NotFoundPage from '../pages/NotFoundPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route element={<RoleRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/medicines/new" element={<AddMedicinePage />} />
            <Route path="/medicines/:id/edit" element={<EditMedicinePage />} />
          </Route>
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/billing/:id" element={<BillDetailsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerProfilePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/app" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
