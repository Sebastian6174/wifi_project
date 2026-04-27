/**
 * useOperationalData.js  (manageOperationalAgent/hooks)
 * Fetches and manages state for alerts and work orders.
 */

import { useState } from 'react';
import { getAlerts, getWorkOrders } from '../services/operationalService';

export default function useOperationalData() {
  const [alerts, setAlerts]       = useState([]);
  const [orders, setOrders]       = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [alertsData, ordersData] = await Promise.all([getAlerts(), getWorkOrders()]);
      setAlerts(alertsData);
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return { alerts, orders, isLoading, error, refetch: fetchAll };
}
