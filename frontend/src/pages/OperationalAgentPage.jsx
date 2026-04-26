/**
 * OperationalAgentPage.jsx
 * Displays the Operational Agent dashboard.
 * Responsibilities:
 *  - Real-time anomaly & fault detection on public WiFi APs
 *  - Automatic prioritized work-order creation
 *  - Technician assignment without human intervention
 *
 * Feature owner: features/manageOperationalAgent
 */

import ManageOperationalAgent from '../features/manageOperationalAgent/ManageOperationalAgent';

export default function OperationalAgentPage() {
  return <ManageOperationalAgent />;
}
