import { useRef, useEffect } from 'react';

export default function NotificationMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Prevent closing if clicking the toggle button itself
      if (e.target.closest('.notif-badge')) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-12 right-6 sm:right-12 w-[320px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in origin-top-right"
    >
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <h3 className="text-xs font-bold tracking-widest uppercase text-slate-800">Notificaciones</h3>
        <span className="bg-[#004851]/10 text-[#004851] px-2 py-0.5 rounded-full text-[10px] font-bold">2 Nuevas</span>
      </div>
      
      <div className="flex flex-col max-h-[400px] overflow-y-auto">
        {/* Admin Notification */}
        <div className="flex gap-3 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
          <div className="size-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-600 text-[16px]">assignment_ind</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-slate-800">Requiere Asignación (Admin)</p>
            <p className="text-[11px] text-slate-600 leading-tight">Ticket crítico en el AP-004 sin técnico asignado. Pérdida de energía reportada.</p>
            <span className="text-[9px] font-bold text-slate-400 mt-1">Hace 2 minutos</span>
          </div>
        </div>

        {/* Technician Notification */}
        <div className="flex gap-3 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-600 text-[16px]">build</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-slate-800">Nuevo Ticket (Técnico)</p>
            <p className="text-[11px] text-slate-600 leading-tight">Se te ha asignado un ticket de alta latencia en Bulevar del Río. Acude al sitio.</p>
            <span className="text-[9px] font-bold text-slate-400 mt-1">Hace 15 minutos</span>
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
        <button className="w-full py-1.5 text-xs font-bold text-[#004851] hover:text-[#001a1d] transition-colors">
          Marcar todas como leídas
        </button>
      </div>
    </div>
  );
}
