import { useEffect, useState } from 'react';
import OperationalMap    from './components/OperationalMap';
import ActiveTicketsPanel from './components/ActiveTicketsPanel';
import PerformanceMetrics from './components/PerformanceMetrics';
import WorkforceManagementCard from './components/WorkforceManagementCard';
import { ACCESS_POINTS, TICKETS, KPIS, STATUS_SUMMARY } from './utils/mockAccessPoints';
import useOperationalData from './hooks/useOperationalData';

export default function ManageOperationalAgent() {
  const { alerts, agentResponse, mapData, isQuerying, runAnomalyPrediction, refetch } = useOperationalData();


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
            {STATUS_SUMMARY.online} online
          </span>
          <span className="op-summary-badge bg-amber-50 text-amber-700">
            <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
            {STATUS_SUMMARY.degraded} degraded
          </span>
          <span className="op-summary-badge bg-red-50 text-red-700">
            <span className="size-1.5 rounded-full bg-red-500 inline-block" />
            {STATUS_SUMMARY.anomaly + STATUS_SUMMARY.offline} faults
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
          <div className="mt-8 animate-slide-up">
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
                    
                    // Handle headers (e.g., 1) Diagnostico tecnico)
                    if (/^\d+\)/.test(line)) {
                      return <h4 key={i} className="text-indigo-800 font-bold mt-4 mb-2">{line}</h4>;
                    }

                    // Handle bold text and list items
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                      return (
                        <div key={i} className="flex gap-2 mb-1.5 ml-2">
                          <span className="text-indigo-400 mt-1.5 shrink-0 size-1.5 rounded-full bg-indigo-400" />
                          <p className="flex-1 m-0" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-*]\s*/, '') }} />
                        </div>
                      );
                    }

                    return (
                      <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: formattedLine }} />
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Diagnostic Verified by WiFi_Cali_ML</span>
                  </div>
                  <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-1">
                    Export Report <span className="material-symbols-outlined text-[14px]">download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Main Layout: Stacked Full Width ── */}
      <div className="flex flex-col gap-6">
        
        {/* 1. Map */}
        <div className="w-full">
          <OperationalMap
            accessPoints={mapData || ACCESS_POINTS}
            onlineCount={STATUS_SUMMARY.online}
            anomalyCount={STATUS_SUMMARY.anomaly + STATUS_SUMMARY.offline}
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

