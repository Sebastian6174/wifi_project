/**
 * AppRouter.jsx
 * Central route configuration for WiFi Inteligente Cali.
 *
 * Route map:
 *   /           → LoginPage      (unauthenticated entry)
 *   /dashboard  → Protected layout with Outlet
 *     /dashboard/operational    → OperationalAgentPage
 *     /dashboard/conversational → ConversationalAgentPage
 *     /dashboard/strategic      → StrategicAgentPage
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage               from '../pages/LoginPage';
import OperationalAgentPage    from '../pages/OperationalAgentPage';
import ConversationalAgentPage from '../pages/ConversationalAgentPage';
import StrategicAgentPage      from '../pages/StrategicAgentPage';
import ApplyStrategyPage      from '../pages/ApplyStrategyPage';
import TechniciansPage         from '../pages/TechniciansPage';
import ActiveTicketPage        from '../pages/ActiveTicketPage';
import TicketHistoryPage      from '../pages/TicketHistoryPage';
import DashboardLayout         from '../shared/components/DashboardLayout';
import ProtectedRoute          from '../shared/components/ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected — requires authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default child — redirect to operational */}
          <Route index element={<Navigate to="operational" replace />} />

          <Route path="operational"    element={<OperationalAgentPage />} />
          <Route path="conversational" element={<ConversationalAgentPage />} />
          <Route path="strategic"      element={<StrategicAgentPage />} />
          <Route path="strategic-apply" element={<ApplyStrategyPage />} />
          <Route path="technicians"    element={<TechniciansPage />} />
        </Route>

        {/* Technician routes */}
        <Route path="/technician">
          <Route
            index
            element={
              <ProtectedRoute>
                <ActiveTicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <TicketHistoryPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
