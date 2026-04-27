import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
} from "@/components/ui/map";
import { RadioTower } from "lucide-react";
import { getMapView } from "../utils/geoUtils";

/** Pulsing blue dot for user location */
function UserDot() {
  return (
    <div style={{ position: "relative", width: 0, height: 0 }}>
      <div
        className="absolute rounded-full bg-blue-500/20 animate-ping"
        style={{ width: 28, height: 28, top: -14, left: -14 }}
      />
      <div
        className="absolute rounded-full bg-blue-500 border-2 border-white shadow-lg"
        style={{ width: 14, height: 14, top: -7, left: -7 }}
      />
    </div>
  );
}

/** Antenna marker — same icon as StrategicMap */
function APDot({ isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center size-6 rounded-full border shadow-md cursor-pointer transition-all hover:scale-125 focus:outline-none ${
        isSelected
          ? "bg-[#004851] border-[#004851] text-white scale-125"
          : "bg-white/90 border-slate-300 text-[#004851] hover:border-[#004851]"
      }`}
    >
      <RadioTower size={13} strokeWidth={1.8} />
    </button>
  );
}

export default function UserMap({
  userPos,
  points,
  selectedAP,
  onSelectAP,
  routeCoords,
}) {
  const start = userPos;
  const end   = selectedAP;
  const { center, zoom } = getMapView(start, end || (userPos && { lng: userPos.lng + 0.02, lat: userPos.lat }));

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
      <Map
        key={`${center[0].toFixed(4)}-${center[1].toFixed(4)}`}
        center={center}
        zoom={zoom}
      >
        {/* Route line — only when a route is loaded */}
        {routeCoords?.length > 0 && (
          <MapRoute
            coordinates={routeCoords}
            color="#004851"
            width={4}
            opacity={0.85}
          />
        )}

        {/* AP markers */}
        {points
          .filter((p) => p.capacity > 0)
          .map((p) => (
            <MapMarker key={`ap-${p.id}`} longitude={p.lng} latitude={p.lat}>
              <MarkerContent>
                <APDot
                  isSelected={selectedAP?.id === p.id}
                  onClick={() => onSelectAP(p)}
                />
              </MarkerContent>
              <MarkerTooltip>{p.name} · {p.commune}</MarkerTooltip>
            </MapMarker>
          ))}

        {/* User location */}
        {userPos && (
          <MapMarker longitude={userPos.lng} latitude={userPos.lat} anchor="center">
            <MarkerContent>
              <UserDot />
            </MarkerContent>
          </MapMarker>
        )}
      </Map>

      {/* Legend chip */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center gap-3 shadow-sm pointer-events-none">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-blue-500" />
          <span className="text-[9px] font-bold text-slate-500">Tu posición</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RadioTower size={10} className="text-[#004851]" />
          <span className="text-[9px] font-bold text-slate-500">Punto WiFi</span>
        </div>
      </div>
    </div>
  );
}
