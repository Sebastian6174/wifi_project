/**
 * TicketCard.jsx  (<= 250 lines)
 * Single active-ticket card with severity colouring and technician info.
 * Expandable to show detailed description.
 */

import { useState } from 'react';

const SEVERITY = {
  critical: { border: 'border-red-500',  bg: 'bg-red-50',     text: 'text-red-600',    label: 'bg-red-50 text-red-600' },
  high:     { border: 'border-amber-400',bg: 'bg-amber-50',   text: 'text-amber-600',  label: 'bg-amber-50 text-amber-600' },
  medium:   { border: 'border-blue-400', bg: 'bg-blue-50',    text: 'text-blue-600',   label: 'bg-blue-50 text-blue-600' },
};

const TECH_STATUS_COLORS = {
  'En Route': 'text-emerald-600',
  'On Site':  'text-emerald-600',
  'Assigned': 'text-slate-400',
  'Resolved': 'text-slate-300',
};

export default function TicketCard({ ticket, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY[ticket.severity] ?? SEVERITY.medium;

  return (
    <div
      className={`glass-panel rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer
        ${sev.border}
        ${isSelected ? 'ring-2 ring-[var(--md-primary-container)]/40' : ''}
      `}
      onClick={() => onSelect(ticket.id)}
    >
      {/* Header row */}
      <div className="p-2.5 pb-1.5">
        <div className="flex justify-between items-start mb-1.5">
          <span className={`text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded ${sev.label}`}>
            {ticket.label}
          </span>
          <span className="text-[9px] text-slate-400">{ticket.ago}</span>
        </div>

        <h4 className="font-bold text-xs leading-tight mb-1" style={{ color: 'var(--md-primary-container)' }}>
          {ticket.title}
        </h4>

        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="material-symbols-outlined text-[12px]">location_on</span>
          {ticket.location} · {ticket.apId}
        </div>
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div className="px-2.5 pb-1.5">
          <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{ticket.description}</p>
          <div className="flex gap-3 mt-1.5 text-[10px]">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-[11px]">person_alert</span>
              {ticket.affectedUsers} users affected
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-[11px]">tag</span>
              {ticket.id}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-2.5 py-1.5 border-t border-slate-100 flex justify-between items-center">
        {!ticket.technician ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onSelect(ticket.id, true); }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[12px]">warning</span>
            <span className="text-[9px] font-bold uppercase tracking-wide">Sin Asignar - Forzar</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="size-4 rounded-full bg-[var(--md-primary-container)]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[10px]" style={{ color: 'var(--md-primary-container)' }}>person</span>
            </div>
            <span className="text-[10px] font-medium text-slate-600 truncate max-w-[80px]">
              {ticket.technician.name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {ticket.technician ? (
            <span className={`text-[9px] font-bold flex items-center gap-0.5 ${TECH_STATUS_COLORS[ticket.technician.status] ?? 'text-slate-400'}`}>
              {ticket.technician.status}
              <span className="material-symbols-outlined text-[11px]">{ticket.technician.statusIcon}</span>
            </span>
          ) : (
            <span className="text-[9px] font-bold text-amber-500">
              Requiere Acción
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-[10px] text-slate-400 hover:text-[var(--md-primary-container)] transition-colors"
            aria-label="Ver detalles del ticket"
          >
            <span className="material-symbols-outlined text-[14px]">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
