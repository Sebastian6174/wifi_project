import { exportCSV, exportJSON, printPlan } from "../utils/exportHelpers";

export default function ExportActions({ meta, steps, budgetItems, grandTotal }) {
  const actions = [
    {
      id: "csv",
      label: "Descargar CSV",
      sub: "Plan completo de trabajo",
      icon: "table_view",
      color: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700",
      iconBg: "bg-emerald-50 text-emerald-600",
      onClick: () => exportCSV({ meta, steps, budgetItems }),
    },
    {
      id: "json",
      label: "Exportar JSON",
      sub: "Para herramientas externas",
      icon: "data_object",
      color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700",
      iconBg: "bg-blue-50 text-blue-600",
      onClick: () => exportJSON({ meta, steps, budgetItems }),
    },
    {
      id: "print",
      label: "Resumen Ejecutivo",
      sub: "Imprimir o guardar PDF",
      icon: "print",
      color: "border-[#004851]/30 hover:border-[#004851] hover:bg-[#004851]/5 text-[#004851]",
      iconBg: "bg-[#e6f5f7] text-[#004851]",
      onClick: printPlan,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
      <h2 className="text-sm font-black text-[#004851] flex items-center gap-2 mb-4">
        <span
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          download
        </span>
        Exportar Plan
      </h2>

      {/* Summary mini card */}
      <div className="mb-4 p-3 rounded-xl bg-[#004851]/5 border border-[#004851]/10 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fases</p>
          <p className="text-lg font-black text-[#004851]">{steps.length}</p>
        </div>
        <div className="text-center border-x border-[#004851]/10">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Horas</p>
          <p className="text-lg font-black text-[#004851]">
            {steps.reduce((a, s) => a + Number(s.hours || 0), 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Presup.</p>
          <p className="text-base font-black text-[#004851] leading-tight">
            ${Math.round(grandTotal).toLocaleString("en-US")}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-[0.98] text-left ${action.color}`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${action.iconBg}`}>
              <span
                className="material-symbols-outlined text-[16px] block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {action.icon}
              </span>
            </div>
            <div>
              <p className="text-xs font-black">{action.label}</p>
              <p className="text-[9px] font-medium opacity-70">{action.sub}</p>
            </div>
            <span className="material-symbols-outlined text-[16px] ml-auto opacity-30">
              arrow_forward
            </span>
          </button>
        ))}
      </div>

      <p className="text-[9px] text-slate-400 font-medium text-center mt-3">
        Todos los archivos se generan localmente — sin envío a servidores externos.
      </p>
    </div>
  );
}
