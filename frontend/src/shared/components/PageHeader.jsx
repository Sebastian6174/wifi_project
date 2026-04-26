/**
 * PageHeader.jsx  (shared)
 * Top Application Bar — fixed header used by DashboardLayout.
 *
 * Matches the "Cali-Tech Vision" top bar design:
 *   [Brand]  [Search bar — center]  [Notifications · Help · Settings · Avatar]
 *
 * Props:
 *  - title?        string   — overrides the default brand name
 *  - searchPlaceholder? string
 *  - onSearchChange?   (value: string) => void
 *  - notificationCount? number  — badge count (0 = no badge)
 *  - onNotificationsClick? () => void
 *  - onSettingsClick?      () => void
 */

import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function PageHeader({
  title               = 'Cali-Tech Vision',
  searchPlaceholder   = 'Buscar...',
  onSearchChange,
  notificationCount   = 3,
  onNotificationsClick,
  onSettingsClick,
}) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OP';

  return (
    <header className="topbar">
      <div className="topbar-inner">

        {/* ── Brand ── */}
        <div className="flex items-center gap-8">
          <span className="topbar-brand">{title}</span>

          {/* Search — hidden on mobile */}
          <div className="topbar-search hidden md:flex">
            <span className="material-symbols-outlined text-[var(--md-outline)] text-[18px] select-none">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              aria-label="Buscar"
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button
            className="topbar-icon-btn notif-badge"
            onClick={onNotificationsClick}
            aria-label={`Notificaciones${notificationCount ? ` (${notificationCount})` : ''}`}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          {/* Help */}
          <button
            className="topbar-icon-btn"
            aria-label="Ayuda"
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>

          {/* Settings */}
          <button
            className="topbar-icon-btn"
            onClick={onSettingsClick}
            aria-label="Configuración"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>

          {/* Avatar */}
          <div className="topbar-avatar" aria-label="Perfil de usuario">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ color: 'var(--md-primary-container)' }}
            >
              person
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
