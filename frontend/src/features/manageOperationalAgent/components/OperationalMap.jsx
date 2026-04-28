/**
 * OperationalMap.jsx  (<= 250 lines)
 * Interactive map of Cali showing AP health markers with popups.
 * Uses @mapcn/map (MapLibre) via shadcn registry.
 */

import { useState } from 'react';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
} from '@/components/ui/map';

/* Cali, Colombia centre coordinate */
const CALI_CENTER = [-76.5320, 3.4516];
const CALI_ZOOM   = 12;

const STATUS_CONFIG = {
  online:   { bg: 'bg-emerald-500', ring: 'ring-emerald-300', pulse: 'ap-pulse-green', label: 'Online',    color: '#10b981' },
  degraded: { bg: 'bg-amber-500',   ring: 'ring-amber-300',   pulse: 'ap-pulse-amber', label: 'Degraded',  color: '#f59e0b' },
  anomaly:  { bg: 'bg-red-500',     ring: 'ring-red-300',     pulse: 'ap-pulse-red',   label: 'Anomaly',   color: '#ef4444' },
  offline:  { bg: 'bg-red-600',     ring: 'ring-red-400',     pulse: 'ap-pulse-red',   label: 'Offline',   color: '#dc2626' },
};

const FILTER_OPTIONS = [
  { value: 'all',      label: 'All APs' },
  { value: 'online',   label: 'Online' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'anomaly',  label: 'Anomaly' },
  { value: 'offline',  label: 'Offline' },
];

function APMarker({ ap }) {
  const cfg = STATUS_CONFIG[ap.status] || STATUS_CONFIG.anomaly;
  const isFault = ap.status === 'anomaly' || ap.status === 'offline' || !STATUS_CONFIG[ap.status];

  return (
    <MapMarker longitude={ap.lng} latitude={ap.lat}>
      <MarkerContent>
        <div className="relative flex items-center justify-center cursor-pointer">
          {/* Sonar ring animation for faults */}
          {isFault && (
            <>
              <span className={`absolute inline-flex size-6 rounded-full opacity-60 ${cfg.bg} ${cfg.pulse}`} />
              <span className={`absolute inline-flex size-4 rounded-full opacity-40 ${cfg.bg} ${cfg.pulse} [animation-delay:0.4s]`} />
            </>
          )}
          <span className={`relative inline-flex size-3 rounded-full border-2 border-white shadow-md ${cfg.bg}`} />
        </div>
      </MarkerContent>

      <MarkerPopup className="w-56 p-0 overflow-hidden" closeButton>
        {/* Colour header */}
        <div className="px-3 pt-3 pb-2" style={{ background: 'var(--md-surface-container-low)' }}>
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
            isFault ? 'bg-red-100 text-red-700' : ap.status === 'degraded' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {cfg.label}
          </span>
          <p className="text-sm font-bold leading-tight" style={{ color: 'var(--md-primary-container)' }}>
            {ap.name}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{ap.id} · {ap.commune}</p>
        </div>

        {/* Stats */}
        <div className="px-3 pb-3 pt-2 flex flex-col gap-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Connected users</span>
            <span className="font-semibold" style={{ color: 'var(--md-on-surface)' }}>{ap.users}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Uptime</span>
            <span className="font-semibold" style={{ color: 'var(--md-on-surface)' }}>{ap.uptime}</span>
          </div>
          {ap.signal && (
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Signal (RSSI)</span>
              <span className="font-semibold" style={{ color: 'var(--md-on-surface)' }}>{ap.signal} dBm</span>
            </div>
          )}
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}

export default function OperationalMap({ accessPoints = [], onlineCount, anomalyCount }) {
  const [filter,     setFilter]     = useState('all');

  const visible = (filter === 'all'
    ? accessPoints
    : accessPoints.filter(ap => ap.status === filter)
  ).filter(ap => ap.lat !== null && ap.lng !== null && !isNaN(ap.lat) && !isNaN(ap.lng));

  return (
    <div className="op-map-card glass-panel rounded-2xl overflow-hidden relative shadow-xl border border-white/60">
      {/* Status badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
        <span className="op-map-badge">
          <span className="size-2 rounded-full bg-emerald-500 ap-pulse-green inline-block" />
          {onlineCount} Online
        </span>
        <span className="op-map-badge text-red-600">
          <span className="size-2 rounded-full bg-red-500 ap-pulse-red inline-block" />
          {anomalyCount} Anomalies
        </span>
      </div>

      {/* Filter pills */}
      <div className="absolute top-4 right-4 z-10 flex gap-1 bg-white/90 backdrop-blur rounded-full px-2 py-1 shadow-sm">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
              filter === opt.value
                ? 'bg-[var(--md-primary-container)] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="h-[560px]">
        <Map
          center={CALI_CENTER}
          zoom={CALI_ZOOM}
          theme="light"
        >
          <MapControls position="bottom-right" showZoom showFullscreen />
          {visible.map(ap => (
            <APMarker key={ap.id} ap={ap} />
          ))}
        </Map>
      </div>
    </div>
  );
}
