import { useEffect, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerTooltip,
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

export default function TicketMapRoute({ end }) {
  const [currentPos, setCurrentPos] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get real user location
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPos({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
          name: "Tu Ubicación"
        });
      },
      (err) => {
        setError("Permiso de ubicación denegado");
        setIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!currentPos || !end) return;

    async function fetchRoutes() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${currentPos.lng},${currentPos.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const routeData = data.routes.map(route => ({
            coordinates: route.geometry.coordinates,
            duration: route.duration,
            distance: route.distance,
          }));
          setRoutes(routeData);
        }
      } catch (err) {
        console.error("Failed to fetch routes:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [currentPos, end]);

  const sortedRoutes = routes
    .map((route, index) => ({ route, index }))
    .sort((a, b) => {
      if (a.index === selectedIndex) return 1;
      if (b.index === selectedIndex) return -1;
      return 0;
    });

  const handleOpenMaps = () => {
    if (!currentPos) return;
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${currentPos.lat},${currentPos.lng}&destination=${end.lat},${end.lng}`, '_blank');
  };

  if (error) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center flex-col gap-3">
        <span className="material-symbols-outlined text-[40px] text-slate-300">location_off</span>
        <p className="text-sm font-bold text-slate-500">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 h-96 relative group">
      <Map center={currentPos ? [currentPos.lng, currentPos.lat] : [-76.5319, 3.4516]} zoom={currentPos ? 13 : 12}>
        {sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color={isSelected ? "var(--md-primary-container)" : "#94a3b8"}
              width={isSelected ? 5 : 3}
              opacity={isSelected ? 1 : 0.4}
              onClick={() => setSelectedIndex(index)}
            />
          );
        })}

        {currentPos && (
          <MapMarker longitude={currentPos.lng} latitude={currentPos.lat}>
            <MarkerContent>
              <div className="size-4.5 flex items-center justify-center rounded-full border-2 border-white bg-blue-500 text-[10px] font-bold text-white shadow-lg">1</div>
            </MarkerContent>
            <MarkerTooltip>{currentPos.name}</MarkerTooltip>
          </MapMarker>
        )}

        {end && (
          <MapMarker longitude={end.lng} latitude={end.lat}>
            <MarkerContent>
              <div className="relative">
                <div className="absolute w-8 h-8 bg-rose-500/20 rounded-full animate-ping -translate-x-2 -translate-y-2" />
                <div className="size-4.5 flex items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[10px] font-bold text-white shadow-lg relative z-10">2</div>
              </div>
            </MarkerContent>
            <MarkerTooltip>{end.name}</MarkerTooltip>
          </MapMarker>
        )}
      </Map>

      {/* Info Pills */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
        {routes[selectedIndex] && (
          <div className="glass-panel border-white/50 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg pointer-events-auto flex flex-col gap-1 border border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-[var(--md-primary-container)]" />
              <span className="text-xs font-black text-slate-800">
                {formatDuration(routes[selectedIndex].duration)}
              </span>
              {selectedIndex === 0 && (
                <span className="text-[8px] px-1.5 py-0.5 rounded font-black bg-emerald-100 text-emerald-700">MÁS RÁPIDO</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <Route className="size-3" />
              {formatDistance(routes[selectedIndex].distance)}
            </div>
          </div>
        )}
      </div>

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

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20">
          <Loader2 className="size-6 animate-spin text-[var(--md-primary-container)]" />
        </div>
      )}
    </div>
  );
}
