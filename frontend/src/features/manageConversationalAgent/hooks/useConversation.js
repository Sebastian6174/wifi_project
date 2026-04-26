/**
 * useConversation.js  (manageConversationalAgent/hooks)
 * Manages chat message state and API interaction.
 */

import { useState } from 'react';
import { sendQuery } from '../services/conversationalService';

/** @typedef {{ id: string; role: 'user'|'assistant'; content: string; sql?: string; timestamp: Date }} Message */

export default function useConversation() {
  const [messages, setMessages]   = useState(/** @type {Message[]} */ ([]));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const sendMessage = async (question) => {
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const { answer, sql } = await sendQuery(question);
      const assistantMsg = {
        id:        crypto.randomUUID(),
        role:      'assistant',
        content:   answer,
        sql,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => { setMessages([]); setError(null); };

  return { messages, isLoading, error, sendMessage, clearChat };
}
