import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import InfoTooltip from "@/shared/components/InfoTooltip";
import { useStrategicMetrics } from "../hooks/useStrategicMetrics";
import { Loader2 } from "lucide-react";

// ── Shared AI Button ─────────────────────────────────────────────────────────
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
            <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600 text-[12px]">✕</button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{insight}</p>
        </div>
      )}
    </div>
  );
}

// ── Card skeleton ─────────────────────────────────────────────────────────────
function LoadingCard({ className = "col-span-12 lg:col-span-6" }) {
  return (
    <Card className={`${className} flex items-center justify-center h-48 border-slate-200`}>
      <Loader2 className="animate-spin text-[#004851]" />
    </Card>
  );
}

// ── Panel 1 — Análisis de Eventos de Red ──────────────────────────────────────
export function NetworkEventsAnalysisCard() {
  const { eventsByHour, loading } = useStrategicMetrics();

  if (loading) return <LoadingCard />;

  const totalEvents = eventsByHour.reduce((a, b) => a + b.count, 0);
  const peakHour = [...eventsByHour].sort((a, b) => b.count - a.count)[0]?.hour || "N/A";

  const insight = `Se han registrado un total de ${totalEvents} eventos de red. La hora pico de actividad fue a las ${peakHour}. Los eventos predominantes incluyen asociaciones y desasociaciones, lo que permite identificar patrones de movilidad de los usuarios.`;

  return (
    <Card className="col-span-12 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e6f5f7" }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: "#004851" }}>hub</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Análisis de Eventos de Red</CardTitle>
            <InfoTooltip title="Eventos de Red" text="Distribución horaria de eventos (asociaciones, autenticaciones, etc.) capturados por la infraestructura. Ayuda a entender la carga operativa en diferentes momentos del día." />
          </div>
          <AIInsightButton insight={insight} />
        </div>
        <CardDescription className="text-[10px] mt-1">Cantidad de eventos por hora (network_events_curated)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 mb-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Eventos</p>
            <p className="text-2xl font-black" style={{ color: "#004851" }}>{totalEvents}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hora Pico</p>
            <p className="text-2xl font-black text-slate-700">{peakHour}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={eventsByHour}>
            <CartesianGrid vertical={false} stroke="#f0f4f5" />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-lg">
                      <p className="font-bold text-[#003036] mb-1">{data.hour}</p>
                      <p className="text-[#004851] font-black">{data.count} eventos</p>
                      <div className="mt-1 pt-1 border-t border-slate-100 max-w-[200px]">
                        <p className="text-[9px] text-slate-500 italic truncate"><span className="font-bold">APs:</span> {data.aps}</p>
                        <p className="text-[9px] text-slate-500 italic truncate"><span className="font-bold">Tipos:</span> {data.types}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill="#004851" radius={[3, 3, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[9px] text-slate-400 mt-2 italic">* Datos agrupados por hora a partir de logs de red en tiempo real.</p>
      </CardContent>
    </Card>
  );
}

