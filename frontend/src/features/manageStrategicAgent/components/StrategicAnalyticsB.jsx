import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import InfoTooltip from "@/shared/components/InfoTooltip";
import { useStrategicMetrics } from "../hooks/useStrategicMetrics";
import { Loader2 } from "lucide-react";

// ── Shared AI Button ──────────────────────────────────────────────────────────
function AIInsightButton({ insight }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-[#004851] bg-[#004851]/8 hover:bg-[#004851]/15 border border-[#004851]/20 transition-all active:scale-95"
        title="Interpretar con IA"
      >
        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        <span>IA</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-72 rounded-2xl shadow-xl border border-[#004851]/15 bg-white p-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-[#004851] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </span>
            <p className="text-[10px] font-black text-[#003036] uppercase tracking-wider">Análisis IA</p>
            <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{insight}</p>
        </div>
      )}
    </div>
  );
}

function LoadingCard({ className = "col-span-12 lg:col-span-6" }) {
  return (
    <Card className={`${className} flex items-center justify-center h-48 border-slate-200`}>
      <Loader2 className="animate-spin text-[#004851]" />
    </Card>
  );
}

const PIE_COLORS = ["#004851", "#006d7a", "#0091a3", "#33a7b5", "#66bdc7", "#99d3d9"];

// ── Panel 5 — Distribución de Eventos ──────────────────────────────────────────
export function EventTypeDistributionCard() {
  const { eventTypeDistribution, loading } = useStrategicMetrics();

  const insight = `La distribución de eventos muestra una mayor prevalencia de "${eventTypeDistribution[0]?.name || "N/A"}". Esto permite entender si la red está siendo utilizada principalmente para nuevas conexiones o si hay un alto volumen de re-autenticaciones, lo cual podría indicar inestabilidad en el portal cautivo.`;

  if (loading) return <LoadingCard className="col-span-12 lg:col-span-4" />;

  return (
    <Card className="col-span-12 lg:col-span-4 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f0fdfa" }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: "#0d9488" }}>pie_chart</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Distribución de Eventos</CardTitle>
            <InfoTooltip title="Tipos de Eventos" text="Desglose porcentual de las categorías de logs generados por la red (autenticación, asociación, etc.). Permite identificar el comportamiento técnico predominante." />
          </div>
          <AIInsightButton insight={insight} />
        </div>
        <CardDescription className="text-[10px] mt-1">Proporción por tipo de evento (network_events_curated)</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={eventTypeDistribution}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {eventTypeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              formatter={(v) => [`${v} eventos`, "Cantidad"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
          {eventTypeDistribution.slice(0, 4).map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
              <p className="text-[9px] text-slate-500 font-bold truncate uppercase tracking-tighter">{entry.name}</p>
              <p className="text-[9px] text-slate-400 ml-auto">{entry.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Panel 6 — Top 10 AP por Clientes ──────────────────────────────────────────
export function TopAPsByClientsCard() {
  const { top10APsByClients, loading } = useStrategicMetrics();

  const insight = `El AP "${top10APsByClients[0]?.name || "N/A"}" es el líder en captación de usuarios con ${top10APsByClients[0]?.clients.toLocaleString() || 0} clientes reportados. Se recomienda verificar si este alto volumen se traduce en consumo real o si son conexiones efímeras que saturan el canal sin generar valor.`;

  if (loading) return <LoadingCard className="col-span-12 lg:col-span-6" />;

  return (
    <Card className="col-span-12 lg:col-span-6 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f1f5f9" }}>
              <span className="material-symbols-outlined text-[16px] text-slate-500">groups</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Top 10 AP por Clientes Reportados</CardTitle>
            <InfoTooltip title="Top APs por Clientes" text="Identifica los 10 puntos de acceso con mayor cantidad de clientes únicos conectados. Ayuda a detectar los nodos de mayor tráfico humano en la red." />
          </div>
          <AIInsightButton insight={insight} />
        </div>
        <CardDescription className="text-[10px] mt-1">Nombres de AP con mayor volumen de usuarios</CardDescription>
      </CardHeader>
      <CardContent>
        {top10APsByClients.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-10">Sin datos de APs disponibles</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={top10APsByClients} layout="vertical" barSize={12}>
              <CartesianGrid horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip 
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
                formatter={(v) => [`${v} clientes`, "Total Clientes"]}
              />
              <Bar dataKey="clients" radius={[0, 4, 4, 0]} fill="#004851">
                {top10APsByClients.map((_, idx) => (
                  <Cell key={idx} fill={idx < 3 ? "#004851" : "#94a3b8"} opacity={1 - idx * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── Panel 6 — Top 10 AP por Uso (MB) ──────────────────────────────────────────
export function TopAPsByUsageCard() {
  const { top10APsByUsage, loading } = useStrategicMetrics();

  const insight = `El AP "${top10APsByUsage[0]?.name || "N/A"}" genera la mayor carga de tráfico con ${(top10APsByUsage[0]?.usage / 1024 || 0).toFixed(1)} GB acumulados. Esto confirma que es un nodo crítico para la infraestructura de datos y debe priorizarse en cualquier plan de mantenimiento preventivo.`;

  if (loading) return <LoadingCard className="col-span-12 lg:col-span-6" />;

  return (
    <Card className="col-span-12 lg:col-span-6 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f1f5f9" }}>
              <span className="material-symbols-outlined text-[16px] text-slate-500">database</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Top 10 AP por Uso Acumulado (MB)</CardTitle>
            <InfoTooltip title="Top APs por Uso" text="Muestra los 10 puntos de acceso que han gestionado la mayor cantidad de datos en MB. Crucial para identificar nodos de alta demanda de ancho de banda." />
          </div>
          <AIInsightButton insight={insight} />
        </div>
        <CardDescription className="text-[10px] mt-1">Nombres de AP con mayor consumo de datos</CardDescription>
      </CardHeader>
      <CardContent>
        {top10APsByUsage.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-10">Sin datos de uso disponibles</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={top10APsByUsage} layout="vertical" barSize={12}>
              <CartesianGrid horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip 
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
                formatter={(v) => [`${v.toFixed(1)} MB`, "Uso Total"]}
              />
              <Bar dataKey="usage" radius={[0, 4, 4, 0]} fill="#004851">
                {top10APsByUsage.map((_, idx) => (
                  <Cell key={idx} fill={idx < 3 ? "#004851" : "#94a3b8"} opacity={1 - idx * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
