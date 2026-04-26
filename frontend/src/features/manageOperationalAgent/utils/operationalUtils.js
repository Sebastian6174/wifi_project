/**
 * operationalUtils.js  (manageOperationalAgent/utils)
 * Pure helpers for the Operational Agent feature.
 */

/** Map severity level to badge class + label */
export function getSeverityBadge(severity) {
  const map = {
    critical: { cls: 'badge-error',   label: 'Crítico'  },
    high:     { cls: 'badge-warning', label: 'Alto'     },
    medium:   { cls: 'badge-info',    label: 'Medio'    },
    low:      { cls: 'badge-neutral', label: 'Bajo'     },
  };
  return map[severity?.toLowerCase()] ?? { cls: 'badge-neutral', label: severity ?? 'N/A' };
}

/** Sort work orders by priority (critical first) */
export function sortOrdersByPriority(orders = []) {
  const priority = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...orders].sort(
    (a, b) => (priority[a.severity] ?? 99) - (priority[b.severity] ?? 99),
  );
}
