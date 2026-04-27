import { useEffect, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapRoute,
} from "@/components/ui/map";
import { Loader2, Clock, Route, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Mid-point + rough zoom level to show both markers */
function getMapView(posA, posB) {
  if (!posA || !posB) {
    return { center: [-76.5319, 3.4516], zoom: 12 };
  }
  const centerLng = (posA.lng + posB.lng) / 2;
  const centerLat = (posA.lat + posB.lat) / 2;
  const dLng = Math.abs(posA.lng - posB.lng);
  const dLat = Math.abs(posA.lat - posB.lat);
  const spread = Math.max(dLng, dLat);
  // rough zoom: smaller spread → more zoom
  const zoom = spread < 0.02 ? 13.5 : spread < 0.05 ? 12.5 : spread < 0.15 ? 11.5 : 10;
  return { center: [centerLng, centerLat], zoom };
}

export default function TicketMapRoute({ end }) {
  const [currentPos, setCurrentPos] = useState(null);
  const [routes, setRoutes]         = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);

  // ── 1. Get real geolocation ───────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentPos({
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
        name: "Tu Ubicación",
      }),
      () => {
        setError("Permiso de ubicación denegado");
        setIsLoading(false);
      }
    );
  }, []);

  // ── 2. Fetch routes once we have both points ──────────────────────────────
  useEffect(() => {
    if (!currentPos || !end) return;

    async function fetchRoutes() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${currentPos.lng},${currentPos.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await res.json();
        if (data.routes?.length > 0) {
          setRoutes(
            data.routes.map((r) => ({
              coordinates: r.geometry.coordinates,
              duration:    r.duration,
              distance:    r.distance,
            }))
          );
        }
      } catch (err) {
        console.error("OSRM fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [currentPos, end]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const { center, zoom } = getMapView(currentPos, end);

  // Non-selected routes first so the selected renders on top
  const sortedRoutes = [...routes]
    .map((route, index) => ({ route, index }))
    .sort((a, b) => {
      if (a.index === selectedIndex) return 1;
      if (b.index === selectedIndex) return -1;
      return 0;
    });

  const handleOpenMaps = () => {
    if (!currentPos) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${currentPos.lat},${currentPos.lng}&destination=${end.lat},${end.lng}`,
      "_blank"
    );
  };

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center gap-3">
        <span className="material-symbols-outlined text-[40px] text-slate-300">location_off</span>
        <p className="text-sm font-bold text-slate-500">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  // ── Map ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 h-96 relative">
      {/* Key forces a re-mount when center changes so the camera snaps to route */}
      <Map key={`${center[0]}-${center[1]}`} center={center} zoom={zoom}>

        {/* ── Routes ── */}
        {sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color={isSelected ? "var(--md-primary-container)" : "#94a3b8"}
              width={isSelected ? 5 : 3}
              opacity={isSelected ? 1 : 0.45}
              onClick={() => setSelectedIndex(index)}
            />
          );
        })}

        {/* ── Origin marker ── */}
        {currentPos && (
          <MapMarker longitude={currentPos.lng} latitude={currentPos.lat}>
            <MarkerContent>
              <div className="size-5 flex items-center justify-center rounded-full border-2 border-white bg-blue-500 text-[10px] font-bold text-white shadow-lg">
                1
              </div>
            </MarkerContent>
            <MarkerLabel position="top">{currentPos.name}</MarkerLabel>
          </MapMarker>
        )}

        {/* ── Destination marker ── */}
        {end && (
          <MapMarker longitude={end.lng} latitude={end.lat}>
            <MarkerContent>
              <div className="size-5 flex items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[10px] font-bold text-white shadow-lg">
                2
              </div>
            </MarkerContent>
            <MarkerLabel position="bottom">{end.name}</MarkerLabel>
          </MapMarker>
        )}
      </Map>

      {/* ── Route info pill ── */}
      {routes[selectedIndex] && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-[var(--md-primary-container)]" />
              <span className="text-xs font-black text-slate-800">
                {formatDuration(routes[selectedIndex].duration)}
              </span>
              {selectedIndex === 0 && (
                <span className="text-[8px] px-1.5 py-0.5 rounded font-black bg-emerald-100 text-emerald-700">
                  MÁS RÁPIDO
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <Route className="size-3" />
              {formatDistance(routes[selectedIndex].distance)}
            </div>
          </div>
        </div>
      )}

      {/* ── Google Maps CTA ── */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="default"
          size="sm"
          onClick={handleOpenMaps}
          disabled={!currentPos}
          className="bg-[var(--md-primary-container)] hover:shadow-lg hover:shadow-teal-900/20 rounded-xl gap-2 font-bold h-8 px-4 text-[10px] uppercase tracking-wider"
        >
          <MapPin className="size-3" />
          Google Maps
        </Button>
      </div>

      {/* ── Loading overlay ── */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20">
          <Loader2 className="size-6 animate-spin text-[var(--md-primary-container)]" />
        </div>
      )}
    </div>
  );
}
