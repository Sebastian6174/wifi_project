/**
 * useConversation.js  (manageConversationalAgent/hooks)
 * Manages chat message state and API interaction.
 */

import { useEffect, useState } from 'react';
import { sendQuery } from '../services/conversationalService';

/** @typedef {{ id: string; role: 'user'|'assistant'; content: string; sql?: string; timestamp: Date }} Message */

const STORAGE_KEY = 'wifi_conversational_chat_v1';

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
};

export default function useConversation() {
  const persisted = loadState();
  const [messages, setMessages] = useState(
    /** @type {Message[]} */ (persisted?.messages ?? []),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [threadId, setThreadId] = useState(
    () => persisted?.threadId ?? crypto.randomUUID(),
  );

  useEffect(() => {
    const payload = JSON.stringify({ messages, threadId });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [messages, threadId]);

  const sendMessage = async (question, options = {}) => {
    const { modeId = "auto" } = options;
    const hint =
      modeId === "chart"
        ? "\n\n[Preferencia del usuario: si es posible, responde con grafica y datos agregados para barras.]"
        : modeId === "table"
          ? "\n\n[Preferencia del usuario: si es posible, responde con tabla.]"
          : "";
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      text: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendQuery({ message: `${question}${hint}`, threadId });
      if (response?.thread_id) {
        setThreadId(response.thread_id);
      }

      const chartConfig = response?.chart_config
        ? {
            dataKey: response.chart_config.y_key,
            xAxisKey: response.chart_config.x_key,
            color: response.chart_config.color || 'var(--md-primary-container)',
            title: response.chart_config.title,
          }
        : null;

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: response?.answer ?? 'Sin respuesta.',
        sql: response?.sql,
        rowCount: response?.row_count ?? null,
        tableData: response?.show_table ? response?.table_data : null,
        chartData: response?.show_chart ? response?.chart_data : null,
        chartConfig: response?.show_chart ? chartConfig : null,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setThreadId(crypto.randomUUID());
  };

  return { messages, isLoading, error, sendMessage, clearChat, threadId };
}
