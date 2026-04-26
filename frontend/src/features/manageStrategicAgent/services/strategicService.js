/**
 * strategicService.js  (manageStrategicAgent/services)
 * API calls for the Strategic Agent.
 */

import api from '../../../shared/services/apiClient';

/** Fetch KPI statistics for all APs */
export const getKPIs            = ()         => api.get('/agents/strategic/kpis');

/** Fetch investment recommendations */
export const getRecommendations = ()         => api.get('/agents/strategic/recommendations');

/** Fetch geospatial data for the map */
export const getGeoData         = ()         => api.get('/agents/strategic/geo');

/** Get detailed stats for a specific AP */
export const getAPDetail        = (apId)     => api.get(`/agents/strategic/ap/${apId}`);
