import { MOCK_TICKET_HISTORY } from "../utils/mockHistoryData";

export default function TicketHistoryTable() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm animate-fade-in">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-sm font-bold text-[var(--md-primary-container)]">Historial de Intervenciones</h3>
        <div className="flex gap-2">
          <button className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-[var(--md-primary-container)] hover:text-[var(--md-primary-container)] transition-all">
            Filtrar
          </button>
          <button className="text-[10px] font-bold text-white bg-[var(--md-primary-container)] px-3 py-1.5 rounded-lg hover:bg-[#003036] transition-all">
            Exportar CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID / Fecha</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ubicación</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Duración</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic font-public-sans">
            {MOCK_TICKET_HISTORY.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                <td className="px-5 py-4">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[var(--md-primary-container)] transition-colors not-italic">{ticket.id}</p>
                  <p className="text-[9px] text-slate-400 font-medium not-italic">{ticket.date}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-teal-600">location_on</span>
                    <span className="text-[11px] font-semibold text-slate-700 not-italic">{ticket.location}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[11px] font-medium text-slate-500 not-italic">{ticket.category}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider border ${ticket.statusBadge} not-italic`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-[11px] font-black text-slate-800 not-italic">{ticket.duration}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
