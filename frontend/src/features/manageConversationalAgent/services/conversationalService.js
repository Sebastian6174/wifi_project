/**
 * conversationalService.js  (manageConversationalAgent/services)
 * API calls for the Conversational Agent.
 */

import api from '../../../shared/services/apiClient';

/** Send a natural language question and get an answer */
export const sendQuery = ({ message, threadId }) =>
	api.post('/agents/conversacional/dedicado', {
		message,
		thread_id: threadId,
	});
