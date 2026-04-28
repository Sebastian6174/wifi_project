/**
 * operationalService.js  (manageOperationalAgent/services)
 * API calls for the Operational Agent.
 */

import api from '../../../shared/services/apiClient';

/**
 * Sends a prompt to the Operative Agent to trigger the anomaly prediction workflow.
 * @param {string} prompt 
 * @param {string} [context] 
 */
export const askOperativeAgent = (prompt, context = null) => 
  api.post('/agents/operativo', { prompt, context });

// Note: These endpoints are placeholders for future structured data integration
export const getAlerts        = ()       => Promise.resolve([]); // api.get('/data/active-tickets');
export const getWorkOrders    = ()       => Promise.resolve([]); // api.get('/data/work-orders');

