import { BUDGET_CATEGORIES } from "../utils/mockPlanData";

const inputCls = "w-full px-2.5 py-1.5 text-[11px] font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004851] focus:ring-1 focus:ring-[#004851]/10 transition-all placeholder:text-slate-300 text-slate-700";

function BudgetRow({ item, onUpdate, onRemove }) {
  const lineTotal = item.qty * item.unitCost;
  return (
    <tr className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <td className="py-2 px-3">
        <select
          className={inputCls}
          value={item.category}
          onChange={(e) => onUpdate(item.id, "category", e.target.value)}
        >
          {BUDGET_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </td>
      <td className="py-2 px-3">
        <input
          className={inputCls}
          placeholder="Descripción del ítem..."
          value={item.description}
          onChange={(e) => onUpdate(item.id, "description", e.target.value)}
        />
      </td>
      <td className="py-2 px-3 w-20">
        <input
          type="number"
          min={1}
          className={inputCls}
          value={item.qty}
          onChange={(e) => onUpdate(item.id, "qty", e.target.value)}
        />
      </td>
      <td className="py-2 px-3 w-28">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">$</span>
          <input
            type="number"
            min={0}
            className={`${inputCls} pl-5`}
            value={item.unitCost}
            onChange={(e) => onUpdate(item.id, "unitCost", e.target.value)}
          />
        </div>
      </td>
      <td className="py-2 px-3 w-28 text-right">
        <span className="text-[11px] font-black text-[#004851]">
          ${lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </td>
      <td className="py-2 px-2 w-8">
        <button
          onClick={() => onRemove(item.id)}
          className="size-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      </td>
    </tr>
  );
}

function TotalRow({ label, value, bold = false, highlight = false }) {
  return (
    <tr className={highlight ? "bg-[#004851]/5" : ""}>
      <td colSpan={4} className="px-3 py-1.5 text-right">
        <span className={`text-[10px] uppercase tracking-widest font-bold ${highlight ? "text-[#004851]" : "text-slate-400"}`}>
          {label}
        </span>
      </td>
      <td className="px-3 py-1.5 text-right">
        <span className={`font-black ${highlight ? "text-[#004851] text-sm" : "text-[11px] text-slate-700"}`}>
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </td>
      <td />
    </tr>
  );
}

export default function BudgetEstimator({ items, subtotal, contingency, grandTotal, onUpdate, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-[#004851] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          Estimación de Costos
          <span className="ml-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {items.length} ítems
          </span>
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#004851] text-white text-[11px] font-bold rounded-lg hover:bg-[#003036] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Agregar ítem
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Categoría", "Descripción", "Cant.", "Costo Unit.", "Total", ""].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <BudgetRow key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 text-xs">
                  Agrega el primer ítem de costo.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t border-slate-100">
            <TotalRow label="Subtotal" value={subtotal} />
            <TotalRow label="Contingencia (10%)" value={contingency} />
            <TotalRow label="Total Estimado (USD)" value={grandTotal} bold highlight />
          </tfoot>
        </table>
      </div>
    </div>
  );
}
