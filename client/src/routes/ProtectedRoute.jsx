import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

function ProtectedRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
