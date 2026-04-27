import { PLAN_FOCUS_TYPES, CALI_ZONES } from "../utils/mockPlanData";

const PRIORITY_OPTIONS = [
  { id: "low", label: "Baja" }, { id: "medium", label: "Media" },
  { id: "high", label: "Alta" }, { id: "critical", label: "Crítica" },
];

const inputCls = "w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#004851] focus:ring-2 focus:ring-[#004851]/10 transition-all placeholder:text-slate-300 text-slate-700";
const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";

export default function PlanIdentityForm({ meta, onUpdate }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
      <h2 className="text-sm font-black text-[#004851] flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_document</span>
        Identidad del Plan
      </h2>

      {/* Title + Zone row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nombre del Plan *</label>
          <input
            className={inputCls}
            placeholder="Ej. Mejora de Capacidad — Parque del Perro"
            value={meta.title}
            onChange={(e) => onUpdate("title", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Zona Afectada *</label>
          <select
            className={inputCls}
            value={meta.zone}
            onChange={(e) => onUpdate("zone", e.target.value)}
          >
            <option value="">Selecciona una zona...</option>
            {CALI_ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Descripción y Contexto</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          placeholder="Describe el problema detectado, el alcance de la intervención y los resultados esperados..."
          value={meta.description}
          onChange={(e) => onUpdate("description", e.target.value)}
        />
      </div>

      {/* Focus type selector */}
      <div>
        <label className={labelCls}>Enfoque de la Intervención *</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PLAN_FOCUS_TYPES.map((type) => {
            const isSelected = meta.focus === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onUpdate("focus", type.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? `${type.color} border-current shadow-sm`
                    : "bg-slate-50 border-transparent hover:border-slate-200 text-slate-500"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px] block mb-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {type.icon}
                </span>
                <p className="text-[11px] font-black leading-tight">{type.label}</p>
                <p className="text-[9px] font-medium mt-0.5 opacity-70 leading-tight">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className={labelCls}>Nivel de Prioridad</label>
        <div className="flex gap-2 flex-wrap">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onUpdate("priority", p.id)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                meta.priority === p.id
                  ? "bg-[#004851] text-white border-[#004851] shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