// ── Panel 2 — Tasa de Abandono ────────────────────────────────────────────────
export function ChurnRateCard() {
  const { hourlyMetrics, avgDisconnectionRate, loading } = useStrategicMetrics();

  const totalDis = hourlyMetrics.reduce((a, h) => a + (h.total_disconnections || 0), 0);
  const totalCon = hourlyMetrics.reduce((a, h) => a + (h.total_connections || 0), 0);
  const churnPct = totalCon > 0 ? ((totalDis / totalCon) * 100).toFixed(1) : 0;

  const chartData = useMemo(
    () => hourlyMetrics.map((h, i) => {
      let horaLabel = `H${i + 1}`;
      if (h.timestamp_hour) {
        const date = new Date(h.timestamp_hour);
        horaLabel = `${date.getHours()}:00`;
      }
      return {
        hora: horaLabel,
        conexiones: h.total_connections || 0,
        desconexiones: h.total_disconnections || 0,
      };
    }),
    [hourlyMetrics]
  );

  const severity = parseFloat(churnPct) > 40 ? "Crítico" : parseFloat(churnPct) > 20 ? "Alto" : "Normal";
  const severityColor = severity === "Crítico" ? "bg-rose-100 text-rose-600" : severity === "Alto" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";

  const insight = `La tasa de abandono actual es del ${churnPct}%, con ${totalDis.toLocaleString()} desconexiones sobre ${totalCon.toLocaleString()} conexiones. ${parseFloat(churnPct) > 30 ? "Este nivel es crítico: la red está desconectando usuarios antes de que puedan consumir datos. Se recomienda revisar la configuración de roaming, interferencias en los canales 2.4GHz/5GHz y el estado físico de los APs con mayor ratio de desconexión." : "El nivel es aceptable. Monitorear tendencia en horas pico."}`;

  if (loading) return <LoadingCard />;

  return (
    <Card className="col-span-12 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fff0e6" }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: "#cc4a00" }}>person_remove</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Tasa de Abandono</CardTitle>
            <InfoTooltip title="Churn Rate" text="Porcentaje de desconexiones sobre el total de conexiones. Un churn alto indica que la red desconecta usuarios antes de que consuman datos, generando la no utilización de forma involuntaria." />
          </div>
          <div className="flex items-center gap-2">
            <AIInsightButton insight={insight} />
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${severityColor}`}>{severity}</span>
          </div>
        </div>
        <CardDescription className="text-[10px] mt-1">Conexiones vs. desasociaciones por hora</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 mb-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Churn Rate</p>
            <p className="text-2xl font-black text-rose-500">{churnPct}<span className="text-xs">%</span></p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Desconexiones</p>
            <p className="text-2xl font-black text-slate-700">{totalDis.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tasa Prom/h</p>
            <p className="text-2xl font-black text-slate-700">{avgDisconnectionRate}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid vertical={false} stroke="#f0f4f5" />
            <XAxis dataKey="hora" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
            <Bar dataKey="conexiones" fill="#004851" radius={[3, 3, 0, 0]} barSize={8} />
            <Bar dataKey="desconexiones" fill="#ff7226" radius={[3, 3, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-1">
          <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-[#004851] inline-block" />Conexiones</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#ff7226" }} />Desconexiones</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Panel 3 — Capacidad Ociosa ────────────────────────────────────────────────
export function IdleCapacityCard() {
  const { inventory, hourlyMetrics, onlineAPs, totalAPs, loading } = useStrategicMetrics();

  const totalEvents = hourlyMetrics.reduce((a, h) => a + (h.total_events || 0), 0);
  const avgEventsPerAP = totalAPs > 0 ? (totalEvents / totalAPs).toFixed(0) : 0;
  const dormantAPs = inventory.filter(ap => ap.status === "dormant").length;
  const idlePct = totalAPs > 0 ? (((dormantAPs) / totalAPs) * 100).toFixed(0) : 0;

  const statusData = [
    { name: "Online",  value: inventory.filter(ap => ap.status === "online").length,  color: "#16a34a" },
    { name: "Offline", value: inventory.filter(ap => ap.status === "offline").length, color: "#cc4a00" },
    { name: "Dormant", value: dormantAPs, color: "#cc9000" },
  ];

  const insight = `Hay ${onlineAPs} APs online de ${totalAPs} en total, con un promedio de ${avgEventsPerAP} eventos/AP. ${parseInt(idlePct) > 20 ? `El ${idlePct}% de los APs están en estado dormant — encendidos pero sin actividad. Se recomienda auditar estos puntos: apagar los de menor densidad poblacional o reubicarlos en zonas de mayor demanda para optimizar el presupuesto operativo.` : "La capacidad ociosa es manejable. Revisar mensualmente."}`;

  if (loading) return <LoadingCard className="col-span-12 lg:col-span-4" />;

  return (
    <Card className="col-span-12 lg:col-span-4 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fffae6" }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: "#cc9000" }}>wifi_off</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Capacidad Ociosa</CardTitle>
            <InfoTooltip title="Capacidad Ociosa" text="APs encendidos (Online/Dormant) con bajo número de eventos. Un AP siempre activo sin tráfico es infraestructura desperdiciada que requiere diagnóstico o reubicación." />
          </div>
          <AIInsightButton insight={insight} />
        </div>
        <CardDescription className="text-[10px] mt-1">Estado operativo vs. eventos generados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-xl p-3" style={{ background: "#e6f5f7" }}>
            <p className="text-[10px] font-bold uppercase" style={{ color: "#004851" }}>Online</p>
            <p className="text-xl font-black" style={{ color: "#004851" }}>{onlineAPs}<span className="text-xs text-slate-400">/{totalAPs}</span></p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#fffae6" }}>
            <p className="text-[10px] font-bold uppercase" style={{ color: "#cc9000" }}>% Dormant</p>
            <p className="text-xl font-black" style={{ color: "#cc9000" }}>{idlePct}%</p>
          </div>
        </div>
        <div className="space-y-2 mb-3">
          {statusData.map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-[10px] font-bold text-slate-600">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${totalAPs > 0 ? (s.value / totalAPs) * 100 : 0}%`, background: s.color }} />
                </div>
                <span className="text-[10px] font-black text-slate-700 w-5 text-right">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3" style={{ background: "#f0f4f5", border: "1px solid #d1dde0" }}>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Eventos prom/AP</p>
          <p className="text-lg font-black" style={{ color: "#004851" }}>{avgEventsPerAP}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Panel 4 — Segmentación Dispositivos ──────────────────────────────────────
