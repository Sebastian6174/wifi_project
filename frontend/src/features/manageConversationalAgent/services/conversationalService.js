/**
 * conversationalService.js  (manageConversationalAgent/services)
 * API calls for the Conversational Agent.
 */

import api from '../../../shared/services/apiClient';

/** Send a natural language question and get an answer */
export const sendQuery    = (question)  => api.post('/agents/conversational/query', { question });

/** Fetch conversation history */
export const getHistory   = ()          => api.get('/agents/conversational/history');

/** Clear conversation history */
export const clearHistory = ()          => api.delete('/agents/conversational/history');
