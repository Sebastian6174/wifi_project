import { MOCK_TICKET_HISTORY } from "../utils/mockHistoryData";

export default function TicketHistoryTable() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-[var(--md-primary-container)]">Historial de Intervenciones</h3>
        <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[var(--md-primary-container)] transition-colors">
          Descargar XLSX
        </button>
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
          <tbody className="divide-y divide-slate-100">
            {MOCK_TICKET_HISTORY.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td className="px-5 py-3">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[var(--md-primary-container)] transition-colors">{ticket.id}</p>
                  <p className="text-[9px] text-slate-400 font-medium">{ticket.date}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                    <span className="text-[11px] font-semibold text-slate-700">{ticket.location}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[11px] font-medium text-slate-600">{ticket.category}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider border ${ticket.statusBadge}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-[11px] font-bold text-slate-800">{ticket.duration}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
