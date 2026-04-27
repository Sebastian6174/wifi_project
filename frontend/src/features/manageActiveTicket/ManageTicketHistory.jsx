import TechnicianLayout from "./components/TechnicianLayout";
import TicketHistoryTable from "./components/TicketHistoryTable";

export default function ManageTicketHistory() {
  return (
    <TechnicianLayout>
      <div className="animate-fade-in relative z-10 w-full h-full pb-20 md:pb-6">
        <div className="max-w-[1200px] mx-auto w-full">
          
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
              <span>Work Space</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-[var(--md-primary-container)]">Historial de Tickets</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#003036] tracking-tight">Historial de Mantenimiento</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Revisa tus intervenciones pasadas y el rendimiento de la red en Cali.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Intervenciones</p>
              <p className="text-2xl font-black text-[var(--md-primary-container)]">42</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tiempos Promedio</p>
              <p className="text-2xl font-black text-[#7c5800]">2.5h</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm border-l-4 border-l-emerald-500">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">SLA Compliance</p>
              <p className="text-2xl font-black text-emerald-600">98%</p>
            </div>
          </div>

          <TicketHistoryTable />

        </div>
      </div>
    </TechnicianLayout>
  );
}