export function DeviceSegmentationCard() {
  const { deviceBreakdown, loading } = useStrategicMetrics();
  const total = deviceBreakdown.reduce((a, d) => a + d.usage, 0);
  const brandColors = ["#004851", "#2a8f9e", "#5ab0bc", "#91cfd6", "#ffb800", "#ff7226"];

  const insight = `Los dispositivos más presentes en la red son: ${deviceBreakdown.slice(0, 3).map(d => d.type).join(", ")}. ${deviceBreakdown[0]?.usage < 1000 ? "El bajo consumo en todos los segmentos sugiere que el problema no es de compatibilidad de hardware sino de engagement o cobertura. Evaluar si el portal de acceso es compatible con los tipos de dispositivo dominantes." : `El tipo "${deviceBreakdown[0]?.type}" lidera el consumo con ${deviceBreakdown[0]?.usage.toFixed(0)} MB — enfocar campañas de activación en este segmento.`}`;

  if (loading) return <LoadingCard className="col-span-12 lg:col-span-4" />;

  return (
    <Card className="col-span-12 lg:col-span-4 border-slate-200 shadow-sm overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f3e8ff" }}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: "#7c3aed" }}>devices</span>
            </div>
            <CardTitle className="text-sm font-bold" style={{ color: "#003036" }}>Segmentación Dispositivos</CardTitle>
            <InfoTooltip title="Segmentación por Dispositivo" text="Distribución del consumo total según el tipo de dispositivo/SO. Detecta si la no utilización proviene de dispositivos con capacidades limitadas o incompatibles con el portal de acceso." />
          </div>
          <AIInsightButton insight={insight} />
        </div>
        <CardDescription className="text-[10px] mt-1">Consumo (MB) por tipo de dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        {deviceBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">Sin datos de dispositivos</p>
        ) : (
          <div className="space-y-2.5">
            {deviceBreakdown.map((d, idx) => {
              const pct = total > 0 ? ((d.usage / total) * 100).toFixed(1) : 0;
              return (
                <div key={d.type}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[10px] font-bold text-slate-700 truncate max-w-[130px]">{d.type}</span>
                    <span className="text-[10px] font-black" style={{ color: brandColors[idx] || "#004851" }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: brandColors[idx] || "#004851" }} />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">{d.usage.toFixed(0)} MB</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
