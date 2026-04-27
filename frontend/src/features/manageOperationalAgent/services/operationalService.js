/**
 * operationalService.js  (manageOperationalAgent/services)
 * API calls for the Operational Agent.
 */

import api from '../../../shared/services/apiClient';

export const getAlerts        = ()       => api.get('/agents/operational/alerts');
export const getWorkOrders    = ()       => api.get('/agents/operational/work-orders');
export const assignTechnician = (orderId, techId) =>
  api.patch(`/agents/operational/work-orders/${orderId}/assign`, { technicianId: techId });
export const resolveOrder     = (orderId) =>
  api.patch(`/agents/operational/work-orders/${orderId}/resolve`);
