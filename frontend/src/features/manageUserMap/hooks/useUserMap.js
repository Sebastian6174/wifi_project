import { useState, useEffect } from "react";
import { findNearestAP } from "../utils/geoUtils";
import { accessPointsService } from "../../manageStrategicAgent/services/accessPointsService";

export default function useUserMap() {
  const [userPos, setUserPos] = useState(null);
  const [points, setPoints]   = useState([]);
  const [selectedAP, setSelectedAP] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch APs and Get user location on mount
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const allAPs = await accessPointsService.getAccessPoints();
        setPoints(allAPs);

        if (!navigator.geolocation) {
          setError("Tu navegador no soporta geolocalización");
          setLoading(false);
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
            setLoading(false);
          },
          () => {
            setError("Permiso de ubicación denegado. No podemos mostrar puntos cercanos.");
            setLoading(false);
          }
        );
      } catch (err) {
        setError("Error al conectar con la base de datos");
        setLoading(false);
      }
    }

    init();
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
