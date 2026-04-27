import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../shared/hooks/useAuth";

export default function TechnicianLayout({ children }) {
  const location = useLocation();
  const isHistory = location.pathname.includes("history");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-[#f8f9ff] font-public-sans text-[#0b1c30] min-h-screen selection:bg-[var(--md-primary-container)] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-4 h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm z-50">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[var(--md-primary-container)] text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            settings_input_antenna
          </span>
          <span className="text-base font-bold text-[#004851] tracking-tight">
            Cali-Tech WiFi
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </button>
          <div className="h-7 w-7 rounded-full bg-[var(--md-primary-container)] overflow-hidden">
            <img
              alt="Tech"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp3NQnL1fD97AyL66mIuZgmlPcCLIHQxT_Joix432DVoVm-IAh5nSJ9aFMwBqvPsoMPN8T7Dmr-oLnx30suGInqXxWJJeCRL0wwCyjjZeZmsrLCMmPvPcNJj5v4qoNxv4ZiOdKMT6PwrcdGpybfzVS8Lu1xq7u_sV5U4p9qiikRqgWYGu49kLRchUYz5lWYAN1WzS1tBMqcm1lvAdZtkGrDVn_jR3y9AolCAibNGR2z2_TcRndjbb4P2LRSzKUPdltioXkkTN2_Is"
            />
          </div>
        </div>
      </header>

      <div className="flex pt-14 min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-52 fixed h-[calc(100vh-56px)] bg-white border-r border-slate-200/50 p-4 z-40">
          <nav className="space-y-1.5 flex-grow">
            <div className="mb-6">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 px-2">
                Work Space
              </p>
              <Link
                to="/technician"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                  !isHistory
                    ? "text-[#004851] font-bold bg-[#004851]/10"
                    : "text-slate-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{
                    fontVariationSettings: !isHistory ? "'FILL' 1" : "",
                  }}
                >
                  assignment
                </span>
                <span className="text-sm">Active Ticket</span>
              </Link>
              <Link
                to="/technician/history"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                  isHistory
                    ? "text-[#004851] font-bold bg-[#004851]/10"
                    : "text-slate-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isHistory ? "'FILL' 1" : "" }}
                >
                  history
                </span>
                <span className="text-sm">History</span>
              </Link>
            </div>
          </nav>

          {/* Sidebar footer — matches admin layout */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-1 px-2">
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

        {/* Main Content Area */}
        <main className="flex-grow md:ml-52 p-4 md:p-6 relative">
          {/* Subtle Salsa Path BG */}
          <div
            className="fixed inset-0 z-[-1] opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(0, 72, 81, 1) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          {children}
        </main>
      </div>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 h-16 bg-white/90 backdrop-blur-md border-t border-slate-200/50 shadow-[0_-4px_12px_rgba(0,72,81,0.08)] z-50 rounded-t-xl">
        <Link
          to="/technician"
          className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 transition-all ${
            !isHistory ? "text-[#004851] bg-[#004851]/10" : "text-slate-400"
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: !isHistory ? "'FILL' 1" : "" }}
          >
            assignment
          </span>
          <span className="text-[9px] font-bold">Active</span>
        </Link>
        <Link
          to="/technician/history"
          className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 transition-all ${
            isHistory ? "text-[#004851] bg-[#004851]/10" : "text-slate-400"
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: isHistory ? "'FILL' 1" : "" }}
          >
            history
          </span>
          <span className="text-[9px] font-medium">History</span>
        </Link>
      </nav>
    </div>
  );
}
