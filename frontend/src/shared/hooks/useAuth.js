/**
 * useAuth.js  (shared hook)
 * Minimal auth state management with localStorage persistence.
 * Replace with a proper auth context / JWT implementation when the backend is ready.
 *
 * Returns: { isAuthenticated, user, login, logout }
 */

import { useState } from 'react';

const AUTH_KEY = 'wifi_cali_auth';

function readStorage() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [auth, setAuth] = useState(() => readStorage());

  const login = (credentials) => {
    // TODO: replace with real API call (services/authService.js)
    const session = { user: { email: credentials.email, name: 'Operador WiFi' }, token: 'mock_token' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    setAuth(session);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  return {
    isAuthenticated: !!auth?.token,
    user: auth?.user ?? null,
    login,
    logout,
  };
}
