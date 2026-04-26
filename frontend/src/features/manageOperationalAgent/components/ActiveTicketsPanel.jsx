/**
 * ActiveTicketsPanel.jsx  (<= 250 lines)
 * Scrollable sidebar panel listing all active work-order tickets.
 */

import { useState } from 'react';
import TicketCard from './TicketCard';

const SEVERITY_FILTER = ['All', 'critical', 'high', 'medium'];

export default function ActiveTicketsPanel({ tickets = [] }) {
  const [selected,       setSelected]       = useState(null);
  const [severityFilter, setSeverityFilter] = useState('All');

  const filtered = severityFilter === 'All'
    ? tickets
    : tickets.filter(t => t.severity === severityFilter);

  const handleSelect = (id) => setSelected(prev => prev === id ? null : id);

  return (
    <aside className="flex flex-col gap-3 h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--md-primary-container)' }}>
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          Active Tickets
        </h3>
        <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--md-primary-container)]/10 text-[var(--md-primary-container)]">
          Live · {tickets.length}
        </span>
      </div>

      {/* Severity filter */}
      <div className="flex gap-1 flex-shrink-0">
        {SEVERITY_FILTER.map(s => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`text-[10px] font-bold capitalize px-2 py-0.5 rounded-full transition-colors ${
              severityFilter === s
                ? 'bg-[var(--md-primary-container)] text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {s === 'All' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm">
            <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
            No tickets for this filter
          </div>
        ) : (
          filtered.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selected === ticket.id}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>
    </aside>
  );
}
