import { useState } from 'react';
import { askOperativeAgent, getAlerts, getWorkOrders, getWifiPoints } from '../services/operationalService';
import { ACCESS_POINTS } from '../utils/mockAccessPoints';

export default function useOperationalData() {
  const [alerts, setAlerts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching all operational data...");
      const [alertsRes, ordersRes, pointsRes] = await Promise.all([
        getAlerts(),
        getWorkOrders(),
        getWifiPoints()
      ]);
      
      const alertsData = alertsRes;
      const ordersData = ordersRes;
      const pointsData = pointsRes;

      console.log("API Responses:", { 
        alerts: alertsData?.length, 
        orders: ordersData?.length, 
        points: pointsData?.length 
      });

      setAlerts(alertsData || []);
      setOrders(ordersData || []);
      setMapData(pointsData || []);
      
    } catch (err) {
      console.error("Error in fetchAll:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnomalyPrediction = async (zoneName = "") => {
    setIsQuerying(true);
    setError(null);
    console.log(`Running anomaly prediction for zone: ${zoneName}...`);
    // Don't clear mapData entirely, we want to keep the background points
    setPredictionData(null);
    setAnomalies([]);

    try {
      const prompt = `Analiza las anomalías operacionales en la zona: ${zoneName}. Ejecuta la predicción de anomalías y dame un diagnóstico técnico.`;
      const res = await askOperativeAgent(prompt);

      setAgentResponse(res.answer);
      setPredictionData(res.prediction);

      if (res.anomalies && res.anomalies.length > 0) {
        setAnomalies(res.anomalies);

        // Normalize coordinates and update map
        const normalized = res.anomalies.map(item => {
          let lat = item.lat ? parseFloat(item.lat) : null;
          let lng = item.lng ? parseFloat(item.lng) : null;

          if (lat) {
            while (Math.abs(lat) > 10) lat /= 10;
          }
          if (lng) {
            while (Math.abs(lng) > 100) lng /= 10;
          }

          return {
            ...item,
            lat,
            lng,
            status: item.status || 'anomaly'
          };
        });

        setMapData(prev => {
          const baseData = prev ? [...prev] : [];
          normalized.forEach(newItem => {
            const index = baseData.findIndex(item => item.id === newItem.id);
            if (index !== -1) {
              baseData[index] = { ...baseData[index], ...newItem };
            } else {
              baseData.push(newItem);
            }
          });
          return baseData;
        });

        // Update alerts
        const newAlerts = normalized.map(item => ({
          id: `TKT-AI-${item.id}`,
          severity: 'critical',
          label: 'AI Detected Anomaly',
          title: item.name,
          location: item.name,
          commune: item.comuna || 'N/A',
          apId: item.id,
          technician: null,
          ago: 'Recién detectado',
          description: `Anomalía detectada por el modelo de IA operativo.`,
          affectedUsers: 'Pendiente'
        }));
        setAlerts(prev => [...newAlerts, ...prev]);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsQuerying(false);
    }
  };


  return {
    alerts,
    orders,
    agentResponse,
    predictionData,
    anomalies,
    mapData,
    isLoading,
    isQuerying,
    error,
    refetch: fetchAll,
    runAnomalyPrediction
  };
}


