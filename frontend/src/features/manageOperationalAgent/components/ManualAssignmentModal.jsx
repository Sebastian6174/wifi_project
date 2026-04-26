import { createPortal } from 'react-dom';
import { AlertTriangle, MapPin, X, CheckCircle2 } from 'lucide-react';
import { MOCK_TECHNICIANS, STATUS_LABELS } from '../../manageTechnicians/utils/mockTechnicians';

export default function ManualAssignmentModal({ isOpen, onClose, ticket, onAssign }) {
  if (!isOpen || !ticket) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between bg-white relative">
          <div className="flex gap-3">
            <div className="mt-1 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                Asignación Manual Requerida
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ticket <span className="font-bold">{ticket.id}</span> • {ticket.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Reason Panel */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
            Diagnóstico del Orquestador
          </p>
          <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-amber-400 pl-3">
            {ticket.reasonNotAssigned || "El sistema no encontró técnicos activos con los skills apropiados en un radio cercano."}
          </p>
        </div>

        <div className="px-5 py-4 flex-1">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--md-primary-container)]" />
            Técnicos Cercanos / Disponibles
          </p>
          
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {MOCK_TECHNICIANS.map(tech => {
              const statusColors = STATUS_LABELS[tech.status] || STATUS_LABELS.inactivo;
              return (
                <div key={tech.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                      {tech.avatar ? (
                        <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--md-primary-container)] font-bold text-[10px]">
                          {tech.initials || tech.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{tech.name}</p>
                      <div className="flex gap-1.5 mt-0.5 items-center">
                        <span className="text-[9px] text-slate-500 font-medium">Zona: {tech.zone}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`text-[9px] font-bold px-1.5 rounded-sm ${statusColors.color}`}>
                          {statusColors.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      onAssign(tech);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold text-[var(--md-primary-container)] bg-[var(--md-primary-container)]/10 hover:bg-[var(--md-primary-container)] hover:text-white transition-colors"
                  >
                    <CheckCircle2 size={12} />
                    Forzar Asignación
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
