/**
 * ManageOperationalAgent.jsx
 * Orchestrator component for the Operational Agent feature.
 * Imports from: components/, hooks/, utils/
 */

import PageHeader from '../../shared/components/PageHeader';
import { AlertTriangle } from 'lucide-react';

export default function ManageOperationalAgent() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Operational Agent"
        subtitle="Detección de anomalías y asignación automática de técnicos"
        icon={AlertTriangle}
        badge="En vivo"
      />
      {/* TODO: Add AnomalyList, WorkOrderBoard, TechnicianMap components */}
      <div className="card agent-operational">
        <p className="text-[var(--color-text-secondary)] text-sm">
          Functional components coming soon — scaffold ready.
        </p>
      </div>
    </div>
  );
}
