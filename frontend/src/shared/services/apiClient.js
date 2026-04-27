/**
 * apiClient.js  (shared service)
 * Base Axios-like fetch wrapper for the WiFi dashboard API.
 * All feature services should import this client instead of calling fetch directly.
 *
 * Usage:
 *   import api from '@/shared/services/apiClient';
 *   const data = await api.get('/agents/operational/alerts');
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

async function request(method, endpoint, body, options = {}) {
  const token = (() => {
    try {
      const raw = localStorage.getItem('wifi_cali_auth');
      return raw ? JSON.parse(raw)?.token : null;
    } catch {
      return null;
    }
  })();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error?.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

const api = {
  get:    (endpoint, options)       => request('GET',    endpoint, undefined, options),
  post:   (endpoint, body, options) => request('POST',   endpoint, body,      options),
  put:    (endpoint, body, options) => request('PUT',    endpoint, body,      options),
  patch:  (endpoint, body, options) => request('PATCH',  endpoint, body,      options),
  delete: (endpoint, options)       => request('DELETE', endpoint, undefined, options),
};

export default api;
