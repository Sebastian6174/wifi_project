import { Edit2, Trash2 } from 'lucide-react';
import { STATUS_LABELS } from '../utils/mockTechnicians';

export default function TechnicianList({ technicians, onEdit, onDelete }) {
  return (
    <div className="glass-panel rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white/70">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Técnico</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Zona de Operación</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Habilidades Clave</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {technicians.map((tech) => {
              const statusConfig = STATUS_LABELS[tech.status] || STATUS_LABELS.inactivo;
              
              return (
                <tr key={tech.id} className="hover:bg-white/80 transition-colors group">
                  
                  {/* Avatar & Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden flex-shrink-0">
                        {tech.avatar ? (
                          <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[var(--md-primary-container)] font-bold text-xs">{tech.initials || tech.name.substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{tech.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {tech.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Zone */}
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {tech.zone}
                  </td>

                  {/* Skills */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {tech.skills?.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold tracking-wide">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${statusConfig.color}`}>
                      {statusConfig.text}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(tech)}
                        className="p-1.5 text-slate-400 hover:text-[var(--md-primary-container)] hover:bg-[var(--md-primary-container)]/10 rounded transition-colors" 
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(tech)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Basic summary footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center text-xs font-semibold text-slate-500">
        <span>Mostrando {technicians.length} técnicos registrados</span>
      </div>
    </div>
  );
}
