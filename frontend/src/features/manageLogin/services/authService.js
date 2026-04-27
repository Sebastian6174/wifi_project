/**
 * authService.js  (manageLogin/services)
 * API calls related to user authentication.
 * TODO: implement real endpoints once backend is available.
 */

import api from '../../../shared/services/apiClient';

/**
 * Authenticate a user with email + password.
 * @param {{ email: string; password: string }} credentials
 * @returns {Promise<{ token: string; user: object }>}
 */
export async function loginUser(credentials) {
  return api.post('/auth/login', credentials);
}

/**
 * Refresh the current session token.
 * @returns {Promise<{ token: string }>}
 */
export async function refreshToken() {
  return api.post('/auth/refresh');
}

/**
 * Invalidate the current session server-side.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  return api.post('/auth/logout');
}
