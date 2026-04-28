import { useEffect, useState } from 'react';
import OperationalMap    from './components/OperationalMap';
import ActiveTicketsPanel from './components/ActiveTicketsPanel';
import PerformanceMetrics from './components/PerformanceMetrics';
import WorkforceManagementCard from './components/WorkforceManagementCard';
import { ACCESS_POINTS, TICKETS, KPIS, STATUS_SUMMARY } from './utils/mockAccessPoints';
import useOperationalData from './hooks/useOperationalData';

export default function ManageOperationalAgent() {
  const { alerts, agentResponse, predictionData, anomalies, mapData, isQuerying, runAnomalyPrediction, refetch } = useOperationalData();

  const counts = {
    online: mapData?.filter(ap => ap.status === 'online').length || 0,
    degraded: mapData?.filter(ap => ap.status === 'degraded').length || 0,
    faults: mapData?.filter(ap => ap.status === 'anomaly' || ap.status === 'offline').length || 0,
  };

  useEffect(() => {
    refetch();
  }, []);


  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-12">

      {/* ── Section header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--md-primary-container)' }}>
              <span className="material-symbols-outlined text-white text-[18px]">settings_input_antenna</span>
            </div>
            <h1 className="text-lg font-black uppercase tracking-tight" style={{ color: 'var(--md-primary-container)' }}>
              Operative Agent
            </h1>
          </div>
          <p className="text-xs text-slate-500 ml-10">
            Real-time monitoring of public WiFi access points — Santiago de Cali
          </p>
        </div>

        {/* Status summary pills */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
          <span className="op-summary-badge bg-emerald-50 text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            {counts.online} online
          </span>
          <span className="op-summary-badge bg-amber-50 text-amber-700">
            <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
            {counts.degraded} degraded
          </span>
          <span className="op-summary-badge bg-red-50 text-red-700">
            <span className="size-1.5 rounded-full bg-red-500 inline-block" />
            {counts.faults} faults
          </span>
        </div>
      </div>

      {/* ── AI Analysis Interaction ── */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Operative AI Insight</h3>
              <p className="text-sm text-slate-500 max-w-xl">
                The agent can analyze current traffic patterns to predict hardware failure or congestion anomalies before they affect users.
              </p>
            </div>
          </div>
          <button 
            onClick={() => runAnomalyPrediction()}
            disabled={isQuerying}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isQuerying ? (
              <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">analytics</span>
            )}
            {isQuerying ? 'Analyzing...' : 'Run Anomaly Prediction'}
          </button>
        </div>

        {agentResponse && (
          <div className="mt-8 animate-slide-up space-y-6">
            {/* -- AI Analysis Text -- */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-100" />
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-indigo-600 animate-pulse">monitoring</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Detailed AI Diagnostic</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-100" />
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative p-6 rounded-2xl bg-white border border-indigo-50 shadow-xl shadow-indigo-100/20">
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium">
                  {agentResponse.split('\n').map((line, i) => {
                    if (!line.trim()) return <div key={i} className="h-2" />;
                    if (/^\d+\)/.test(line) || line.endsWith(':') || /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) && line.length < 40) {
                      return <h4 key={i} className="text-indigo-800 font-bold mt-4 mb-2">{line}</h4>;
                    }
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                      return (
                        <div key={i} className="flex gap-2 mb-1.5 ml-2">
                          <span className="text-indigo-400 mt-1.5 shrink-0 size-1.5 rounded-full bg-indigo-400" />
                          <p className="flex-1 m-0" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-*]\s*/, '') }} />
                        </div>
                      );
                    }
                    return <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                  })}
                </div>
              </div>
            </div>

            {/* -- Structured Data Table -- */}
            {predictionData && predictionData.data && (
              <div className="relative group animate-slide-up" style={{ animationDelay: '150ms' }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-10"></div>
                <div className="relative p-0 rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-600 text-lg">table_chart</span>
                      <h4 className="text-sm font-bold text-slate-800">Métricas de Puntos de Acceso Analizados</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Normal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-red-500"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Anomalía</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/30">
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Punto de Acceso</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Fecha / Hora</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Actual</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Predicho</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Ubicación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {predictionData.data.map((item, idx) => (
                          <tr key={idx} className={`hover:bg-indigo-50/20 transition-colors ${item.is_anomaly ? 'bg-red-50/30' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{item.ap_name}</span>
                                <span className="text-[9px] text-slate-400 font-mono">ID: {item.wifi_point_id || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[10px] text-slate-500 font-medium">
                              {new Date(item.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-black ${item.is_anomaly ? 'text-red-600' : 'text-slate-700'}`}>
                                {item.actual_value}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium italic">
                              {item.predicted_value}
                            </td>
                            <td className="px-6 py-4">
                              {item.is_anomaly ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-tight">Anomalía</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-tight">Estable</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {item.lat && item.lng ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-[9px] font-bold text-indigo-600">Geo Disponible</span>
                                  <span className="text-[8px] text-slate-400 font-mono">{item.lat.toFixed(3)}, {item.lng.toFixed(3)}</span>
                                </div>
                              ) : (
                                <span className="text-[9px] font-bold text-slate-300">Sin Geo</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Diagnostic Verified by WiFi_Cali_ML</span>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1">
                Export Report <span className="material-symbols-outlined text-[14px]">download</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Main Layout: Stacked Full Width ── */}
      <div className="flex flex-col gap-6">
        
        {/* 1. Map */}
        <div className="w-full">
          <OperationalMap
            accessPoints={mapData || []}
            onlineCount={counts.online}
            anomalyCount={counts.faults}
          />

        </div>


        {/* 2. Active Tickets Grid */}
        <div className="w-full mt-2">
          {/* We use alerts from hook if available, otherwise fallback to mock */}
          <ActiveTicketsPanel tickets={alerts.length > 0 ? alerts : TICKETS} />
        </div>

        {/* 3. Performance Metrics */}
        <div className="w-full mt-2">
          <PerformanceMetrics kpis={KPIS} />
        </div>
        
        {/* 4. Workforce Management CTA */}
        <div className="w-full mt-2">
          <WorkforceManagementCard />
        </div>
      </div>
    </div>
  );
}

