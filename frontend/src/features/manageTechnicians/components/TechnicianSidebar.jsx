import { useForm } from 'react-hook-form';
import { Camera, X, Save } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function TechnicianSidebar({
  isOpen,
  onClose,
  technician,
  onSave,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: technician || {},
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  const isEditing = !!technician;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar surface */}
      <div className="relative w-full max-w-sm bg-white h-screen flex flex-col border-l border-slate-200 animate-slide-in-right shadow-xl">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-[var(--md-primary-container)]">
              {isEditing ? "Editar Técnico" : "Añadir Técnico"}
            </h2>
            <p className="text-[10px] text-slate-500">
              {isEditing ? `ID: ${technician.id}` : "Complete los datos"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body - Tighter to avoid scroll */}
        <div className="flex-1 overflow-hidden p-5 space-y-4">
          {/* Photo Upload area */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-[var(--md-primary-container)] group transition-colors overflow-hidden">
              {technician?.avatar ? (
                <img
                  src={technician.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-[var(--md-primary-container)]">
                  <Camera size={18} />
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Foto
            </span>
          </div>

          <form
            id="tech-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] outline-none text-xs transition-colors"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                  Móvil
                </label>
                <input
                  {...register("phone")}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] outline-none text-xs transition-colors"
                  placeholder="300 000 0000"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                  Correo Electrónico
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] outline-none text-xs transition-colors"
                  placeholder="correo@calitech.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                Zona Asignada
              </label>
              <select
                {...register("zone")}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] outline-none text-xs transition-colors appearance-none"
              >
                <option value="Cali Norte">Cali Norte</option>
                <option value="Cali Sur">Cali Sur</option>
                <option value="Cali Oriente">Cali Oriente</option>
                <option value="Cali Occidente">Cali Occidente</option>
                <option value="Corregimientos">Corregimientos</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Turno de Trabajo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["mañana", "tarde", "noche"].map((t) => (
                  <label
                    key={t}
                    className="flex items-center justify-center py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 has-[:checked]:bg-[var(--md-primary-container)]/10 has-[:checked]:border-[var(--md-primary-container)] transition-colors"
                  >
                    <input
                      type="radio"
                      value={t}
                      {...register("shift")}
                      className="sr-only"
                    />
                    <span className="text-[10px] font-bold text-slate-600 capitalize">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                Estado
              </label>
              <select
                {...register("status")}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] outline-none text-xs transition-colors"
              >
                <option value="activo">Activo</option>
                <option value="en_campo">En Campo</option>
                <option value="descanso">Descanso</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="tech-form"
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 flex items-center gap-1.5 transition-opacity"
            style={{ backgroundColor: "var(--md-primary-container)" }}
          >
            <Save size={14} />
            {isEditing ? "Guardar" : "Registrar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
