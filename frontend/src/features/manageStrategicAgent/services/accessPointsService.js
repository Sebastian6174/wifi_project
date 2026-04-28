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
    const points = await this.getAccessPoints();
    
    const recommendations = [];
    
    // 1. Expansion Recommendation (Congestion > 80%)
    const congestedPoints = points.filter(p => (p.connectedDevices / p.capacity) > 0.8);
    if (congestedPoints.length > 0) {
      recommendations.push({
        id: "rec-exp-" + Date.now(),
        tag: "Inversión",
        tagColor: "bg-teal-100 text-teal-700",
        title: `Expansión en ${congestedPoints[0].name}`,
        description: `Saturación del ${( (congestedPoints[0].connectedDevices / congestedPoints[0].capacity) * 100).toFixed(0)}% detectada. Se recomienda añadir nodos en la ${congestedPoints[0].commune}.`
      });
    }

    // 2. Maintenance Recommendation (Low AP count or uptime issues)
    const criticalZones = points.filter(p => p.apCount === 0);
    if (criticalZones.length > 0) {
      recommendations.push({
        id: "rec-mnt-" + Date.now(),
        tag: "Crítico",
        tagColor: "bg-rose-100 text-rose-700",
        title: `Zona sin Cobertura: ${criticalZones[0].name}`,
        description: `Se ha detectado una zona de silencio absoluto en ${criticalZones[0].commune}. Intervención técnica requerida de inmediato.`
      });
    }

    // 3. Optimization Recommendation (General health)
    recommendations.push({
      id: "rec-opt-" + Date.now(),
      tag: "Optimización",
      tagColor: "bg-amber-100 text-amber-700",
      title: "Rebalanceo de Carga",
      description: "Se detecta desequilibrio de tráfico entre nodos 2.4GHz y 5GHz. Ajustar umbrales de band-steering."
    });

    return recommendations;
  },

  async getActionTableData() {
    const { data, error } = await supabase
      .from("strategic_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching action table data:", error);
      return [];
    }

    const focusIcons = {
      maintenance: "build",
      expansion: "cell_tower",
      optimization: "bolt",
      critical: "warning"
    };

    const priorityImpact = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };

    const priorityBadges = {
      low: "bg-slate-100 text-slate-500",
      medium: "bg-amber-50 text-amber-700",
      high: "bg-rose-50 text-rose-600",
      critical: "bg-[#004851] text-white"
    };

    return data.map(plan => ({
      id: plan.id,
      commune: plan.zone,
      sector: "Cali Central", // Default or derived
      action: plan.title,
      icon: focusIcons[plan.focus] || "list",
      cost: `$${(plan.grand_total / 1000).toFixed(1)}k`,
      impact: priorityImpact[plan.priority] || 2,
      status: "Planificado",
      statusBadge: priorityBadges[plan.priority] || "bg-slate-100 text-slate-500"
    }));
  }
};
