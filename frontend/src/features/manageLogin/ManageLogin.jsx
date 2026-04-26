/**
 * ManageLogin.jsx
 * Orchestrator for the Login / Home feature.
 * Composes LoginVisualPanel (left) + LoginForm (right)
 * into the full-screen two-column layout.
 */

import LoginVisualPanel from './components/LoginVisualPanel';
import LoginForm        from './components/LoginForm';

export default function ManageLogin() {
  return (
    <div
      className="h-screen overflow-hidden flex font-montserrat"
      style={{ backgroundColor: 'var(--md-background)', color: 'var(--md-on-background)' }}
    >
      {/* Left — city image panel (desktop only) */}
      <LoginVisualPanel />

      {/* Right — login form panel */}
      <LoginForm />
    </div>
  );
}
