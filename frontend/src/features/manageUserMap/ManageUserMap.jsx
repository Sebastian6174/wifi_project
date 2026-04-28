import useUserMap from "./hooks/useUserMap";
import UserMap from "./components/UserMap";
import { fmtDistance } from "./utils/geoUtils";

export default function ManageUserMap() {
  const {
    userPos,
    points,
    selectedAP,
    routeCoords,
    isLoadingRoute,
    loading,
    error,
    handleSelectAP,
  } = useUserMap();

  const handleOpenMaps = () => {
    if (!userPos || !selectedAP) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${selectedAP.lat},${selectedAP.lng}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#003036] tracking-tight leading-tight">
          Red WiFi Pública
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Encuentra el punto de acceso gratuito más cercano a tu ubicación.
        </p>
      </div>

      {/* Map */}
      {loading ? (
        <div className="w-full h-[500px] rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-200/60">
           <span className="material-symbols-outlined animate-spin text-[#004851] text-[32px]">sync</span>
           <p className="text-xs font-bold text-slate-500 mt-2">Localizando puntos WiFi...</p>
        </div>
      ) : (
        <UserMap
          userPos={userPos}
          points={points}
          selectedAP={selectedAP}
          onSelectAP={handleSelectAP}
          routeCoords={routeCoords}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] shrink-0">location_disabled</span>
          <div>
            <p className="text-sm font-bold">Ubicación no disponible</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Info panel */}
      {selectedAP && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-[#004851]/10 text-[#004851] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                wifi
              </span>
            </div>
            <div>
              <p className="text-sm font-black text-[#004851] leading-tight">
                {selectedAP.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                  {selectedAP.commune}
                </span>
                {selectedAP.distanceKm !== undefined && (
                  <span className="text-xs font-bold text-emerald-600">
                    A {fmtDistance(selectedAP.distanceKm)} de ti
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            <button
              onClick={handleOpenMaps}
              disabled={!userPos}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004851] text-white rounded-xl font-bold text-xs hover:bg-[#003036] hover:shadow-lg hover:shadow-teal-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              Ir con Google Maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
