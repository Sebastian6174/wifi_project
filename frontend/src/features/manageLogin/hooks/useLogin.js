/**
 * useLogin.js  (manageLogin/hooks)
 * Handles login form submission state (loading, error).
 * Delegates actual auth logic to shared useAuth hook.
 */

import { useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth';

export default function useLogin() {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: replace mock with real authService.login(credentials)
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network
      authLogin(credentials);
      return true;
    } catch (err) {
      setError(err.message ?? 'Error al iniciar sesión. Inténtalo de nuevo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
