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
import NotificationMenu from './NotificationMenu';

export default function PageHeader({
  title               = 'Cali-Tech Vision',
  searchPlaceholder   = 'Buscar...',
  onSearchChange,
  notificationCount   = 3,
  onNotificationsClick,
  onSettingsClick,
}) {
  const { user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);



  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OP';

  return (
    <header className="topbar">
      <div className="topbar-inner">

        {/* ── Brand ── */}
        <div className="flex items-center gap-4">
          <span className="topbar-brand">{title}</span>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-1">

          {/* Notifications */}
          <button
            className="topbar-icon-btn notif-badge p-1.5"
            onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); }}
            aria-label={`Notificaciones${notificationCount ? ` (${notificationCount})` : ''}`}
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>

          {/* Help */}
          <button
            className="topbar-icon-btn p-1.5"
            aria-label="Ayuda"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
          </button>

          {/* Settings */}
          <button
            className="topbar-icon-btn p-1.5"
            onClick={onSettingsClick}
            aria-label="Configuración"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>

          {/* Avatar */}
          <div className="topbar-avatar w-7 h-7 ml-1" aria-label="Perfil de usuario">
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ color: 'var(--md-primary-container)' }}
            >
              person
            </span>
          </div>
        </div>

      </div>

      <NotificationMenu isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </header>
  );
}
