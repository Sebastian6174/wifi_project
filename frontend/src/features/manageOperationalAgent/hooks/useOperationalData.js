import { useState } from 'react';
import { askOperativeAgent, getAlerts, getWorkOrders } from '../services/operationalService';

export default function useOperationalData() {
  const [alerts, setAlerts]       = useState([]);
  const [orders, setOrders]       = useState([]);
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

  const runAnomalyPrediction = async (zoneName = "General") => {
    setIsQuerying(true);
    setError(null);
    try {
      const prompt = `Analiza las anomalías operacionales en la zona: ${zoneName}. Ejecuta la predicción de anomalías y dame un diagnóstico técnico.`;
      const res = await askOperativeAgent(prompt);
      setAgentResponse(res.answer);
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
    isLoading, 
    isQuerying,
    error, 
    refetch: fetchAll,
    runAnomalyPrediction
  };
}

