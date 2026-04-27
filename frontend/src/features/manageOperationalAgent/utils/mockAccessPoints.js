/**
 * mockAccessPoints.js — Mockup data for Operational Agent
 * Replace this import with API calls from operationalService.js
 * when the backend is ready.
 */

export const ACCESS_POINTS = [
  // ── Online (green) ──────────────────────────────
  { id: 'AP-001', name: 'Parque Versalles', status: 'online',  lat: 3.4516, lng: -76.5320, users: 142, uptime: '99.2%', signal: -48, commune: 'Commune 10' },
  { id: 'AP-002', name: 'Centro Comercial Chipichape', status: 'online', lat: 3.4812, lng: -76.5263, users: 387, uptime: '97.8%', signal: -52, commune: 'Commune 19' },
  { id: 'AP-003', name: 'Biblioteca Departamental', status: 'online', lat: 3.4434, lng: -76.5282, users: 98,  uptime: '99.9%', signal: -41, commune: 'Commune 3'  },
  { id: 'AP-004', name: 'Estadio Olímpico Pascual Guerrero', status: 'online', lat: 3.4414, lng: -76.5500, users: 211, uptime: '98.1%', signal: -55, commune: 'Commune 10' },
  { id: 'AP-005', name: 'Zoológico de Cali', status: 'online', lat: 3.4556, lng: -76.5484, users: 176, uptime: '96.4%', signal: -59, commune: 'Commune 10' },
  { id: 'AP-006', name: 'Terminal de Transportes', status: 'degraded', lat: 3.4250, lng: -76.5354, users: 63,  uptime: '78.3%', signal: -71, commune: 'Commune 15' },
  { id: 'AP-007', name: 'Centro Histórico La Merced', status: 'online', lat: 3.4382, lng: -76.5225, users: 295, uptime: '99.1%', signal: -44, commune: 'Commune 3'  },
  { id: 'AP-008', name: 'Parque de los Poetas', status: 'online', lat: 3.4460, lng: -76.5408, users: 84,  uptime: '98.7%', signal: -47, commune: 'Commune 10' },
  // ── Anomaly / Offline (red) ──────────────────────
  { id: 'AP-009', name: 'Bulevar del Río', status: 'offline',  lat: 3.4398, lng: -76.5395, users: 0,   uptime: '0%',   signal: null, commune: 'Commune 9'  },
  { id: 'AP-010', name: 'Parque del Perro', status: 'anomaly', lat: 3.4287, lng: -76.5436, users: 12,  uptime: '31.2%', signal: -89, commune: 'Commune 10' },
  { id: 'AP-011', name: 'Colegio San Luis', status: 'offline',  lat: 3.4650, lng: -76.5180, users: 0,   uptime: '0%',   signal: null, commune: 'Commune 2'  },
  { id: 'AP-012', name: 'Parque La Flora', status: 'anomaly', lat: 3.4723, lng: -76.5354, users: 7,   uptime: '18.4%', signal: -92, commune: 'Commune 18' },
];

export const TICKETS = [
  {
    id: 'TKT-4420',
    severity: 'critical',
    label: 'Critical Anomaly',
    title: 'AP Offline - Power Loss',
    location: 'Estadio Olímpico',
    commune: 'Commune 10',
    apId: 'AP-004',
    technician: null,
    reasonNotAssigned: 'Todos los técnicos de la zona Centro/Sur se encuentran operando en campo o finalizando turno. No hay disponibilidad inmediata en un radio de 5km.',
    ago: '5m ago',
    description: 'Reporte múltiple de caída total de señal en cuadrícula oriente del Estadio. Requiere atención inmediata antes del evento.',
    affectedUsers: 211,
  },
  {
    id: 'TKT-4412',
    severity: 'critical',
    label: 'Critical Anomaly',
    title: 'Router Firmware Failure',
    location: 'Parque del Perro',
    commune: 'Commune 10',
    apId: 'AP-010',
    technician: { name: 'Carlos Montoya', status: 'En Route',  statusIcon: 'pace' },
    ago: '14m ago',
    description: 'Firmware version mismatch causing repeated reboots every 8-12 min. AP unreachable via SSH. Manual flash required.',
    affectedUsers: 48,
  },
  {
    id: 'TKT-4398',
    severity: 'high',
    label: 'Slow Performance',
    title: 'Bandwidth Congestion',
    location: 'Terminal de Transportes',
    commune: 'Commune 15',
    apId: 'AP-006',
    technician: { name: 'Lucía Fernández', status: 'Assigned', statusIcon: 'schedule' },
    ago: '32m ago',
    description: 'Upload throughput dropped to 0.4 Mbps (SLA: 10 Mbps). Likely interference from nearby cellular tower. Spectrum scan scheduled.',
    affectedUsers: 63,
  },
  {
    id: 'TKT-4371',
    severity: 'critical',
    label: 'Hardware Offline',
    title: 'AP 741 – Power Loss',
    location: 'Bulevar del Río',
    commune: 'Commune 9',
    apId: 'AP-009',
    technician: { name: 'Jorge Valdés', status: 'On Site',    statusIcon: 'engineering' },
    ago: '1h ago',
    description: 'Complete power outage at junction box B-07. UPS failed. Electrician dispatched. Estimated recovery: 2h.',
    affectedUsers: 0,
  },
  {
    id: 'TKT-4355',
    severity: 'high',
    label: 'Hardware Offline',
    title: 'AP 823 – Power Loss',
    location: 'Colegio San Luis',
    commune: 'Commune 2',
    apId: 'AP-011',
    technician: { name: 'Ana Ríos',       status: 'Assigned', statusIcon: 'schedule' },
    ago: '2h ago',
    description: 'Device offline since 08:12. No response to ICMP. Physical inspection required — likely hardware fault.',
    affectedUsers: 0,
  },
  {
    id: 'TKT-4341',
    severity: 'high',
    label: 'Critical Anomaly',
    title: 'Signal Degradation',
    location: 'Parque La Flora',
    commune: 'Commune 18',
    apId: 'AP-012',
    technician: { name: 'Marco Salcedo',  status: 'Assigned', statusIcon: 'schedule' },
    ago: '3h ago',
    description: 'RSSI degraded to -92 dBm. Antenna misalignment suspected after last night\'s storm. Field calibration required.',
    affectedUsers: 7,
  },
];

export const KPIS = [
  { label: 'Avg. Response',   value: '18.4m', trend: '-2.4%', positive: true,  icon: 'timer' },
  { label: 'Resolution Rate', value: '94.2%', trend: '+0.8%', positive: true,  icon: 'check_circle' },
  { label: 'Active Agents',   value: '42/50', trend: '8 on break',    positive: null, icon: 'groups' },
  { label: 'Feedback Score',  value: '4.9/5', trend: '★★★★★', positive: true,  icon: 'star' },
];

export const STATUS_SUMMARY = {
  online:   ACCESS_POINTS.filter(a => a.status === 'online').length,
  degraded: ACCESS_POINTS.filter(a => a.status === 'degraded').length,
  anomaly:  ACCESS_POINTS.filter(a => a.status === 'anomaly').length,
  offline:  ACCESS_POINTS.filter(a => a.status === 'offline').length,
  total:    ACCESS_POINTS.length,
};
