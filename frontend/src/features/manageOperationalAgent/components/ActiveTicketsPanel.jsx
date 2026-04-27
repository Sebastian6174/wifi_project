/**
 * ActiveTicketsPanel.jsx  (<= 250 lines)
 * Scrollable sidebar panel listing all active work-order tickets.
 */

import { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import ManualAssignmentModal from './ManualAssignmentModal';

const SEVERITY_FILTER = ['All', 'critical', 'high', 'medium'];

export default function ActiveTicketsPanel({ tickets: initialTickets = [] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('All');
  
  const [ticketToAssign, setTicketToAssign] = useState(null);

  // Sync props just in case
  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const filtered = severityFilter === 'All'
    ? tickets
    : tickets.filter(t => t.severity === severityFilter);

  const handleSelect = (id, forceAssign) => {
    if (forceAssign) {
      const tkt = tickets.find(t => t.id === id);
      setTicketToAssign(tkt);
      return;
    }
    setSelected(prev => (prev === id ? null : id));
  };

  const handleForceAssign = (technician) => {
    if (!ticketToAssign) return;
    // Map the selected technician to the ticket payload
    setTickets(prev => prev.map(t => {
      if (t.id === ticketToAssign.id) {
        return {
          ...t,
          technician: {
            name: technician.name,
            status: 'Assigned',
            statusIcon: 'schedule'
          }
        };
      }
      return t;
    }));
    setTicketToAssign(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Panel header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[var(--md-primary-container)]">confirmation_number</span>
            <h3 className="text-base font-bold text-slate-800">
              Active Tickets
            </h3>
            <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--md-primary-container)]/10 text-[var(--md-primary-container)]">
              Live · {tickets.length}
            </span>
          </div>

          {/* Severity filter (Horizontal) */}
          <div className="hidden sm:flex gap-1 border-l border-slate-200 pl-4">
            {SEVERITY_FILTER.map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`text-[10px] font-bold capitalize px-3 py-1 rounded-full transition-colors ${
                  severityFilter === s
                    ? 'bg-[var(--md-primary-container)] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {s === 'All' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sm:hidden flex gap-1 flex-wrap">
        {SEVERITY_FILTER.map(s => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`text-[10px] font-bold capitalize px-3 py-1 rounded-full transition-colors ${
              severityFilter === s
                ? 'bg-[var(--md-primary-container)] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {s === 'All' ? 'Todos' : s}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl mb-3">check_circle</span>
            <span className="text-sm font-medium">No tickets for this filter</span>
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

      <ManualAssignmentModal 
        isOpen={!!ticketToAssign}
        ticket={ticketToAssign}
        onClose={() => setTicketToAssign(null)}
        onAssign={handleForceAssign}
      />
    </div>
  );
}
