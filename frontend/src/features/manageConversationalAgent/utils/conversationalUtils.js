/**
 * conversationalUtils.js  (manageConversationalAgent/utils)
 * Pure helpers for the Conversational Agent feature.
 */

/**
 * Format a chat timestamp to a short time string.
 * @param {Date} date
 * @returns {string}  e.g. "14:32"
 */
export function formatTimestamp(date) {
  return new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' }).format(date);
}

/**
 * Build example questions for the query input placeholder.
 * @returns {string}
 */
export function getExampleQuestion() {
  const examples = [
    '¿Cuál es el AP con peor rendimiento esta semana?',
    '¿Cuántos usuarios se conectaron ayer en el centro?',
    '¿Qué zonas tienen más de 500 conexiones diarias?',
    '¿Cuál es el tiempo promedio de sesión por zona?',
  ];
  return examples[Math.floor(Math.random() * examples.length)];
}
