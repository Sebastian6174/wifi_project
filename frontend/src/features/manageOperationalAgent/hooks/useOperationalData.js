import { useState } from 'react';
import { askOperativeAgent, getAlerts, getWorkOrders } from '../services/operationalService';
import { ACCESS_POINTS } from '../utils/mockAccessPoints';

export default function useOperationalData() {
  const [alerts, setAlerts]       = useState([]);
  const [orders, setOrders]       = useState([]);
  const [mapData, setMapData] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError]         = useState(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [alertsData, ordersData] = await Promise.all([getAlerts(), getWorkOrders()]);
      // For now, these might be empty until we add the backend endpoints
      if (alertsData.length > 0) setAlerts(alertsData);
      if (ordersData.length > 0) setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnomalyPrediction = async (zoneName = "") => {
    setIsQuerying(true);
    setError(null);
    setMapData(null);

    try {
      const prompt = `Analiza las anomalías operacionales en la zona: ${zoneName}. Ejecuta la predicción de anomalías y dame un diagnóstico técnico.`;
      const res = await askOperativeAgent(prompt);
      
      const rawAnswer = res.answer;
      
      // Extract JSON block if present
      const jsonMatch = rawAnswer.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedData = JSON.parse(jsonMatch[1]);
          
          // Normalize coordinates if they are in the 10^7 format
          const normalizedData = (Array.isArray(parsedData) ? parsedData : [parsedData]).map((item, index) => {
            let lat = item.lat;
            let lng = item.lng;
            if (lat && Math.abs(lat) > 90) lat = lat / 10000000;
            if (lng && Math.abs(lng) > 180) lng = lng / 10000000;
            
            // Ensure status is valid for our STATUS_CONFIG
            const validStatuses = ['online', 'degraded', 'anomaly', 'offline'];
            const status = validStatuses.includes(item.status) ? item.status : 'anomaly';
            
            return {
              ...item,
              id: item.id ? `${item.id}-${index}` : `AI-${Math.random().toString(36).substr(2, 5)}`,
              status,
              lat,
              lng,
              users: item.users || 0,
              uptime: item.uptime || 'N/A',
              commune: item.comuna ? `Comuna ${item.comuna}` : 'N/A'
            };
          });

          setMapData(prev => {
            const current = prev || ACCESS_POINTS;
            // Create a map of existing items for easy update
            const baseData = [...current];
            
            normalizedData.forEach(newItem => {
              const index = baseData.findIndex(item => item.id === newItem.id);
              if (index !== -1) {
                baseData[index] = { ...baseData[index], ...newItem };
              } else {
                baseData.push(newItem);
              }
            });
            
            return baseData;
          });
          
          // Update alerts with detected anomalies
          const newAlerts = normalizedData.filter(item => item.status === 'anomaly').map(item => ({
            id: `TKT-AI-${item.id}`,
            severity: 'critical',
            label: 'AI Detected Anomaly',
            title: `Anomalía en ${item.name}`,
            location: item.name,
            commune: item.commune,
            apId: item.id,
            technician: null,
            ago: 'Recién detectado',
            description: `El modelo de IA detectó un comportamiento inusual en el tráfico de datos de esta zona.`,
            affectedUsers: item.users || 'Pendiente'
          }));

          if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev]);
          }

          // Clean the response text for display
          setAgentResponse(rawAnswer.replace(jsonMatch[0], '').trim());
        } catch (e) {
          console.error("Error parsing agent map data:", e);
          setAgentResponse(rawAnswer);
        }
      } else {
        setAgentResponse(rawAnswer);
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
    mapData,
    isLoading, 
    isQuerying,
    error, 
    refetch: fetchAll,
    runAnomalyPrediction
  };
}


