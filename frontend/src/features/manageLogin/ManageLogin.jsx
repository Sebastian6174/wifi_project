/**
 * ManageLogin.jsx
 * Orchestrator component for the Login / Home feature.
 * Imports from: components/, hooks/, utils/
 */

import LoginForm from './components/LoginForm';

export default function ManageLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-950)] via-[var(--color-primary-800)] to-[var(--color-primary-700)] p-4">
      <LoginForm />
    </div>
  );
}
