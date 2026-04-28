import StrategicMap from "./components/StrategicMap";
import StrategicRecommendations from "./components/StrategicRecommendations";
import StrategicKPIs from "./components/StrategicKPIs";
import StrategicActionTable from "./components/StrategicActionTable";

import {
  NetworkEventsAnalysisCard,
  ChurnRateCard,
  IdleCapacityCard,
  DeviceSegmentationCard,
} from "./components/StrategicAnalyticsA";
import {
  TopAPsByClientsCard,
  TopAPsByUsageCard,
  EventTypeDistributionCard,
} from "./components/StrategicAnalyticsB";

export default function ManageStrategicAgent() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 lg:p-6 animate-fade-in relative z-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div>
          <span className="text-[9px] font-bold text-[var(--md-primary-container)] tracking-[0.2em] uppercase">
            Executive Intelligence
          </span>
          <h2 className="text-xl lg:text-2xl font-black text-[#003036] mt-0.5 tracking-tight">
            Strategic Connectivity Map
          </h2>
        </div>
      </div>

      {/* Bento Grid Layout - Map & Recs */}
      <div className="grid grid-cols-12 gap-4">
        <StrategicMap />
        <StrategicRecommendations />
      </div>

      <StrategicActionTable />

      {/* Analytics Row */}
      <StrategicKPIs />

      {/* Network Events Analysis */}
      <NetworkEventsAnalysisCard />

      {/* Action Table */}

      {/* ── Deep Analytics Section ── */}
      <div>
        <div className="grid grid-cols-12 gap-4">
          <ChurnRateCard />

          <IdleCapacityCard />
          <DeviceSegmentationCard />
          <EventTypeDistributionCard />

          <TopAPsByClientsCard />
          <TopAPsByUsageCard />
        </div>
      </div>

      {/* FAB for AI Chat */}
      <button className="fixed bottom-6 right-6 w-11 h-11 bg-[var(--md-primary-container)] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
      </button>
    </div>
  );
}
