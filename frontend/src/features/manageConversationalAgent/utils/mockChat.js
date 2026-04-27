export const SUGGESTED_PROMPTS = [
  "¿Cuál es el tráfico en la Comuna 13?",
  "Nodos fuera de línea en el oriente",
  "Estado de fibra en Comuna 1",
  "Resumen de alertas críticas hoy"
];

export const CONTEXT_PAGES = [
  { id: 1, label: "Comuna 1" },
  { id: 2, label: "Comuna 3 (Centro Histórico)" },
  { id: 3, label: "Comuna 10" },
  { id: 4, label: "Comuna 13" },
  { id: 5, label: "Zonas Norte" },
  { id: 6, label: "Zonas Sur" },
  { id: 7, label: "Equipos Offline" },
];

export const AGENT_MODES = [
  { id: 'auto', label: 'Modo Auto', icon: 'auto_awesome' },
  { id: 'chart', label: 'Modo Gráficas', icon: 'bar_chart' },
  { id: 'table', label: 'Modo Tablas (CSV)', icon: 'table' },
];

export const MOCK_HISTORY = [
  { id: 'chat-1', title: 'Análisis Comuna 13', date: 'Hoy' },
  { id: 'chat-2', title: 'Reporte Nodos Caídos', date: 'Ayer' },
  { id: 'chat-3', title: 'Rendimiento Estadio', date: 'Ayer' },
  { id: 'chat-4', title: 'Comparativa Norte vs Sur', date: 'Hace 3 días' }
];

export const INITIAL_CHAT = [
  {
    id: 1,
    role: "ai",
    text: "¡Hola! Soy el asistente de red de Cali Connect. Puedo proporcionarte datos en tiempo real, generar visualizaciones de tráfico o ayudarte con el estado de los nodos en cualquier comuna. ¿En qué puedo apoyarte hoy?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    role: "user",
    text: "Genera una gráfica de uso por horario en el Centro Histórico para hoy.",
    timestamp: new Date(Date.now() - 3500000).toISOString()
  },
  {
    id: 3,
    role: "ai",
    text: "Entendido. Aquí tienes el desglose del tráfico de red para el Centro Histórico hoy. Se observa un pico significativo entre las 11:00 AM y las 2:00 PM, coincidiendo con la actividad comercial y turística.",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    chartData: [
      { time: '08:00', users: 120 },
      { time: '10:00', users: 240 },
      { time: '12:00', users: 510 },
      { time: '14:00', users: 480 },
      { time: '16:00', users: 350 },
      { time: '18:00', users: 290 },
      { time: '20:00', users: 150 },
      { time: '22:00', users: 80 }
    ],
    chartConfig: {
      dataKey: "users",
      xAxisKey: "time",
      color: "var(--color-primary-container, #004851)",
      title: "Usuarios Activos (Centro Histórico)"
    }
  }
];

// Helper to generate a mock response
export const generateMockResponse = (inputText, mode) => {
  const result = {
    id: Date.now(),
    role: "ai",
    text: `Esta es una respuesta simulada procesando la solicitud: "${inputText}" utilizando el modelo: ${mode}.`,
    timestamp: new Date().toISOString()
  };

  if (mode === 'chart' || inputText.toLowerCase().includes('grafic') || inputText.toLowerCase().includes('gráfic')) {
    result.text = "Claro, aquí tienes la gráfica solicitada basándome en los datos operativos recientes.";
    result.chartData = [
      { category: 'C1', metric: 420 },
      { category: 'C3', metric: 310 },
      { category: 'C10', metric: 780 },
      { category: 'C13', metric: 630 },
      { category: 'C18', metric: 200 }
    ];
    result.chartConfig = {
      dataKey: "metric",
      xAxisKey: "category",
      color: "#2d6670",
      title: "Tráfico por Comuna"
    };
  }

  if (mode === 'table' || inputText.toLowerCase().includes('tabla') || inputText.toLowerCase().includes('excel')) {
    result.text = "He recopilado la información en formato de tabla para que puedas exportarla a Excel.";
    result.tableData = {
      headers: ["ID Equipo", "Ubicación", "Estado", "Uptime"],
      rows: [
        ["AP-401", "Parque del Perro", "Online", "99.9%"],
        ["AP-402", "Bulevar del Río", "Degraded", "82.1%"],
        ["AP-405", "San Antonio", "Offline", "0%"],
        ["AP-409", "Chipichape", "Online", "98.5%"],
      ]
    };
  }

  return result;
};
