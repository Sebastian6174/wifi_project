/**
 * ManageStrategicAgent.jsx
 * Orchestrator component for the Strategic Agent feature.
 * Imports from: components/, hooks/, utils/
 */

import PageHeader from '../../shared/components/PageHeader';
import { BarChart2 } from 'lucide-react';

export default function ManageStrategicAgent() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Strategic Agent"
        subtitle="Análisis geoespacial y recomendaciones de inversión para los AP de Cali"
        icon={BarChart2}
        badge="Analítica"
      />
      {/* TODO: Add GeoMap, KPICards, InvestmentRecommendations components */}
      <div className="card agent-strategic">
        <p className="text-[var(--color-text-secondary)] text-sm">
          Functional components coming soon — scaffold ready.
        </p>
      </div>
    </div>
  );
}
