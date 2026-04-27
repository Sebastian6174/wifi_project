export const PLAN_FOCUS_TYPES = [
  {
    id: "maintenance",
    label: "Mantenimiento Preventivo",
    icon: "build",
    description: "Revisión y ajuste de infraestructura existente para garantizar disponibilidad.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    accent: "#d97706",
  },
  {
    id: "improvement",
    label: "Mejora de Capacidad",
    icon: "bolt",
    description: "Ampliación de ancho de banda, hardware Wi-Fi 7 o densificación de mesh.",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    accent: "#0f766e",
  },
  {
    id: "new_ap",
    label: "Nuevo Punto de Acceso",
    icon: "cell_tower",
    description: "Despliegue de nueva antena o nodo en zona sin cobertura.",
    color: "bg-[#e6f5f7] text-[#004851] border-[#b3ecf7]",
    accent: "#004851",
  },
];

export const CALI_ZONES = [
  "Centro Histórico", "Aguablanca", "Siloé", "Ciudad Jardín",
  "San Fernando", "Granada", "Parque del Perro", "Bulevar del Río",
  "Pance", "Terrón Colorado", "Desepaz", "Tequendama",
];

export const AI_SUGGESTIONS = {
  maintenance: [
    "Inspección de conectores y cableado en panel de distribución",
    "Actualización de firmware de controladores Wi-Fi",
    "Prueba de carga y stress test en horario pico",
    "Revisión de registros de uptime de los últimos 30 días",
    "Certificación de cobertura RF con software Acrylic",
  ],
  improvement: [
    "Migración a estándar IEEE 802.11be (Wi-Fi 7)",
    "Segmentación de banda 2.4/5/6 GHz por tipo de dispositivo",
    "Implementación de QoS para priorizar servicios ciudadanos",
    "Aumentar capacidad backhaul a 10 Gbps en nodo principal",
    "Implementar balanceo de carga automático entre APs",
  ],
  new_ap: [
    "Estudio de sitio y análisis de propagación RF",
    "Tramitación de permisos ante Alcaldía de Cali",
    "Instalación de fuente de alimentación redundante (UPS)",
    "Configuración de SSID público y VLAN de gestión",
    "Integración al sistema de monitoreo centralizado",
  ],
};

export const BUDGET_CATEGORIES = [
  { id: "hardware",    label: "Hardware / Equipos",         icon: "router",          unit: "Unidad" },
  { id: "labor",       label: "Mano de Obra",                icon: "engineering",     unit: "Hora" },
  { id: "connectivity",label: "Conectividad / Enlace",       icon: "cell_tower",      unit: "Mes" },
  { id: "permits",     label: "Permisos / Legal",            icon: "gavel",           unit: "Trámite" },
  { id: "contingency", label: "Contingencia (10%)",          icon: "security",        unit: "Global" },
];

export const DEFAULT_STEPS = [
  { id: 1, title: "Diagnóstico y levantamiento técnico", owner: "", startDate: "", endDate: "", hours: 8,  status: "pending", notes: "" },
  { id: 2, title: "Adquisición de materiales",            owner: "", startDate: "", endDate: "", hours: 4,  status: "pending", notes: "" },
  { id: 3, title: "Ejecución en sitio",                  owner: "", startDate: "", endDate: "", hours: 16, status: "pending", notes: "" },
  { id: 4, title: "Pruebas y validación",                 owner: "", startDate: "", endDate: "", hours: 4,  status: "pending", notes: "" },
  { id: 5, title: "Entrega y documentación",              owner: "", startDate: "", endDate: "", hours: 2,  status: "pending", notes: "" },
];

export const STEP_STATUSES = [
  { id: "pending",     label: "Pendiente",   color: "bg-slate-100 text-slate-500 border-slate-200" },
  { id: "in_progress", label: "En Progreso", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "done",        label: "Completado",  color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "blocked",     label: "Bloqueado",   color: "bg-rose-50 text-rose-600 border-rose-100" },
];
