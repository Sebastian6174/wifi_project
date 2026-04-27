/**
 * PerformanceMetrics.jsx  (<= 250 lines)
 * KPI bento-grid + Workforce Management CTA card.
 */

const KPI_ICONS = {
  timer:         'timer',
  check_circle:  'check_circle',
  groups:        'groups',
  star:          'star',
};

function KpiCard({ kpi }) {
  const isPositive = kpi.positive === true;
  const isNeutral  = kpi.positive === null;

  return (
    <div className="op-kpi-card">
      <span className="material-symbols-outlined text-[16px] mb-1" style={{ color: 'var(--md-primary-container)' }}>
        {KPI_ICONS[kpi.icon] ?? 'analytics'}
      </span>
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{kpi.label}</span>
      <p className="text-xl font-black leading-tight" style={{ color: 'var(--md-primary-container)' }}>{kpi.value}</p>
      <span className={`text-[10px] flex items-center gap-0.5 font-medium ${
        isNeutral ? 'text-slate-400' : isPositive ? 'text-emerald-600' : 'text-red-500'
      }`}>
        {!isNeutral && (
          <span className="material-symbols-outlined text-[11px]">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
        )}
        {kpi.trend}
      </span>
    </div>
  );
}

export default function PerformanceMetrics({ kpis = [] }) {
  return (
    <section className="glass-panel rounded-xl p-4 shadow-sm border border-slate-200/60 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--md-primary-container)' }}>
          <span className="material-symbols-outlined text-[16px]">groups</span>
          Field Performance
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
    </section>
  );
}
