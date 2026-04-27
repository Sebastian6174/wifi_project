import { STEP_STATUSES } from "../utils/mockPlanData";

const inputCls = "w-full px-2.5 py-1.5 text-[11px] font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004851] focus:ring-1 focus:ring-[#004851]/10 transition-all placeholder:text-slate-300 text-slate-700";

function StepRow({ step, index, total, onUpdate, onRemove, onMove }) {
  const statusObj = STEP_STATUSES.find((s) => s.id === step.status) || STEP_STATUSES[0];

  return (
    <div className="group flex gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:border-slate-200 hover:bg-white transition-all">
      {/* Index + move controls */}
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <span className="size-6 flex items-center justify-center rounded-full bg-[#004851] text-white text-[10px] font-black shrink-0">
          {index + 1}
        </span>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMove(step.id, "up")}
            disabled={index === 0}
            className="size-4 flex items-center justify-center rounded text-slate-300 hover:text-[#004851] disabled:opacity-20 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
          </button>
          <button
            onClick={() => onMove(step.id, "down")}
            disabled={index === total - 1}
            className="size-4 flex items-center justify-center rounded text-slate-300 hover:text-[#004851] disabled:opacity-20 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="sm:col-span-2">
          <input
            className={inputCls}
            placeholder="Título de la fase *"
            value={step.title}
            onChange={(e) => onUpdate(step.id, "title", e.target.value)}
          />
        </div>
        <div>
          <input
            className={inputCls}
            placeholder="Responsable"
            value={step.owner}
            onChange={(e) => onUpdate(step.id, "owner", e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            min={1}
            className={inputCls}
            placeholder="Horas"
            value={step.hours}
            onChange={(e) => onUpdate(step.id, "hours", e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className={inputCls}
            value={step.startDate}
            onChange={(e) => onUpdate(step.id, "startDate", e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className={inputCls}
            value={step.endDate}
            onChange={(e) => onUpdate(step.id, "endDate", e.target.value)}
          />
        </div>
        <div>
          <select
            className={inputCls}
            value={step.status}
            onChange={(e) => onUpdate(step.id, "status", e.target.value)}
          >
            {STEP_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusObj.color}`}>
            {statusObj.label}
          </span>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <input
            className={inputCls}
            placeholder="Notas adicionales para esta fase..."
            value={step.notes}
            onChange={(e) => onUpdate(step.id, "notes", e.target.value)}
          />
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(step.id)}
        className="size-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all shrink-0 mt-0.5"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
}

export default function ExecutionSteps({ steps, onUpdate, onAdd, onRemove, onMove, totalHours }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-[#004851] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
          Fases de Ejecución
          <span className="ml-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {steps.length} fases · {totalHours}h
          </span>
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#004851] text-white text-[11px] font-bold rounded-lg hover:bg-[#003036] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Agregar fase
        </button>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <StepRow
            key={step.id}
            step={step}
            index={index}
            total={steps.length}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMove={onMove}
          />
        ))}
      </div>

      {steps.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <span className="material-symbols-outlined text-[36px] block mb-2">list_alt</span>
          <p className="text-xs font-bold">No hay fases aún. Agrega la primera.</p>
        </div>
      )}
    </div>
  );
}
