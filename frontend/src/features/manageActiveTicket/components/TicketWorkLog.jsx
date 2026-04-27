export default function TicketWorkLog({ worklog }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mt-4">
      <h3 className="text-sm font-bold text-[var(--md-primary-container)] mb-5">Work Log</h3>
      <div className="space-y-5 relative before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
        {worklog.map((log) => (
          <div key={log.id} className="relative pl-8">
            <div className={`absolute left-0 top-0.5 w-5 h-5 rounded-full border-[3px] border-white shadow-sm z-10 ${log.isDone ? 'bg-[var(--md-primary-container)]' : 'bg-slate-200'}`} />
            
            <div className="flex justify-between items-start mb-0.5">
              <p className="text-xs font-bold text-slate-800 tracking-tight">{log.title}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{log.timeAgo}</p>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{log.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
