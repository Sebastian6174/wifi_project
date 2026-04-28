import { useState } from 'react';
import { askOperativeAgent, getAlerts, getWorkOrders } from '../services/operationalService';

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
          setMapData(parsedData);
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


