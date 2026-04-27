export default function EmptyTicketState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] max-w-lg mx-auto text-center gap-4 animate-fade-in px-4">
      <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center shadow-inner border border-teal-100 mb-2 group active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-[48px] text-teal-300 animate-bounce transition-all" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>
      <h2 className="text-xl font-black text-[#003036] tracking-tight animate-fade-in delay-150">¡Todo en Orden!</h2>
      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm animate-fade-in delay-300">
        No tienes ningún reporte activo asignado en este momento. La red de Cali fluye a la perfección.
      </p>
      <button className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-[var(--md-primary-container)] shadow-sm hover:bg-slate-50 transition-all active:scale-95">
        <span className="material-symbols-outlined text-[18px]">refresh</span>
        Refrescar Sistema
      </button>
    </div>
  );
}
