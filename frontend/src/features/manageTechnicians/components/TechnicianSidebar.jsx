import { useForm } from "react-hook-form";
import { Camera, X, Save } from "lucide-react";

export default function TechnicianSidebar({
  isOpen,
  onClose,
  technician,
  onSave,
}) {
  // Simple form setup for demo purposes
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar surface */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-[var(--md-primary-container)]">
              {isEditing ? "Editar Técnico" : "Añadir Nuevo Técnico"}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing
                ? `ID: ${technician.id}`
                : "Complete los datos para registrar"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Photo Upload area */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-[var(--md-primary-container)] group transition-colors overflow-hidden">
              {technician?.avatar ? (
                <img
                  src={technician.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-[var(--md-primary-container)]">
                  <Camera size={24} />
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Cambiar Foto
            </span>
          </div>

          <form
            id="tech-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: true })}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] focus:ring-1 focus:ring-[var(--md-primary-container)] outline-none text-sm transition-all"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teléfono Móvil
                </label>
                <input
                  {...register("phone")}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] focus:ring-1 focus:ring-[var(--md-primary-container)] outline-none text-sm transition-all"
                  placeholder="300 000 0000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] focus:ring-1 focus:ring-[var(--md-primary-container)] outline-none text-sm transition-all"
                  placeholder="correo@calitech.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Zona Asignada
              </label>
              <select
                {...register("zone")}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] focus:ring-1 focus:ring-[var(--md-primary-container)] outline-none text-sm transition-all appearance-none"
              >
                <option value="Cali Norte">Cali Norte</option>
                <option value="Cali Sur">Cali Sur</option>
                <option value="Cali Oriente">Cali Oriente</option>
                <option value="Cali Occidente">Cali Occidente</option>
                <option value="Corregimientos">Corregimientos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Turno de Trabajo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["mañana", "tarde", "noche"].map((t) => (
                  <label
                    key={t}
                    className="flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 has-[:checked]:bg-[var(--md-primary-container)]/10 has-[:checked]:border-[var(--md-primary-container)] transition-colors"
                  >
                    <input
                      type="radio"
                      value={t}
                      {...register("shift")}
                      className="sr-only"
                    />
                    <span className="text-xs font-semibold text-slate-600 capitalize">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estado
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:border-[var(--md-primary-container)] outline-none text-sm"
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
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="tech-form"
            className="px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm hover:opacity-90 flex items-center gap-2 transition-opacity"
            style={{ backgroundColor: "var(--md-primary-container)" }}
          >
            <Save size={16} />
            {isEditing ? "Guardar Cambios" : "Registrar Técnico"}
          </button>
        </div>
      </div>
    </div>
  );
}
