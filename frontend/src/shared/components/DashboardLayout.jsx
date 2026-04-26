/**
 * DashboardLayout.jsx  (shared)
 * Full dashboard shell — TopBar + Sidebar + main Outlet.
 *
 * Sidebar design (image 1):
 *   - Network Control header with security icon
 *   - Three agent nav links (Operative, Conversational, Strategic)
 *   - Report Incident CTA button at the bottom
 *   - System Health + Support footer links
 *   NOTE: "Zonas de Acceso" section intentionally omitted per requirements.
 *
 * TopBar design (image 2):
 *   - Delegated to <PageHeader /> component
 */

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import PageHeader from './PageHeader';

/* ── Navigation items ── */
const NAV_ITEMS = [
  {
    to:       '/dashboard/operational',
    label:    'Operative Agent',
    icon:     'settings_input_antenna',
    iconFill: false,
  },
  {
    to:       '/dashboard/conversational',
    label:    'Conversational AI',
    icon:     'forum',
    iconFill: true,
  },
  {
    to:       '/dashboard/strategic',
    label:    'Strategic Dashboard',
    icon:     'query_stats',
    iconFill: false,
  },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--md-background)] text-[var(--md-on-surface)]">

      {/* ── Top App Bar ── */}
      <PageHeader />

      <div className="flex pt-16 min-h-screen">

        {/* ── Mobile overlay ── */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={[
            'sidebar sticky top-16 h-[calc(100vh-64px)]',
            /* mobile: slide in/out */
            'fixed lg:static z-40 transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          {/* Brand header */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="sidebar-brand-icon">
                <span
                  className="material-symbols-outlined text-white text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
              </div>
              <div>
                <p className="sidebar-brand-title">Network Control</p>
                <p className="sidebar-brand-sub">Santiago de Cali</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon, iconFill }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  ['dash-nav-link', isActive ? 'active' : ''].join(' ')
                }
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto px-6 flex flex-col gap-4 pt-6">
            {/* Report Incident CTA */}
            <button className="report-incident-btn">
              Report Incident
            </button>

            {/* Footer links */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
              <a href="#" className="sidebar-footer-link">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
                System Health
              </a>
              <a href="#" className="sidebar-footer-link">
                <span className="material-symbols-outlined text-[20px]">contact_support</span>
                Support
              </a>
              <button
                onClick={handleLogout}
                className="sidebar-footer-link w-full text-left hover:!text-red-500"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col relative h-[calc(100vh-64px)] overflow-auto salsa-pattern">
          {/* Mobile menu toggle */}
          <div className="lg:hidden p-4">
            <button
              className="topbar-icon-btn border border-slate-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          <div className="flex-1 p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
