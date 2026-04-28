import { useState, useMemo } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapClusterLayer,
  MapPopup,
  MapControls,
} from "@/components/ui/map";
import { useAccessPoints } from "../hooks/useAccessPoints";
import { RadioTower, Loader2 } from "lucide-react";

// ─── Color helpers ────────────────────────────────────────────────────────────
// WiFi Density: congestion ratio 0–1 → teal(low) → amber → rose(critical)
function congestionColor(ratio) {
  if (ratio >= 0.92) return "#f43f5e"; // rose-500  critical
  if (ratio >= 0.78) return "#f59e0b"; // amber-500 warning
  if (ratio >= 0.55) return "#14b8a6"; // teal-500  moderate
  return "#99f6e4"; // teal-200  low
}

// Build GeoJSON for MapClusterLayer — AP-dense points only (apCount > 0)
function buildInfraGeoJSON(points) {
  return {
    type: "FeatureCollection",
    features: points
      .filter((p) => p.apCount > 0)
      .map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: {
          apCount: p.apCount,
          name: p.name,
          commune: p.commune,
          uptime: p.uptime,
        },
      })),
  };
}

export default function StrategicMap() {
  const { accessPoints: ACCESS_POINTS, loading, error } = useAccessPoints();
  const [wifiDensity, setWifiDensity] = useState(false);
  const [infraDensity, setInfraDensity] = useState(false);
  const [selected, setSelected] = useState(null);

  const infraGeoJSON = useMemo(() => buildInfraGeoJSON(ACCESS_POINTS), [ACCESS_POINTS]);
  const SPARSE_ZONES = useMemo(() => ACCESS_POINTS.filter((p) => p.apCount <= 1), [ACCESS_POINTS]);

  const legendLabel = infraDensity
    ? { lo: "Sin AP", hi: "Solapamiento" }
    : { lo: "Baja carga", hi: "Saturación" };

  if (loading) {
    return (
      <div className="col-span-12 lg:col-span-8 h-[480px] flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-white">
        <Loader2 className="size-8 text-[#004851] animate-spin mb-2" />
        <p className="text-sm font-bold text-slate-500">Cargando datos de red...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 lg:col-span-8 h-[480px] flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border border-rose-100">
        <p className="text-sm font-bold text-rose-500">Error al cargar datos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-8 h-[480px] relative rounded-3xl overflow-hidden shadow-xl shadow-teal-900/10 border border-white">
      <div className="absolute inset-0">
        <Map center={[-76.5319, 3.4216]} zoom={11.8}>
          {/* ── 1. WiFi Density: congestion heat blobs (only when checked) ── */}
          {wifiDensity &&
            ACCESS_POINTS.filter((p) => p.capacity > 0).map((p) => {
              const ratio = p.connectedDevices / p.capacity;
              const color = congestionColor(ratio);
              const radius = 36 + ratio * 36; // 36–72 px
              return (
                <MapMarker
                  key={`heat-${p.id}`}
                  longitude={p.lng}
                  latitude={p.lat}
                  anchor="center"
                >
                  <MarkerContent>
                    {/*
                      Zero-size wrapper anchored at the exact coordinate.
                      The blob div expands equally in all directions from there.
                    */}
                    <div style={{ position: "relative", width: 0, height: 0 }}>
                      <div
                        className="rounded-full pointer-events-none absolute"
                        style={{
                          width: radius,
                          height: radius,
                          top: -radius / 2,
                          left: -radius / 2,
                          background: `radial-gradient(circle, ${color}a0 0%, ${color}38 60%, transparent 100%)`,
                        }}
                      />
                    </div>
                  </MarkerContent>
                </MapMarker>
              );
            })}

          {/* ── 2a. Infrastructure density — cluster of AP-dense zones ── */}
          {infraDensity && (
            <MapClusterLayer
              data={infraGeoJSON}
              clusterRadius={45}
              clusterMaxZoom={13}
              clusterColors={["#5ab0bc", "#007385", "#004851"]}
              pointColor="#007385"
              onPointClick={(feature, coords) =>
                setSelected({ coords, props: feature.properties })
              }
            />
          )}

          {/* ── 2b. Infrastructure — sparse / no-coverage zone markers ── */}
          {infraDensity &&
            SPARSE_ZONES.map((p) => (
              <MapMarker
                key={`sparse-${p.id}`}
                longitude={p.lng}
                latitude={p.lat}
                anchor="center"
              >
                <MarkerContent>
                  {/* Muted dashed circle to indicate low/no AP presence */}
                  <button
                    onClick={() =>
                      setSelected({ coords: [p.lng, p.lat], props: p })
                    }
                    className="flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white/60 text-slate-400 transition-all hover:border-rose-400 hover:text-rose-400 focus:outline-none"
                    style={{ width: 28, height: 28 }}
                    title={p.apCount === 0 ? "Sin cobertura" : "Cobertura baja"}
                  >
                    <RadioTower size={13} strokeWidth={1.5} />
                  </button>
                </MarkerContent>
                <MarkerTooltip>
                  {p.name} · {p.apCount === 0 ? "Sin cobertura" : `Solo ${p.apCount} AP`}
                </MarkerTooltip>
              </MapMarker>
            ))}

          {/* ── 3. Always-on AP markers — neutral antenna icon ── */}
          {ACCESS_POINTS.map((p) => (
            <MapMarker key={`ap-${p.id}`} longitude={p.lng} latitude={p.lat}>
              <MarkerContent>
                <button
                  onClick={() =>
                    setSelected({ coords: [p.lng, p.lat], props: p })
                  }
                  className="flex items-center justify-center size-5 rounded-full bg-white/90 border border-slate-300 shadow-md cursor-pointer transition-all hover:scale-125 hover:border-[#004851] hover:shadow-lg focus:outline-none"
                  title={p.name}
                >
                  <RadioTower color="#004851" size={20} />
                </button>
              </MarkerContent>
              <MarkerTooltip>
                {p.name} · {p.commune}
              </MarkerTooltip>
            </MapMarker>
          ))}

          {/* ── 4. Info popup ── */}
          {selected && (
            <MapPopup
              key={`${selected.coords[0]}-${selected.coords[1]}`}
              longitude={selected.coords[0]}
              latitude={selected.coords[1]}
              onClose={() => setSelected(null)}
              closeButton
              closeOnClick={false}
              focusAfterOpen={false}
              className="w-52 p-0 shadow-2xl rounded-xl"
            >
              <div className="p-3 space-y-2">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {selected.props.commune || "—"}
                  </p>
                  <p className="text-sm font-bold text-[#003036] leading-tight">
                    {selected.props.name}
                  </p>
                </div>
                {selected.props.capacity > 0 ? (
                  <>
                    <div className="flex justify-between text-[10px] text-slate-600">
                      <span>Dispositivos</span>
                      <span className="font-black">
                        {selected.props.connectedDevices} /{" "}
                        {selected.props.capacity}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (selected.props.connectedDevices / selected.props.capacity) * 100)}%`,
                          background: congestionColor(
                            selected.props.connectedDevices /
                              selected.props.capacity,
                          ),
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>APs cercanos</span>
                      <span className="font-bold">
                        {selected.props.apCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Uptime</span>
                      <span className="font-bold">{selected.props.uptime}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-[10px] text-rose-500 font-bold">
                    Sin cobertura — zona prioritaria
                  </p>
                )}
              </div>
            </MapPopup>
          )}

          <MapControls />
        </Map>
      </div>

      {/* ── Layer Controls ── */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 p-2.5 rounded-xl shadow-sm pointer-events-auto">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Capas de Análisis
          </p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={wifiDensity}
                onChange={(e) => setWifiDensity(e.target.checked)}
                className="size-3.5 rounded border-slate-300"
                style={{ accentColor: "#004851" }}
              />
              <span
                className={`text-xs font-bold transition-colors ${wifiDensity ? "text-[#004851]" : "text-slate-600"}`}
              >
                Congestión WiFi
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={infraDensity}
                onChange={(e) => setInfraDensity(e.target.checked)}
                className="size-3.5 rounded border-slate-300"
                style={{ accentColor: "#004851" }}
              />
              <span
                className={`text-xs font-bold transition-colors ${infraDensity ? "text-[#004851]" : "text-slate-600"}`}
              >
                Densidad de AP
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Heat Scale Legend (only when a layer is active) ── */}
      {(wifiDensity || infraDensity) && (
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-sm border border-slate-200/60 pointer-events-none transition-all animate-fade-in">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            {infraDensity ? "Densidad de AP" : "Congestión de Red"}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-500 font-bold">
              {legendLabel.lo}
            </span>
            <div
              className="h-1.5 w-20 rounded-full"
              style={{
                background: infraDensity
                  ? "linear-gradient(to right, #e2e8f0, #99f6e4, #14b8a6, #004851)"
                  : "linear-gradient(to right, #99f6e4, #14b8a6, #f59e0b, #f43f5e)",
              }}
            />
            <span className="text-[9px] text-slate-500 font-bold">
              {legendLabel.hi}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
