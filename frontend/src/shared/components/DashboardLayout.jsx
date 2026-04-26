/**
 * DashboardLayout.jsx  (shared)
 * Persistent sidebar + top header shell used by all protected pages.
 * Child pages are rendered via <Outlet />.
 */

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Wifi, AlertTriangle, MessageSquare, BarChart2, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const NAV_ITEMS = [
  {
    to:    '/dashboard/operational',
    label: 'Operational Agent',
    icon:  AlertTriangle,
    color: 'text-tertiary-600',
    accent: 'agent-operational',
  },
  {
    to:    '/dashboard/conversational',
    label: 'Conversational Agent',
    icon:  MessageSquare,
    color: 'text-secondary-600',
    accent: 'agent-conversational',
  },
  {
    to:    '/dashboard/strategic',
    label: 'Strategic Agent',
    icon:  BarChart2,
    color: 'text-primary-400',
    accent: 'agent-strategic',
  },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-container flex-row min-h-screen bg-[var(--color-surface)]">

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-64 bg-[var(--color-primary-900)] flex flex-col z-30',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-secondary-600)] flex items-center justify-center animate-pulse-glow">
            <Wifi size={20} className="text-[var(--color-primary-900)]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">WiFi Inteligente</p>
            <p className="text-[var(--color-primary-300)] text-[11px]">Cali · Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary-400)] px-3 mb-3">
            AI Agents
          </p>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                ['nav-item', isActive ? 'active' : ''].join(' ')
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-[var(--color-neutral-400)] hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col lg:ml-64">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
          <button
            className="lg:hidden btn btn-icon btn-outlined"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <Wifi size={16} className="text-[var(--color-primary-600)]" />
            <span className="text-sm font-semibold text-[var(--color-primary-700)]">
              Zonas WiFi Públicas · Cali
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="badge badge-success">Sistema activo</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
