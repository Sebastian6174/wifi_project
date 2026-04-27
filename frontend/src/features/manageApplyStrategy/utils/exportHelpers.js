/**
 * exportHelpers.js
 * Utility functions to export the strategy plan as CSV or printable HTML.
 */

function escapeCSV(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n"))
    return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function rowToCSV(cells) {
  return cells.map(escapeCSV).join(",");
}

/** Download a string as a file in the browser */
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Export the full plan as a structured CSV workplan */
export function exportCSV({ meta, steps, budgetItems }) {
  const lines = [];

  // Meta block
  lines.push("PLAN DE EJECUCION ESTRATEGICA - WiFi Inteligente Cali");
  lines.push(rowToCSV(["Titulo", meta.title]));
  lines.push(rowToCSV(["Zona", meta.zone]));
  lines.push(rowToCSV(["Enfoque", meta.focus]));
  lines.push(rowToCSV(["Prioridad", meta.priority]));
  lines.push(rowToCSV(["Descripcion", meta.description]));
  lines.push("");

  // Steps block
  lines.push("FASES DE EJECUCION");
  lines.push(rowToCSV(["#", "Titulo", "Responsable", "Inicio", "Fin", "Horas", "Estado", "Notas"]));
  steps.forEach((s, i) => {
    lines.push(rowToCSV([i + 1, s.title, s.owner, s.startDate, s.endDate, s.hours, s.status, s.notes]));
  });
  lines.push("");

  // Budget block
  const subtotal = budgetItems.reduce((acc, r) => acc + r.unitCost * r.qty, 0);
  const contingency = subtotal * 0.1;
  lines.push("ESTIMACION DE COSTOS (USD)");
  lines.push(rowToCSV(["Categoria", "Descripcion", "Cantidad", "Costo Unitario", "Total"]));
  budgetItems.forEach((r) => {
    lines.push(rowToCSV([r.category, r.description, r.qty, r.unitCost, r.qty * r.unitCost]));
  });
  lines.push(rowToCSV(["", "", "", "Subtotal", subtotal.toFixed(2)]));
  lines.push(rowToCSV(["", "", "", "Contingencia 10%", contingency.toFixed(2)]));
  lines.push(rowToCSV(["", "", "", "TOTAL", (subtotal + contingency).toFixed(2)]));

  downloadFile(
    `plan-estrategia-${meta.title.replace(/\s+/g, "-").toLowerCase()}.csv`,
    lines.join("\n"),
    "text/csv;charset=utf-8;"
  );
}

/** Export a minimal JSON executive summary for external tools */
export function exportJSON({ meta, steps, budgetItems }) {
  const subtotal = budgetItems.reduce((acc, r) => acc + r.unitCost * r.qty, 0);
  const payload = {
    generated: new Date().toISOString(),
    system: "WiFi Inteligente Cali — Agente Estratégico",
    plan: {
      ...meta,
      totalSteps: steps.length,
      totalHours: steps.reduce((a, s) => a + Number(s.hours || 0), 0),
      estimatedBudgetUSD: +(subtotal * 1.1).toFixed(2),
      phases: steps.map((s) => ({
        title: s.title,
        owner: s.owner,
        startDate: s.startDate,
        endDate: s.endDate,
        estimatedHours: s.hours,
        status: s.status,
      })),
      budget: budgetItems.map((r) => ({
        category: r.category,
        description: r.description,
        qty: r.qty,
        unitCostUSD: r.unitCost,
        totalUSD: r.qty * r.unitCost,
      })),
    },
  };
  downloadFile(
    `plan-ejecutivo-${meta.title.replace(/\s+/g, "-").toLowerCase()}.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  );
}

/** Trigger browser print dialog for a print-friendly view */
export function printPlan() {
  window.print();
}
