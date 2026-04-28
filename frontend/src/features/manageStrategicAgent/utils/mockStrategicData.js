/* // Access Points across Cali — each node has:
//   connectedDevices: current load vs capacity → used for WiFi Density (congestion) layer
//   apCount: nearby overlapping AP signals → used for Infrastructure (AP density) layer
//   severity: derived alert level
export const ACCESS_POINTS = [
  // North / Centro-Norte
  { id: 1,  name: "Av. Roosevelt",         commune: "C. 11",  lng: -76.5345, lat: 3.4620, connectedDevices: 340, capacity: 400, apCount: 5, uptime: "99.2%", severity: "Medium" },
  { id: 2,  name: "Av. 6N / San Antonio",  commune: "C. 3",   lng: -76.5375, lat: 3.4510, connectedDevices: 180, capacity: 400, apCount: 3, uptime: "99.8%", severity: "Low" },
  { id: 3,  name: "Granada / Av. 9N",      commune: "C. 2",   lng: -76.5392, lat: 3.4661, connectedDevices: 290, capacity: 400, apCount: 6, uptime: "98.1%", severity: "Medium" },
  { id: 4,  name: "Versalles",             commune: "C. 4",   lng: -76.5328, lat: 3.4580, connectedDevices: 120, capacity: 400, apCount: 2, uptime: "99.9%", severity: "Low" },

  // Centro
  { id: 5,  name: "Parque del Perro",      commune: "C. 2",   lng: -76.5460, lat: 3.4334, connectedDevices: 370, capacity: 400, apCount: 7, uptime: "97.4%", severity: "High" },
  { id: 6,  name: "Bulevar del Río",       commune: "C. 9",   lng: -76.5320, lat: 3.4440, connectedDevices: 310, capacity: 400, apCount: 4, uptime: "99.1%", severity: "Medium" },
  { id: 7,  name: "Parque Bello Horizonte",commune: "C. 10",  lng: -76.5260, lat: 3.4350, connectedDevices: 200, capacity: 400, apCount: 3, uptime: "99.5%", severity: "Low" },
  { id: 8,  name: "Av. Colombia / C. 5",   commune: "C. 9",   lng: -76.5200, lat: 3.4498, connectedDevices: 260, capacity: 400, apCount: 4, uptime: "98.8%", severity: "Medium" },

  // Sur / San Fernando
  { id: 9,  name: "San Fernando",          commune: "C. 19",  lng: -76.5350, lat: 3.4190, connectedDevices: 350, capacity: 400, apCount: 5, uptime: "98.0%", severity: "High" },
  { id: 10, name: "Tequendama",            commune: "C. 19",  lng: -76.5290, lat: 3.4120, connectedDevices: 280, capacity: 400, apCount: 4, uptime: "99.0%", severity: "Medium" },
  { id: 11, name: "Aguablanca / C. 15",    commune: "C. 15",  lng: -76.4890, lat: 3.3960, connectedDevices: 390, capacity: 400, apCount: 3, uptime: "91.2%", severity: "High" },
  { id: 12, name: "Napoles",               commune: "C. 16",  lng: -76.5050, lat: 3.3880, connectedDevices: 220, capacity: 400, apCount: 2, uptime: "99.4%", severity: "Low" },

  // Ladera / Siloé
  { id: 13, name: "Siloé Sector 4",        commune: "C. 20",  lng: -76.5511, lat: 3.4215, connectedDevices: 330, capacity: 350, apCount: 2, uptime: "92.4%", severity: "High" },
  { id: 14, name: "Terrón Colorado",       commune: "C. 1",   lng: -76.5490, lat: 3.4750, connectedDevices: 150, capacity: 300, apCount: 1, uptime: "96.2%", severity: "Low" },

  // Sur-Occidente / Pance
  { id: 15, name: "Pance",                 commune: "C. 22",  lng: -76.5610, lat: 3.3420, connectedDevices: 395, capacity: 400, apCount: 8, uptime: "99.1%", severity: "High" },
  { id: 16, name: "Ciudad Jardín",         commune: "C. 22",  lng: -76.5480, lat: 3.3660, connectedDevices: 260, capacity: 400, apCount: 5, uptime: "99.6%", severity: "Medium" },

  // Oriente sin cobertura (sparse zones)
  { id: 17, name: "Desepaz",               commune: "C. 21",  lng: -76.4680, lat: 3.3720, connectedDevices: 0,   capacity: 0,   apCount: 0, uptime: "N/A",   severity: "None" },
  { id: 18, name: "El Pondaje",            commune: "C. 13",  lng: -76.4820, lat: 3.4060, connectedDevices: 0,   capacity: 0,   apCount: 0, uptime: "N/A",   severity: "None" },
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
 */