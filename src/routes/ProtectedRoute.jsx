import { Navigate } from 'react-router-dom';
import { getStoredSession } from '../utils/session';

export default function ProtectedRoute({ children }) {
  const { token } = getStoredSession();
  return token ? children : <Navigate to="/login" replace />;
}
