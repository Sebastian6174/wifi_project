import { useState, useEffect } from "react";
import { accessPointsService } from "../services/accessPointsService";

export function useAccessPoints() {
  const [accessPoints, setAccessPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await accessPointsService.getAccessPoints();
        setAccessPoints(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { accessPoints, loading, error };
}
