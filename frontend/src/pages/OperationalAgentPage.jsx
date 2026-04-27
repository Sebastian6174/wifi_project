/**
 * OperationalAgentPage.jsx
 * Route entry for /dashboard/operational.
 * Delegates all UI and logic to the ManageOperationalAgent feature.
 */

import ManageOperationalAgent from '../features/manageOperationalAgent/ManageOperationalAgent';

export default function OperationalAgentPage() {
  return <ManageOperationalAgent />;
}
