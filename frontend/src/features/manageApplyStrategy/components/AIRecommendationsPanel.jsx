import { useState } from "react";
import { AI_SUGGESTIONS, PLAN_FOCUS_TYPES } from "../utils/mockPlanData";

export default function AIRecommendationsPanel({ focus, onApplySuggestion }) {
  const [expanded, setExpanded] = useState(true);
  const [applied, setApplied] = useState([]);

  const suggestions = AI_SUGGESTIONS[focus] || AI_SUGGESTIONS.maintenance;
  const focusType = PLAN_FOCUS_TYPES.find((f) => f.id === focus);

  const handleApply = (suggestion) => {
    setApplied((prev) => [...prev, suggestion]);
    onApplySuggestion?.(suggestion);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#004851] text-white rounded-lg">
            <span
              className="material-symbols-outlined text-[14px] block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-black text-[#004851]">Recomendaciones de IA</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Basadas en: {focusType?.label || "Mantenimiento"}
            </p>
          </div>
        </div>
        <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-2 border-t border-slate-100 pt-4">
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">
            Haz clic en una sugerencia para agregarla como nota a la siguiente fase disponible.
          </p>
          {suggestions.map((s, i) => {
            const isApplied = applied.includes(s);
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                  isApplied
                    ? "bg-[#004851]/5 border-[#004851]/20 opacity-60 pointer-events-none"
                    : "border-slate-100 hover:border-teal-200 hover:bg-teal-50/30"
                }`}
                onClick={() => !isApplied && handleApply(s)}
              >
                <span
                  className={`material-symbols-outlined text-[14px] mt-0.5 shrink-0 transition-colors ${
                    isApplied ? "text-emerald-500" : "text-slate-300 group-hover:text-[#004851]"
                  }`}
                >
                  {isApplied ? "check_circle" : "add_circle"}
                </span>
                <p className="text-[11px] font-semibold text-slate-700 leading-snug">{s}</p>
              </div>
            );
          })}

          {/* Internet search hint */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Buscar más recursos
            </p>
            <div className="flex gap-2">
              {[
                { label: "IEEE 802.11", q: "IEEE+802.11+wifi+standards+2024" },
                { label: "ITU Telecom", q: "ITU+municipal+wifi+deployment+guide" },
                { label: "SIETIC Cali", q: "SIETIC+Cali+wifi+infraestructura" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={`https://www.google.com/search?q=${link.q}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-[9px] font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:border-[#004851] hover:text-[#004851] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
