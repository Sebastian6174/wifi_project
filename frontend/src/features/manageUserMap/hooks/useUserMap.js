import { useState, useEffect } from "react";
import { findNearestAP } from "../utils/geoUtils";
import { ACCESS_POINTS } from "../../manageStrategicAgent/utils/mockStrategicData";

// Extract all points from mock data
const allAPs = ACCESS_POINTS;

export default function useUserMap() {
  const [userPos, setUserPos] = useState(null);
  const [points, setPoints]   = useState(allAPs);
  const [selectedAP, setSelectedAP] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [error, setError] = useState(null);

  // 1. Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
          name: "Tu Ubicación",
        };
        setUserPos(coords);

        // Auto-select the nearest AP
        const nearest = findNearestAP(coords.lat, coords.lng, allAPs);
        if (nearest) {
          setSelectedAP(nearest);
        }
      },
      () => {
        setError("Permiso de ubicación denegado. No podemos mostrar puntos cercanos.");
      }
    );
  }, []);

  // 2. Fetch OSRM route when userPos and selectedAP change
  useEffect(() => {
    if (!userPos || !selectedAP) return;

    async function fetchRoute() {
      setIsLoadingRoute(true);
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userPos.lng},${userPos.lat};${selectedAP.lng},${selectedAP.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes?.length > 0) {
          setRouteCoords(data.routes[0].geometry.coordinates);
        } else {
          setRouteCoords([]);
        }
      } catch (err) {
        console.error("OSRM route fetch failed:", err);
      } finally {
        setIsLoadingRoute(false);
      }
    }

    fetchRoute();
  }, [userPos, selectedAP]);

  const handleSelectAP = (ap) => {
    setSelectedAP(ap);
  };

  return {
    userPos,
    points,
    selectedAP,
    routeCoords,
    isLoadingRoute,
    error,
    handleSelectAP,
  };
}
