import { useState, useEffect, useMemo } from "react";
import { strategicDataService } from "../services/strategicDataService";

/**
 * Single hook that fetches ALL data needed by the 8 analytics panels.
 * Uses Promise.all to minimize round-trips.
 */
export function useStrategicMetrics() {
  const [data, setData] = useState({
    clients: [],
    hourlyMetrics: [],
    inventory: [],
    networkSummary: [],
    capacityData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const [clients, hourlyMetrics, inventory, networkSummary, capacityData] =
          await Promise.all([
            strategicDataService.getClientMetrics(),
            strategicDataService.getAPHourlyMetrics(),
            strategicDataService.getAPInventoryStatus(),
            strategicDataService.getNetworkEventsSummary(),
            strategicDataService.getAPCapacityData(),
          ]);
        setData({ clients, hourlyMetrics, inventory, networkSummary, capacityData });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  // ── Derived metrics used by multiple panels ──────────────────────────────

  /** Average MB consumed per unique client (efficiency index) */
  const totalUsageMB = data.clients.reduce((a, c) => a + (c.usage_mb || 0), 0);
  const totalUniqueClients = data.hourlyMetrics.reduce((a, h) => a + (h.unique_clients || 0), 0);
  const efficiencyIndex = totalUniqueClients > 0
    ? (totalUsageMB / totalUniqueClients).toFixed(2)
    : 0;

  /** Average disconnection rate → churn */
  const avgDisconnectionRate = data.hourlyMetrics.length > 0
    ? (
        data.hourlyMetrics.reduce((a, h) => a + (h.disconnection_rate || 0), 0) /
        data.hourlyMetrics.length
      ).toFixed(3)
    : 0;

  /** Online vs idle AP ratio */
  const onlineAPs = data.inventory.filter(ap => ap.status === "online").length;
  const totalAPs = data.inventory.length;

  /** Device type breakdown from clients */
  const deviceBreakdown = Object.entries(
    data.clients.reduce((acc, c) => {
      const key = c.device_type || "Unknown";
      acc[key] = (acc[key] || 0) + (c.usage_mb || 0);
      return acc;
    }, {})
  )
    .map(([type, usage]) => ({ type, usage }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 6);

  /** SSID demand breakdown */
  const ssidDemand = Object.entries(
    data.networkSummary.reduce((acc, e) => {
      const key = e.ssid || "Sin nombre";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([ssid, connections]) => ({ ssid, connections }))
    .sort((a, b) => b.connections - a.connections)
    .slice(0, 8);

  /** User fidelity — clients seen in the last 7 days */
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentClients = data.clients.filter(
    c => c.last_seen && new Date(c.last_seen) >= sevenDaysAgo
  ).length;
  const fidelityRate = data.clients.length > 0
    ? ((recentClients / data.clients.length) * 100).toFixed(1)
    : 0;

  /** Top 10 APs by reported clients from clients table */
  const top10APsByClients = useMemo(() => {
    const grouped = data.clients.reduce((acc, c) => {
      const name = c.ap_name || "Unknown AP";
      if (!acc[name]) acc[name] = { name, clients: 0 };
      acc[name].clients += 1; // Increment client count
      return acc;
    }, {});
    return Object.values(grouped)
      .sort((a, b) => b.clients - a.clients)
      .slice(0, 10);
  }, [data.clients]);

  /** Top 10 APs by accumulated usage (MB) from clients table */
  const top10APsByUsage = useMemo(() => {
    const grouped = data.clients.reduce((acc, c) => {
      const name = c.ap_name || "Unknown AP";
      if (!acc[name]) acc[name] = { name, usage: 0 };
      acc[name].usage += (c.usage_mb || 0); // Sum usage
      return acc;
    }, {});
    return Object.values(grouped)
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);
  }, [data.clients]);

  /** Hourly event distribution from networkSummary */
  const eventsByHour = useMemo(() => {
    if (!data.networkSummary.length) return [];
    const buckets = {};
    data.networkSummary.forEach(e => {
      const date = new Date(e.timestamp);
      const hour = date.getHours();
      if (!buckets[hour]) {
        buckets[hour] = { hour: `${hour}:00`, count: 0, aps: new Set(), types: new Set() };
      }
      buckets[hour].count += 1;
      if (e.ap_name) buckets[hour].aps.add(e.ap_name);
      if (e.event_type) buckets[hour].types.add(e.event_type);
    });
    return Object.values(buckets)
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
      .map(b => ({
        ...b,
        aps: Array.from(b.aps).join(", "),
        types: Array.from(b.types).join(", "),
      }));
  }, [data.networkSummary]);

  /** Event type distribution for pie chart */
  const eventTypeDistribution = useMemo(() => {
    if (!data.networkSummary.length) return [];
    const counts = {};
    data.networkSummary.forEach(e => {
      const type = e.event_type || "Other";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data.networkSummary]);

  return {
    ...data,
    loading,
    error,
    // Derived
    totalUsageMB,
    totalUniqueClients,
    efficiencyIndex,
    avgDisconnectionRate,
    onlineAPs,
    totalAPs,
    deviceBreakdown,
    ssidDemand,
    recentClients,
    fidelityRate,
    top10APsByClients,
    top10APsByUsage,
    eventsByHour,
    eventTypeDistribution,
    /** AP Status summary */
    apStatusSummary: useMemo(() => {
      if (!data.inventory || !data.inventory.length) return [];
      const counts = {};
      data.inventory.forEach(ap => {
        const status = ap.status || "Unknown";
        counts[status] = (counts[status] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data.inventory]),
  };
}
