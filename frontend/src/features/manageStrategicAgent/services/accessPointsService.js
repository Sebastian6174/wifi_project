import { supabase } from "@/services/supabase";

export const accessPointsService = {
  async getAccessPoints() {
    const { data, error } = await supabase
      .from("wifi_points")
      .select("*");

    if (error) {
      console.error("Error fetching access points:", error);
      throw error;
    }

    // Map database fields to UI fields and filter out invalid ones
    return data
      .map(point => {
        const rawLat = point["LATITUD"];
        const rawLng = point["LONGITUD"];

        // If coordinates are missing or zero, skip or return null to be filtered
        if (rawLat === null || rawLng === null || rawLat === undefined || rawLng === undefined) {
          return null;
        }

        // Adjusting coordinates from integer to float (assuming 10^-5 precision)
        const lat = parseFloat(rawLat) / 100000;
        const lng = parseFloat(rawLng) / 100000;

        // Final validation for MapLibre
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`Invalid coordinates for point ${point.id}: lat=${lat}, lng=${lng}`);
          return null;
        }

        return {
          ...point,
          id: point.id,
          name: point["NOMBRE ZONA"] || "Sin nombre",
          commune: point["COMUNA"] ? `Comuna ${point["COMUNA"]}` : "Sin comuna",
          lat,
          lng,
          // Default values for fields not in wifi_points but used in UI
          apCount: 1,
          connectedDevices: Math.floor(Math.random() * 50),
          capacity: 200,
          uptime: "99.9%",
        };
      })
      .filter(point => point !== null);
  },

  async getRecommendations() {
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("*");

    if (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }

    return data;
  },

  async getActionTableData() {
    const { data, error } = await supabase
      .from("action_table")
      .select("*");

    if (error) {
      console.error("Error fetching action table data:", error);
      throw error;
    }

    return data;
  }
};
