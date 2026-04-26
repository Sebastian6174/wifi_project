/**
 * StrategicAgentPage.jsx
 * Displays the Strategic Agent analytics dashboard.
 * Responsibilities:
 *  - Cross-reference usage data with geospatial information
 *  - Generate charts and KPI statistics per Access Point (AP)
 *  - Recommend investment, maintenance or coverage expansion actions
 *
 * Feature owner: features/manageStrategicAgent
 */

import ManageStrategicAgent from '../features/manageStrategicAgent/ManageStrategicAgent';

export default function StrategicAgentPage() {
  return <ManageStrategicAgent />;
}
