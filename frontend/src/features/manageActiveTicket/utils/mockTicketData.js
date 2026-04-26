export const MOCK_ACTIVE_TICKET = {
  id: "TK-2024-089",
  status: "En Progreso",
  priority: "Crítica",
  category: "Infraestructura WiFi",
  technician: {
    name: "Carlos Montoya",
    role: "Senior Field Engineer",
    id: "88291",
    certs: ["Cisco CCNA"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3NQnL1fD97AyL66mIuZgmlPcCLIHQxT_Joix432DVoVm-IAh5nSJ9aFMwBqvPsoMPN8T7Dmr-oLnx30suGInqXxWJJeCRL0wwCyjjZeZmsrLCMmPvPcNJj5v4qoNxv4ZiOdKMT6PwrcdGpybfzVS8Lu1xq7u_sV5U4p9qiikRqgWYGu49kLRchUYz5lWYAN1WzS1tBMqcm1lvAdZtkGrDVn_jR3y9AolCAibNGR2z2_TcRndjbb4P2LRSzKUPdltioXkkTN2_Is"
  },
  incident: {
    description: "Reporte de falla crítica en el punto de acceso principal de Parque del Perro. Los usuarios reportan desconexiones intermitentes y latencia alta. Se sospecha de una falla en el Firmware tras la actualización automática del lunes. El hardware parece estar operativo pero el software no responde a comandos remotos.",
    location: "Parque del Perro, Cali"
  },
  checklist: [
    { id: 1, task: "Identificación de Hardware afectado", isCompleted: true },
    { id: 2, task: "Actualización manual de Firmware (v2.4.1)", isCompleted: false },
    { id: 3, task: "Pruebas de estrés y ancho de banda", isCompleted: false },
    { id: 4, task: "Validación de cobertura (Heatmap)", isCompleted: false }
  ],
  worklog: [
    { id: 1, title: "Ticket Asignado", timeAgo: "HACE 4H", desc: "El sistema asignó automáticamente a Carlos Montoya.", isDone: true },
    { id: 2, title: "Llegada al Sitio", timeAgo: "HACE 2H", desc: "Check-in geolocalizado confirmado en Parque del Perro.", isDone: false },
    { id: 3, title: "Diagnóstico Iniciado", timeAgo: "HACE 1H", desc: "Se detectó error de handshake en la banda de 5GHz.", isDone: false }
  ],
  routeData: {
    // Current Tech location roughly Unicentro or nearby
    start: { name: "Current Location", lng: -76.5410, lat: 3.3750 },
    // Destination: Parque del Perro
    end: { name: "Parque del Perro", lng: -76.5460, lat: 3.4334 }
  }
};
