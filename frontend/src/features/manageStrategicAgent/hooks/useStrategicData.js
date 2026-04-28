import { useState, useEffect } from "react";
import { accessPointsService } from "../services/accessPointsService";

export function useStrategicData() {
  const [data, setData] = useState({
    accessPoints: [],
    recommendations: [],
    actionTable: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [accessPoints, recommendations, actionTable] = await Promise.all([
          accessPointsService.getAccessPoints(),
          accessPointsService.getRecommendations(),
          accessPointsService.getActionTableData(),
        ]);
        
        setData({
          accessPoints,
          recommendations,
          actionTable,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { ...data, loading, error };
}
