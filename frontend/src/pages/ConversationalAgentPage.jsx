/**
 * ConversationalAgentPage.jsx
 * Displays the Conversational Agent chat interface.
 * Responsibilities:
 *  - Accept natural-language questions from operators
 *  - Translate questions to SQL and query the database
 *  - Return answers in natural language with supporting evidence
 *
 * Feature owner: features/manageConversationalAgent
 */

import ManageConversationalAgent from '../features/manageConversationalAgent/ManageConversationalAgent';

export default function ConversationalAgentPage() {
  return <ManageConversationalAgent />;
}
