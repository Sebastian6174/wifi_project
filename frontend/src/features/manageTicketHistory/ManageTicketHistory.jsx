import TechnicianLayout from "../manageActiveTicket/components/TechnicianLayout";
import TicketHistoryTable from "./components/TicketHistoryTable";

export default function ManageTicketHistory() {
  return (
    <TechnicianLayout>
      <div className="animate-fade-in relative z-10 w-full h-full pb-20 md:pb-6">
        <div className="max-w-[1200px] mx-auto w-full">
          
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
              <span>Espacio de Trabajo</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-[var(--md-primary-container)]">Bitácora de Mantenimiento</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#003036] tracking-tight">Historial de Tickets</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Consulta el registro histórico de tus intervenciones técnicas en la red pública de Cali.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200/60 bg-white/60">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Impacto Total</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-[var(--md-primary-container)]">42</span>
                <span className="text-[10px] font-bold text-emerald-600 mb-1">Nodos</span>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-200/60 bg-white/60">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tiempo en Sitio</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-[#7c5800]">2.5h</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1">Promedio</span>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-200/60 bg-white/60 ring-1 ring-emerald-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Efectividad</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-emerald-600">98%</span>
                <span className="text-[10px] font-bold text-emerald-400 mb-1">SLA</span>
              </div>
            </div>
          </div>

          <TicketHistoryTable />

        </div>
      </div>
    </TechnicianLayout>
  );
}
