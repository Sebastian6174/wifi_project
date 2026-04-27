/**
 * loginValidators.js  (manageLogin/utils)
 * Pure validation helpers for the login form.
 */

/**
 * Validate an email address.
 * @param {string} email
 * @returns {string | null}  Error message or null if valid.
 */
export function validateEmail(email) {
  if (!email?.trim()) return 'El correo electrónico es obligatorio.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? null : 'Ingresa un correo electrónico válido.';
}

/**
 * Validate a password.
 * @param {string} password
 * @returns {string | null}
 */
export function validatePassword(password) {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return null;
}

/**
 * Validate the full login form.
 * @param {{ email: string; password: string }} form
 * @returns {{ email?: string; password?: string }}  Map of field → error.
 */
export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailErr    = validateEmail(email);
  const passwordErr = validatePassword(password);
  if (emailErr)    errors.email    = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
}
