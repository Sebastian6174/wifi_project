import { AI_RECOMMENDATIONS } from "../utils/mockStrategicData";

export default function StrategicRecommendations() {
  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
      <div className="glass-panel p-5 rounded-3xl relative overflow-hidden flex-1 flex flex-col shadow-sm border border-slate-200/60 bg-white/60">
        
        {/* Subtle Background Pattern */}
        <div className="absolute -bottom-12 -right-12 opacity-5 pointer-events-none">
          <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="#004851"/>
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <div className="p-1.5 bg-[var(--md-primary-container)] text-white rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[16px] block" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <h3 className="text-base font-bold text-[var(--md-primary-container)]">AI Recommendations</h3>
        </div>

        <div className="space-y-3 flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-1 mb-2">
          {AI_RECOMMENDATIONS.map((rec) => (
            <div key={rec.id} className="p-3 rounded-xl bg-white border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-1.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${rec.tagColor}`}>
                  {rec.tag}
                </span>
                <span className="material-symbols-outlined text-slate-300 text-[14px] group-hover:text-teal-500 group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-tight mb-1">{rec.title}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{rec.description}</p>
            </div>
          ))}
        </div>

        <button className="mt-3 w-full py-2.5 text-xs bg-[var(--md-primary-container)] text-white rounded-xl font-bold hover:bg-[#003036] hover:shadow-lg hover:shadow-teal-900/20 active:scale-[0.98] transition-all relative z-10">
          Apply Strategic Plan
        </button>
      </div>
    </div>
  );
}
