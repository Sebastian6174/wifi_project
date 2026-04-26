export const MAP_LOCATIONS = [
  {
    id: 1,
    name: "Comuna 22",
    label: "Critical",
    category: "Saturation Risk",
    severity: "High",
    uptime: "99.1%",
    lng: -76.5310,
    lat: 3.3742,
  },
  {
    id: 2,
    name: "Siloé Sector 4",
    label: "Warning",
    category: "Hardware Degradation",
    severity: "Medium",
    uptime: "92.4%",
    lng: -76.5511,
    lat: 3.4215,
  },
  {
    id: 3,
    name: "Parque del Perro",
    label: "Opportunity",
    category: "Expansion Need",
    severity: "Low",
    uptime: "99.9%",
    lng: -76.5413,
    lat: 3.4332,
  },
];

export const AI_RECOMMENDATIONS = [
  {
    id: 1,
    tag: "PRIORITY HIGH",
    tagColor: "text-[#004851] bg-teal-100/50",
    title: "Aumentar ancho de banda en Comuna 22",
    description: "Saturation detected during peak hours (18:00 - 21:00). Estimated ROI: +15% User Satisfaction."
  },
  {
    id: 2,
    tag: "MAINTENANCE",
    tagColor: "text-secondary bg-secondary-fixed/50",
    title: "Siloé Sector 4: Hardware Refresh",
    description: "Node uptime dropped to 92%. Proactive replacement recommended within 7 days."
  },
  {
    id: 3,
    tag: "EXPANSION",
    tagColor: "text-teal-600 bg-teal-50",
    title: "New AP Deployment: Parque del Perro",
    description: "Growing tourism footprint warrants a high-density mesh expansion."
  }
];

export const ACTION_TABLE_DATA = [
  {
    id: 1,
    commune: "Comuna 22",
    sector: "Pance & Universities",
    icon: "bolt",
    action: "Bandwidth Upgrade (5Gbps)",
    cost: "$45,000 USD",
    impact: 3, // out of 4
    status: "READY TO DEPLOY",
    statusBadge: "bg-emerald-50 text-emerald-600"
  },
  {
    id: 2,
    commune: "Comuna 19",
    sector: "San Fernando / Tequendama",
    icon: "settings_input_antenna",
    action: "Mesh Node Distribution",
    cost: "$28,500 USD",
    impact: 2,
    status: "PENDING APPROVAL",
    statusBadge: "bg-[#ffdea8] text-[#7c5800]" // secondary-fixed & secondary
  },
  {
    id: 3,
    commune: "Comuna 2",
    sector: "Granada / Versalles",
    icon: "router",
    action: "Hardware Refresh (Wi-Fi 7)",
    cost: "$112,000 USD",
    impact: 4,
    status: "ANALYZING",
    statusBadge: "bg-slate-100 text-slate-500"
  }
];

export const TRAFFIC_CHART_DATA = [
  { time: "00:00", traffic: 24, mobile: 18 },
  { time: "04:00", traffic: 12, mobile: 8 },
  { time: "08:00", traffic: 63, mobile: 55 },
  { time: "12:00", traffic: 82, mobile: 75 },
  { time: "16:00", traffic: 75, mobile: 68 },
  { time: "20:00", traffic: 98, mobile: 89 }, // Peak
];
