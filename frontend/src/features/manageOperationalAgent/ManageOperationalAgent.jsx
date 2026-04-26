/**
 * ManageOperationalAgent.jsx  (<= 250 lines)
 * Orchestrator: composes map + tickets + metrics from mockup data.
 * To connect to real API: replace mockup imports with operationalService calls.
 */

import OperationalMap    from './components/OperationalMap';
import ActiveTicketsPanel from './components/ActiveTicketsPanel';
import PerformanceMetrics from './components/PerformanceMetrics';
import WorkforceManagementCard from './components/WorkforceManagementCard';
import { ACCESS_POINTS, TICKETS, KPIS, STATUS_SUMMARY } from './utils/mockAccessPoints';

export default function ManageOperationalAgent() {
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

      {/* ── Main Layout: Map & KPIs (Left) | Tickets (Right) ── */}
      <div className="grid grid-cols-12 gap-5 items-start">
        
        {/* Left Column (8 cols): Map -> KPIs -> Workforce */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <OperationalMap
            accessPoints={ACCESS_POINTS}
            onlineCount={STATUS_SUMMARY.online}
            anomalyCount={STATUS_SUMMARY.anomaly + STATUS_SUMMARY.offline}
          />

          <PerformanceMetrics kpis={KPIS} />
          
          <WorkforceManagementCard />
        </div>

        {/* Right Column (4 cols): Active Tickets (spans available height) */}
        <div className="col-span-12 lg:col-span-4 sticky top-20" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <ActiveTicketsPanel tickets={TICKETS} />
        </div>
      </div>
    </div>
  );
}
