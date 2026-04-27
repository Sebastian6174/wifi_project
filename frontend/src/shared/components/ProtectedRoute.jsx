/**
 * ProtectedRoute.jsx  (shared)
 * Guards routes that require authentication.
 * Reads auth state from the shared useAuth hook.
 * Redirects unauthenticated users to "/" (LoginPage).
 */

import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * @param {{ children: React.ReactNode }} props
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
