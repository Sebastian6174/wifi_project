/**
 * LoadingSpinner.jsx  (shared)
 * Reusable full-page or inline loading indicator.
 *
 * @param {{ fullPage?: boolean; size?: 'sm' | 'md' | 'lg'; label?: string }} props
 */

import { Loader2 } from 'lucide-react';

const SIZE_MAP = { sm: 16, md: 24, lg: 40 };

export default function LoadingSpinner({ fullPage = false, size = 'md', label = 'Cargando…' }) {
  const px = SIZE_MAP[size] ?? SIZE_MAP.md;

  const spinner = (
    <div className="flex flex-col items-center gap-3 text-[var(--color-primary-600)]">
      <Loader2 size={px} className="animate-spin" />
      {label && (
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-surface)]/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
}
