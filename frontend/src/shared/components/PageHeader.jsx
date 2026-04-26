/**
 * PageHeader.jsx  (shared)
 * Consistent page title + subtitle block used across agent pages.
 *
 * @param {{ title: string; subtitle?: string; icon?: React.ElementType; badge?: string; children?: React.ReactNode }} props
 */

export default function PageHeader({ title, subtitle, icon: Icon, badge, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 w-10 h-10 rounded-xl bg-[var(--color-primary-700)] flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-white" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[var(--color-primary-800)] font-bold text-xl leading-tight">
              {title}
            </h1>
            {badge && <span className="badge badge-primary">{badge}</span>}
          </div>
          {subtitle && (
            <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </div>
  );
}
