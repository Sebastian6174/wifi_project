import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";
import { useStrategicMetrics } from "../hooks/useStrategicMetrics";
import { Loader2 } from "lucide-react";
import InfoTooltip from "@/shared/components/InfoTooltip";

export default function StrategicKPIs() {
  const { clients, hourlyMetrics, apStatusSummary, loading, error } = useStrategicMetrics();

  if (loading) return (
    <div className="col-span-12 flex justify-center py-10">
      <Loader2 className="animate-spin text-[#004851]" />
    </div>
  );

  // Calculations
  const totalUsage = clients.reduce((acc, c) => acc + (c.usage_mb || 0), 0);
  const activeUsers = hourlyMetrics.reduce((acc, h) => acc + (h.unique_clients || 0), 0);

  // Chart data for traffic widget
  const trafficData = hourlyMetrics.slice(-10).map((h, i) => ({
    name: `H${i}`,
    traffic: h.total_connections * 1.5, // Proxy for traffic trend
  }));

  return (
    <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Traffic Chart Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tráfico Estimado</h4>
            <InfoTooltip title="Tráfico Estimado" text="Volumen proyectado de datos gestionados en la red WiFi basado en las conexiones actuales y el historial de consumo." />
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#004851]">signal_cellular_alt</span>
        </div>
        
        <div className="h-16 mb-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData}>
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)', fontSize: '9px', fontWeight: 'bold' }} 
              />
              <Bar dataKey="traffic" fill="#004851" radius={[3, 3, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="text-2xl font-black text-[#004851] leading-none tracking-tight">{(totalUsage / 1024).toFixed(1)} <span className="text-sm">GB</span></span>
          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">Real-time</span>
        </div>
      </div>

      {/* Active Users Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between items-center relative overflow-hidden">
        <div className="w-full flex items-center justify-between mb-1 z-10">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Usuarios Únicos</h4>
            <InfoTooltip title="Usuarios Únicos" text="Cantidad de clientes distintos que se han conectado a la infraestructura WiFi en la última hora reportada." />
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#004851]">group</span>
        </div>
        
        <div className="relative h-20 w-20 flex items-center justify-center my-2 z-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" fill="transparent" r="32" stroke="#f1f5f9" strokeWidth="8"></circle>
            <circle cx="50%" cy="50%" fill="transparent" r="32" stroke="#004851" strokeDasharray="201" strokeDashoffset={201 - (201 * Math.min(activeUsers/1000, 1))} strokeWidth="8" className="drop-shadow-sm transition-all duration-1000 ease-out"></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-black text-[#004851] -mb-1 tracking-tight">{activeUsers > 1000 ? `${(activeUsers/1000).toFixed(1)}k` : activeUsers}</span>
          </div>
        </div>
        
        <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-wider z-10">Visto en la última hora</p>
      </div>

      {/* AP Status Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado de Puntos de Acceso</h4>
            <InfoTooltip title="Estado de APs" text="Resumen operativo de los puntos de acceso desplegados. Clasificados por su estado de conexión en tiempo real." />
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#004851]">router</span>
        </div>
        
        <div className="space-y-2 flex-1 flex flex-col justify-center">
          {apStatusSummary.length > 0 ? (
            apStatusSummary.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      item.name.toLowerCase() === 'online' ? 'bg-emerald-500' : 
                      item.name.toLowerCase() === 'offline' ? 'bg-rose-500' : 'bg-slate-300'
                    }`} 
                  />
                  <span className="text-xs font-bold text-slate-700 capitalize">{item.name}</span>
                </div>
                <span className="text-sm font-black text-[#003036]">{item.name.toLowerCase() === 'online' ? `${item.value}/${apStatusSummary.reduce((a,b)=>a+b.value,0)}` : item.value}</span>
              </div>
            ))
          ) : (
             <p className="text-[10px] text-slate-400 font-bold text-center">No hay datos de APs</p>
          )}
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2 border-t border-slate-50 pt-2 text-center">Inventario total de infraestructura</p>
      </div>

      {/* Device Diversity Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dispositivos Top</h4>
            <InfoTooltip title="Dispositivos Top" text="Principales tipos de dispositivos y sistemas operativos que están consumiendo recursos de red actualmente." />
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#004851] p-1 bg-teal-50 rounded-md">devices</span>
        </div>
        
        <div className="flex flex-col gap-2">
          {Array.from(new Set(clients.map(c => c.device_type))).slice(0, 3).map((type, idx) => (
            <div key={type} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-[100px]">{type || "Unknown"}</span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${idx === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                {idx === 0 ? 'Líder' : 'Activo'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
