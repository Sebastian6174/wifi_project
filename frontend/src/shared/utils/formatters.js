/**
 * formatters.js  (shared utils)
 * Common formatting helpers used across the application.
 */

/**
 * Format a Date or ISO string to a human-readable locale string.
 * @param {Date | string} date
 * @param {{ dateStyle?: string; timeStyle?: string }} options
 * @returns {string}
 */
export function formatDate(date, { dateStyle = 'medium', timeStyle } = {}) {
  const opts = { dateStyle };
  if (timeStyle) opts.timeStyle = timeStyle;
  return new Intl.DateTimeFormat('es-CO', opts).format(new Date(date));
}

/**
 * Format a number as a percentage string.
 * @param {number} value  0–100
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Format bytes to a human-readable size.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Truncate a string to a given length.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 40) {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}
