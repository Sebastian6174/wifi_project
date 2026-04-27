import { Outlet, useNavigate, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AccessibilityMenu from "./AccessibilityMenu";

export default function UserLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--md-background)] text-[var(--md-on-surface)] flex flex-col">
      <AccessibilityMenu />

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-[#004851] flex items-center justify-center shadow-md">
            <span
              className="material-symbols-outlined text-white text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              wifi
            </span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[#004851] font-black text-sm leading-tight tracking-tight">
              Cali Conecta
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              WiFi Público
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <NavLink
            to="/user"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-white text-[#004851] shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`
            }
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              map
            </span>
            <span className="hidden sm:inline">Mapa WiFi</span>
          </NavLink>

          <NavLink
            to="/user/chat"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-white text-[#004851] shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`
            }
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              forum
            </span>
            <span className="hidden sm:inline">Chat IA</span>
          </NavLink>
        </nav>

        {/* User / Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-800">
              {user?.name || "Usuario"}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              {user?.email || "Invitado"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="size-9 rounded-xl flex items-center justify-center text-slate-500 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col relative overflow-auto salsa-pattern">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
