export default function TicketDetailsLeft({ ticket }) {
  return (
    <div className="lg:col-span-7 space-y-4">
      {/* Technician Profile */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm border border-slate-200/50 bg-white/60">
        <h3 className="text-sm font-bold text-[var(--md-primary-container)] mb-4 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">engineering</span>
          Responsable
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden ring-4 ring-teal-50">
            <img alt={ticket.technician.name} className="w-full h-full object-cover" src={ticket.technician.image} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{ticket.technician.name}</h4>
            <p className="text-[11px] text-slate-500 font-medium">{ticket.technician.role}</p>
            <div className="flex gap-1.5 mt-1.5">
              <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">ID: {ticket.technician.id}</span>
              {ticket.technician.certs.map(cert => (
                 <span key={cert} className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">CERT: {cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Description */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
        <h3 className="text-sm font-bold text-[var(--md-primary-container)] mb-3">Descripción del Incidente</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {ticket.incident.description}
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
        <h3 className="text-sm font-bold text-[var(--md-primary-container)] mb-3">Acciones Requeridas</h3>
        <div className="space-y-2.5">
          {ticket.checklist.map((item) => (
             <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${item.isCompleted ? 'border-[var(--md-primary-container)] bg-teal-50/50 hover:bg-teal-50' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input 
                type="checkbox" 
                defaultChecked={item.isCompleted} 
                className="w-4 h-4 rounded text-[var(--md-primary-container)] focus:ring-[var(--md-primary-container)] border-slate-300"
              />
              <span className={`text-xs font-semibold ${item.isCompleted ? 'text-[var(--md-primary-container)] line-through opacity-70' : 'text-slate-700'}`}>
                {item.task}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
