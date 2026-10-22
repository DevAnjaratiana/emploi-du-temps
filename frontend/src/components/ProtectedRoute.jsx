import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../api/auth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly) {
    const user = getCurrentUser();
    if (!user?.is_staff && !user?.is_superuser) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}