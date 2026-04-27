import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, Tooltip } from "recharts";
import { TRAFFIC_CHART_DATA } from "../utils/mockStrategicData";

export default function StrategicKPIs() {
  return (
    <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Traffic Chart Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connection Traffic</h4>
          <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)]">signal_cellular_alt</span>
        </div>
        
        <div className="h-16 mb-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAFFIC_CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)', fontSize: '9px', fontWeight: 'bold' }} 
              />
              <Bar dataKey="traffic" fill="var(--md-primary-container)" radius={[3, 3, 0, 0]} barSize={8} className="group-hover:opacity-80 transition-opacity" />
              <Bar dataKey="mobile" fill="#98d0da" radius={[3, 3, 0, 0]} barSize={8} className="group-hover:opacity-80 transition-opacity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between items-end">
          <span className="text-2xl font-black text-[var(--md-primary-container)] leading-none tracking-tight">84.2 <span className="text-sm">GB</span></span>
          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
        </div>
      </div>

      {/* Active Users Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between items-center relative overflow-hidden">
        <div className="w-full flex items-center justify-between mb-1 z-10">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Users</h4>
          <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)]">group</span>
        </div>
        
        <div className="relative h-20 w-20 flex items-center justify-center my-2 z-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" fill="transparent" r="32" stroke="#f1f5f9" strokeWidth="8"></circle>
            <circle cx="50%" cy="50%" fill="transparent" r="32" stroke="#7c5800" strokeDasharray="201" strokeDashoffset="56" strokeWidth="8" className="drop-shadow-sm transition-all duration-1000 ease-out"></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-black text-[var(--md-primary-container)] -mb-1 tracking-tight">12.4k</span>
          </div>
        </div>
        
        <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-wider z-10">72% of daily capacity</p>
      </div>

      {/* Speed Averages Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Speed</h4>
          <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)]">speed</span>
        </div>
        
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Download</span>
              <span className="text-xs font-black text-[var(--md-primary-container)]">120 Mbps</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--md-primary-container)] w-[85%] rounded-full relative">
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 skew-x-12 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Upload</span>
              <span className="text-xs font-black text-teal-500">45 Mbps</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 w-[60%] rounded-full relative"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Hours Widget */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Peak Activity</h4>
          <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)] p-1 bg-teal-50 rounded-md">schedule</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-2 bg-rose-50/50 border border-rose-100 rounded-xl">
            <span className="text-[11px] font-bold text-slate-700">18:00 - 20:00</span>
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider bg-rose-100/50 px-1.5 py-0.5 rounded">Critical</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-amber-50/50 border border-amber-100 rounded-xl">
            <span className="text-[11px] font-bold text-slate-700">12:00 - 14:00</span>
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider bg-amber-100/50 px-1.5 py-0.5 rounded">Moderate</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <span className="text-[11px] font-bold text-slate-700">02:00 - 05:00</span>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-100/50 px-1.5 py-0.5 rounded">Optimal</span>
          </div>
        </div>
      </div>

    </div>
  );
}
