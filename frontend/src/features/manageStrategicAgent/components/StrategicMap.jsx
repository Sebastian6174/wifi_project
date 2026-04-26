import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from "@/components/ui/map";
import { MAP_LOCATIONS } from "../utils/mockStrategicData";

export default function StrategicMap() {
  return (
    <div className="col-span-12 lg:col-span-8 h-[480px] relative rounded-3xl overflow-hidden shadow-xl shadow-teal-900/10 border border-white">
      <div className="absolute inset-0 bg-slate-200">
        <Map center={[-76.53198, 3.45164]} zoom={12}>
          {MAP_LOCATIONS.map((place) => (
            <MapMarker key={place.id} longitude={place.lng} latitude={place.lat}>
              <MarkerContent>
                <div className={`size-4 cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
                  place.severity === 'High' ? 'bg-rose-500 animate-pulse' : 
                  place.severity === 'Medium' ? 'bg-amber-500' : 'bg-teal-500'
                }`} />
                <MarkerLabel position="bottom" className="text-[10px]">{place.label}</MarkerLabel>
              </MarkerContent>
              <MarkerPopup className="w-48 p-0 shadow-2xl rounded-xl">
                <div className="space-y-1.5 p-3">
                  <div>
                    <p className="text-muted-foreground pb-0.5 text-[9px] font-bold tracking-wide uppercase text-slate-400">
                      {place.category}
                    </p>
                    <h3 className="text-foreground leading-tight font-bold text-primary text-sm">
                      {place.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-slate-400">settings_input_antenna</span>
                      <span className="font-bold text-slate-600">Uptime: {place.uptime}</span>
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <button className="w-full py-1 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-[var(--md-primary-container)] rounded-md transition-colors border border-slate-200">
                      View Deep Insights
                    </button>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Map Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="glass-panel p-2.5 rounded-xl pointer-events-auto shadow-sm border border-white/50">
          <p className="text-[9px] font-bold text-slate-500 uppercase mb-1.5">Display Layers</p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="size-3.5 rounded text-[var(--md-primary-container)] focus:ring-[var(--md-primary-container)] border-slate-300" />
              <span className="text-xs font-bold text-slate-700">WiFi Density</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="size-3.5 rounded text-[var(--md-primary-container)] focus:ring-[var(--md-primary-container)] border-slate-300" />
              <span className="text-xs font-bold text-slate-700">Infrastructure</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 glass-panel p-3 rounded-xl shadow-sm border border-white/50 pointer-events-none">
        <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Heat Scale</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-600 font-bold">Low</span>
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-teal-200 via-teal-500 to-[#004851]"></div>
          <span className="text-[9px] text-slate-600 font-bold">Critical</span>
        </div>
      </div>
    </div>
  );
}
