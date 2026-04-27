/**
 * strategicUtils.js  (manageStrategicAgent/utils)
 * Pure helpers for the Strategic Agent feature.
 */

/**
 * Classify an AP's health based on its uptime percentage.
 * @param {number} uptime  0–100
 * @returns {{ label: string; cls: string }}
 */
export function classifyAPHealth(uptime) {
  if (uptime >= 95) return { label: 'Óptimo',   cls: 'badge-success' };
  if (uptime >= 80) return { label: 'Estable',  cls: 'badge-info'    };
  if (uptime >= 60) return { label: 'Degradado',cls: 'badge-warning' };
  return                   { label: 'Crítico',  cls: 'badge-error'   };
}

/**
 * Sort APs by uptime ascending (worst first) for prioritization.
 * @param {object[]} aps
 * @returns {object[]}
 */
export function sortAPsByUrgency(aps = []) {
  return [...aps].sort((a, b) => (a.uptime ?? 100) - (b.uptime ?? 100));
}

/**
 * Calculate ROI estimate for a given investment recommendation.
 * @param {{ cost: number; projectedUsers: number; currentUsers: number }} rec
 * @returns {number}  Percentage improvement
 */
export function estimateROI({ cost, projectedUsers, currentUsers }) {
  if (!cost || cost <= 0) return 0;
  return ((projectedUsers - currentUsers) / currentUsers) * 100;
}
