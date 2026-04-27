/**
 * useStrategicData.js  (manageStrategicAgent/hooks)
 * Fetches KPIs, recommendations and geodata for the Strategic Agent.
 */

import { useState } from 'react';
import { getKPIs, getRecommendations, getGeoData } from '../services/strategicService';

export default function useStrategicData() {
  const [kpis,            setKpis]            = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [geoData,         setGeoData]         = useState(null);
  const [isLoading,       setIsLoading]       = useState(false);
  const [error,           setError]           = useState(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [kpisData, recsData, geoDataRes] = await Promise.all([
        getKPIs(), getRecommendations(), getGeoData(),
      ]);
      setKpis(kpisData);
      setRecommendations(recsData);
      setGeoData(geoDataRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return { kpis, recommendations, geoData, isLoading, error, refetch: fetchAll };
}
