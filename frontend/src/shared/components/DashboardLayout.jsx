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

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import PageHeader from "./PageHeader";

/* ── Navigation items ── */
const NAV_ITEMS = [
  {
    to: "/dashboard/operational",
    label: "Operative Agent",
    icon: "settings_input_antenna",
    iconFill: false,
  },
  {
    to: "/dashboard/conversational",
    label: "Conversational AI",
    icon: "forum",
    iconFill: true,
  },
  {
    to: "/dashboard/strategic",
    label: "Strategic Dashboard",
    icon: "query_stats",
    iconFill: false,
  },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            "sidebar sticky top-16 h-[calc(100vh-64px)]",
            /* mobile: slide in/out */
            "fixed lg:static z-40 transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          {/* Simplified Brand section */}
          <div className="mb-8 px-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 opacity-60">Operación</p>
            <p className="text-sm font-black text-[#004851] tracking-tight">Santiago de Cali</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto px-2">
            {NAV_ITEMS.map(({ to, label, icon, iconFill }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "text-[#004851] font-bold bg-[#004851]/10"
                      : "text-slate-500 hover:bg-slate-50 font-medium"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{
                        fontVariationSettings: isActive || iconFill ? "'FILL' 1" : "",
                      }}
                    >
                      {icon}
                    </span>
                    <span className="text-sm">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-1 px-2 pb-4">
            <a
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-[#004851] hover:bg-slate-50 font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                analytics
              </span>
              System Health
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-[#004851] hover:bg-slate-50 font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                contact_support
              </span>
              Soporte
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-rose-500 hover:bg-rose-50 font-medium transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined text-[16px]">
                logout
              </span>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col relative h-[calc(100vh-64px)] overflow-auto salsa-pattern">
          {/* Mobile menu toggle */}
          <div className="lg:hidden p-3">
            <button
              className="topbar-icon-btn border border-slate-200 p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[18px]">
                {mobileOpen ? "close" : "menu"}
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
