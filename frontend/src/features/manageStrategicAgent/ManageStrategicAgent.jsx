import StrategicMap from "./components/StrategicMap";
import StrategicRecommendations from "./components/StrategicRecommendations";
import StrategicKPIs from "./components/StrategicKPIs";
import StrategicActionTable from "./components/StrategicActionTable";

export default function ManageStrategicAgent() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 lg:p-6 animate-fade-in relative z-10">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div>
          <span className="text-[9px] font-bold text-[var(--md-primary-container)] tracking-[0.2em] uppercase">Executive Intelligence</span>
          <h2 className="text-xl lg:text-2xl font-black text-[#003036] mt-0.5 tracking-tight">Strategic Connectivity Map</h2>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold text-slate-700">Network Status: Optimal</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <span className="text-xs font-bold text-slate-700">Real-time Traffic: <span className="text-[var(--md-primary-container)]">1.2 GB/s</span></span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout - Map & Recs */}
      <div className="grid grid-cols-12 gap-4">
        <StrategicMap />
        <StrategicRecommendations />
      </div>

      {/* Analytics Row */}
      <StrategicKPIs />

      {/* Action Table */}
      <StrategicActionTable />

      {/* FAB for AI Chat */}
      <button className="fixed bottom-6 right-6 w-11 h-11 bg-[var(--md-primary-container)] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
      </button>

    </div>
  );
}
