import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, technician, onConfirm }) {
  if (!isOpen || !technician) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in mx-4">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle size={24} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-900 mb-2">Eliminar Técnico</h3>
        <p className="text-sm text-slate-500 mb-6">
          ¿Estás seguro que deseas eliminar a <strong className="text-slate-700">{technician.name}</strong> del sistema? Esta acción no se puede deshacer.
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              onConfirm(technician.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
