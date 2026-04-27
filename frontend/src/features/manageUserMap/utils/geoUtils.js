/**
 * geoUtils.js
 * Haversine distance + nearest AP finder for the public WiFi map.
 */

/** Distance in km between two lat/lng pairs */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Returns the nearest AP from a list, annotated with distanceKm */
export function findNearestAP(userLat, userLng, points) {
  let nearest = null;
  let minDist = Infinity;
  for (const p of points) {
    if (p.capacity === 0) continue; // skip uncovered zones
    const dist = haversineKm(userLat, userLng, p.lat, p.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...p, distanceKm: dist };
    }
  }
  return nearest;
}

/** Mid-point + appropriate zoom for two lat/lng points */
export function getMapView(posA, posB) {
  if (!posA || !posB) return { center: [-76.5319, 3.4216], zoom: 12 };
  const center = [(posA.lng + posB.lng) / 2, (posA.lat + posB.lat) / 2];
  const spread = Math.max(
    Math.abs(posA.lng - posB.lng),
    Math.abs(posA.lat - posB.lat)
  );
  const zoom = spread < 0.02 ? 13.5 : spread < 0.06 ? 12.5 : spread < 0.15 ? 11.5 : 10.5;
  return { center, zoom };
}

/** Format meters or km */
export function fmtDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Format seconds → "X min" or "Xh Ym" */
export function fmtDuration(secs) {
  const m = Math.round(secs / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
