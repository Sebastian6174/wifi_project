import { supabase } from "@/services/supabase";

export const strategicDataService = {
  /** usage_mb, device_type, last_seen, client_id, onboarding, status, client_description from clients */
  async getClientMetrics() {
    const { data, error } = await supabase
      .from("clients")
      .select("usage_mb, device_type, last_seen, client_id, onboarding, status, client_description, ap_name");
    if (error) { console.error("Error fetching client metrics:", error); throw error; }
    console.log("DEBUG: Client data sample:", data?.[0]);
    return data;
  },

  /** unique_clients, disconnection_rate, total_disconnections, total_events, total_connections, total_auth, ap_name, status, timestamp_hour */
  async getAPHourlyMetrics() {
    const { data, error } = await supabase
      .from("ap_hourly_metrics_curated")
      .select("unique_clients, disconnection_rate, total_disconnections, total_events, total_connections, total_auth, ap_name, status, timestamp_hour");
    if (error) { console.error("Error fetching AP hourly metrics:", error); throw error; }
    return data;
  },

  /** status, connectivity_history, ap_name, mac, serial, local_ip from access_point_curated */
  async getAPInventoryStatus() {
    const { data, error } = await supabase
      .from("access_point_curated")
      .select("status, connectivity_history, ap_name, mac, serial, local_ip");
    if (error) { console.error("Error fetching AP inventory status:", error); throw error; }
    return data;
  },

  /** timestamp, ap_name, event_type, client_id, ssid from network_events_curated */
  async getNetworkEventsSummary() {
    const { data, error } = await supabase
      .from("network_events_curated")
      .select("timestamp, ap_name, event_type, client_id, ssid");
    if (error) { console.error("Error fetching network events summary:", error); throw error; }
    return data;
  },

  /**
   * Hourly metrics grouped by AP name for capacity vs. events analysis.
   * Fetches ap_name + total_events + status from joined tables when available.
   */
  async getAPCapacityData() {
    const { data, error } = await supabase
      .from("ap_hourly_metrics_curated")
      .select("total_events, unique_clients, total_connections, total_disconnections, ap_name, total_auth");
    if (error) { console.error("Error fetching AP capacity data:", error); throw error; }
    return data;
  },
};
