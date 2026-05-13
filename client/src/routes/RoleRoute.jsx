import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

function RoleRoute({ allowedRoles }) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
}

export default RoleRoute;
