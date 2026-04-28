import { useStrategicData } from "../hooks/useStrategicData";
import { Loader2 } from "lucide-react";

export default function StrategicActionTable() {
  const { actionTable: ACTION_TABLE_DATA, loading, error } = useStrategicData();

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center border border-slate-200 shadow-sm mb-6">
        <Loader2 className="size-6 text-[#004851] animate-spin mb-2" />
        <p className="text-xs font-bold text-slate-500">Cargando acciones...</p>
      </div>
    );
  }

  if (error) return null; // Silence error or show something minor

  return (
    <section className="bg-white rounded-3xl overflow-hidden mb-6 border border-slate-200 shadow-sm flex flex-col">
      <div className="p-4 lg:p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-base font-bold text-[var(--md-primary-container)]">Investment & Maintenance Actions</h3>
        <button className="flex items-center gap-1.5 text-[var(--md-primary-container)] font-bold text-[11px] px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <span>Export Report</span>
          <span className="material-symbols-outlined text-[16px]">download</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Commune / Sector</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Proposed Action</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Est. Cost</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Infrastructure Impact</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ACTION_TABLE_DATA.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 border-b border-slate-50 transition-colors">
                <td className="px-5 py-3 group">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[var(--md-primary-container)] transition-colors">{row.commune}</p>
                  <p className="text-[9px] text-slate-400 font-medium tracking-wide">{row.sector}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-teal-600 text-[14px] bg-teal-50 p-1 rounded-md">{row.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{row.action}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-black text-xs text-[var(--md-primary-container)]">{row.cost}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className={`h-1 w-5 rounded-full ${step <= row.impact ? 'bg-[var(--md-primary-container)]' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider ${row.statusBadge}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
