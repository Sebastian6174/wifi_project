import { useNavigate } from "react-router-dom";

const PRIORITY_OPTIONS = [
  { id: "low",      label: "Baja",     badge: "bg-slate-100 text-slate-500" },
  { id: "medium",   label: "Media",    badge: "bg-amber-50 text-amber-700" },
  { id: "high",     label: "Alta",     badge: "bg-rose-50 text-rose-600" },
  { id: "critical", label: "Crítica",  badge: "bg-[#004851] text-white" },
];

export default function PlanHeader({ meta, totalHours, grandTotal, loading, saved, onSave, onReset }) {
  const navigate = useNavigate();
  const priority = PRIORITY_OPTIONS.find((p) => p.id === meta.priority) || PRIORITY_OPTIONS[1];

  return (
    <div className="mb-6 print:mb-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
        <button onClick={() => navigate("/dashboard/strategic")} className="hover:text-[#004851] transition-colors">
          Agente Estratégico
        </button>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-[#004851]">Plan de Ejecución</span>
      </div>

      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#003036] tracking-tight leading-tight">
            {meta.title || "Nuevo Plan Estratégico"}
          </h1>
          {meta.zone && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              {meta.zone}
            </p>
          )}
        </div>

        {/* Status chips + actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority badge */}
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${priority.badge}`}>
            {priority.label}
          </span>

          {/* Stats */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            {totalHours}h estimadas
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
            <span className="material-symbols-outlined text-[12px]">payments</span>
            ${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-[#004851] bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            Nuevo Plan
          </button>

          <button
            onClick={onSave}
            disabled={loading || saved}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-[#004851] text-white hover:bg-[#003036] shadow-teal-900/20"
            }`}
          >
            <span className={`material-symbols-outlined text-[15px] ${loading ? "animate-spin" : ""}`}>
              {loading ? "sync" : saved ? "check_circle" : "save"}
            </span>
            {loading ? "Guardando..." : saved ? "Guardado" : "Guardar Plan"}
          </button>
        </div>
      </div>

      <div className="mt-4 h-px bg-gradient-to-r from-[#004851]/20 via-[#004851]/5 to-transparent" />
    </div>
  );
}
