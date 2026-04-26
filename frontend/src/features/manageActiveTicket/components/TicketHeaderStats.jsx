export default function TicketHeaderStats({ ticket }) {
  return (
    <div className="max-w-[1200px] mx-auto w-full mb-6">
      {/* Breadcrumbs & Focus Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
            <span>Work Space</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>Tickets</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-[var(--md-primary-container)]">TK-2024-089</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-[#003036] tracking-tight">Detalle de Ticket de Mantenimiento</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-[var(--md-primary-container)] shadow-sm hover:shadow-md transition-all active:scale-95">
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Subir Evidencia
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[var(--md-primary-container)] text-white rounded-xl font-bold text-xs shadow-lg shadow-teal-900/20 hover:bg-[#003036] transition-all active:scale-95">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Finalizar Tarea
          </button>
        </div>
      </div>

      {/* Header Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID de Ticket</p>
          <p className="text-lg font-black text-[var(--md-primary-container)]">{ticket.id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estado</p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-bold">{ticket.status}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Prioridad</p>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full">
            <span className="material-symbols-outlined text-[12px]">priority_high</span>
            <span className="text-[10px] font-bold uppercase">{ticket.priority}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Categoría</p>
          <p className="text-sm font-bold text-slate-800">{ticket.category}</p>
        </div>
      </div>
    </div>
  );
}
