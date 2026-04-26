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

      <div className="flex pt-12 min-h-screen">

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
            'sidebar sticky top-12 h-[calc(100vh-48px)]',
            /* mobile: slide in/out */
            'fixed lg:static z-40 transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          {/* Brand header */}
          <div className="px-5 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="sidebar-brand-icon p-1.5">
                <span
                  className="material-symbols-outlined text-white text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
              </div>
              <div>
                <p className="sidebar-brand-title text-sm">Network Control</p>
                <p className="sidebar-brand-sub text-[10px]">Santiago de Cali</p>
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
                  ['dash-nav-link text-xs py-2', isActive ? 'active' : ''].join(' ')
                }
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto px-5 flex flex-col gap-3 pt-5">
            {/* Report Incident CTA */}
            <button className="report-incident-btn text-xs py-2">
              Report Incident
            </button>

            {/* Footer links */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-1">
              <a href="#" className="sidebar-footer-link text-xs py-1.5">
                <span className="material-symbols-outlined text-[16px]">analytics</span>
                System Health
              </a>
              <a href="#" className="sidebar-footer-link text-xs py-1.5">
                <span className="material-symbols-outlined text-[16px]">contact_support</span>
                Support
              </a>
              <button
                onClick={handleLogout}
                className="sidebar-footer-link w-full text-left hover:!text-red-500 text-xs py-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col relative h-[calc(100vh-48px)] overflow-auto salsa-pattern">
          {/* Mobile menu toggle */}
          <div className="lg:hidden p-3">
            <button
              className="topbar-icon-btn border border-slate-200 p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[18px]">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          <div className="flex-1 p-5 animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
