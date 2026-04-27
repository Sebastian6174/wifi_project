/**
 * WorkforceManagementCard.jsx
 * Redesigned to fit the brand: white glass panel, standard primary button.
 * Placed in a single row taking full width of its container.
 */

import { useNavigate } from 'react-router-dom';

export default function WorkforceManagementCard() {
  const navigate = useNavigate();

  return (
    <div className="glass-panel flex flex-col sm:flex-row items-center justify-between rounded-xl p-4 shadow-sm border border-slate-200/60 w-full hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <div className="size-10 rounded-lg flex items-center justify-center bg-[var(--md-primary-container)]/10 text-[var(--md-primary-container)] border border-[var(--md-primary-container)]/20 shadow-inner">
          <span className="material-symbols-outlined text-[20px]">badge</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--md-primary-container)] leading-tight mb-0.5">
            Workforce Management
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Add, remove, or reassign field technicians. View service logs and certifications.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard/technicians')}
        className="w-full sm:w-auto px-5 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-sm"
        style={{ backgroundColor: 'var(--md-primary-container)', color: 'var(--md-on-primary)' }}
      >
        Manage Technicians
        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
      </button>
    </div>
  );
}
