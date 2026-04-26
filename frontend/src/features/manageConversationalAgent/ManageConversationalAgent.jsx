/**
 * ManageConversationalAgent.jsx
 * Orchestrator component for the Conversational Agent feature.
 * Imports from: components/, hooks/, utils/
 */

import PageHeader from '../../shared/components/PageHeader';
import { MessageSquare } from 'lucide-react';

export default function ManageConversationalAgent() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Conversational Agent"
        subtitle="Consultas en lenguaje natural sobre la red WiFi de Cali"
        icon={MessageSquare}
        badge="NL → SQL"
      />
      {/* TODO: Add ChatInterface, QueryHistory, SqlPreview components */}
      <div className="card agent-conversational">
        <p className="text-[var(--color-text-secondary)] text-sm">
          Functional components coming soon — scaffold ready.
        </p>
      </div>
    </div>
  );
}
