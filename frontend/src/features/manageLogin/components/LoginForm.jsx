/**
 * LoginForm.jsx  (manageLogin/components)
 * Right-side authentication form — exact replica of the HTML design.
 *
 * Features:
 *  - Admin / Technician role tab selector
 *  - Email + password inputs with Material Symbols icons
 *  - Password visibility toggle
 *  - Remember-me checkbox + forgot-password link
 *  - Submit button with loading state
 *  - Minimal footer with Alcaldía branding
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

/** Derive role from email domain — production routing rule */
function getRoleFromEmail(email) {
  const domain = email.split("@")[1] ?? "";
  if (domain === "admin.com")   return "admin";
  if (domain === "tecnico.com") return "technician";
  return "user";
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = getRoleFromEmail(form.email);
    const ok   = await login({ ...form, role });
    if (ok) {
      if (role === "technician") navigate("/technician");
      else if (role === "user")  navigate("/user");
      else                       navigate("/dashboard");
    }
  };

  /* ── styles mapped from MD3 vars ── */
  const s = {
    primaryContainer: "var(--md-primary-container)",
    primary: "var(--md-primary)",
    onBackground: "var(--md-on-background)",
    onSurface: "var(--md-on-surface)",
    onSurfaceVariant: "var(--md-on-surface-variant)",
    surfaceContainerLowest: "var(--md-surface-container-lowest)",
    surfaceContainer: "var(--md-surface-container)",
    surfaceContainerHigh: "var(--md-surface-container-high)",
    outline: "var(--md-outline)",
    outlineVariant: "var(--md-outline-variant)",
  };

  return (
    /* Full-height right panel */
    <div
      className="w-full lg:w-1/2 flex flex-col h-screen"
      style={{ backgroundColor: s.surfaceContainerLowest }}
    >
      {/* ── Scrollable form area ── */}
      <div className="flex-grow flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* ── Header ── */}
          <div className="text-center sm:text-left mb-10">
            {/* Logo row */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
              <h2
                className="font-montserrat uppercase tracking-tighter"
                style={{
                  fontSize: "32px",
                  lineHeight: "40px",
                  letterSpacing: "-0.01em",
                  fontWeight: 900,
                  color: s.primaryContainer,
                }}
              >
                Cali-Tech Vision
              </h2>
            </div>

            <h3
              className="font-montserrat mb-2"
              style={{
                fontSize: "24px",
                lineHeight: "32px",
                fontWeight: 600,
                color: s.onBackground,
              }}
            >
              Bienvenido de nuevo
            </h3>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                color: s.onSurfaceVariant,
              }}
            >
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* ── Form ── */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: s.onSurface,
                }}
              >
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: s.outline, fontSize: "20px" }}
                  >
                    person
                  </span>
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ejemplo@cali.gov.co"
                  className="block w-full pl-10 pr-3 py-3 rounded-md leading-5 text-sm outline-none transition-all"
                  style={{
                    border: `1px solid ${s.outlineVariant}`,
                    backgroundColor: s.surfaceContainerLowest,
                    color: s.onBackground,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = s.primaryContainer;
                    e.target.style.boxShadow = `0 0 0 2px ${s.primaryContainer}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = s.outlineVariant;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: s.onSurface,
                }}
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: s.outline, fontSize: "20px" }}
                  >
                    lock
                  </span>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 rounded-md leading-5 text-sm outline-none transition-all"
                  style={{
                    border: `1px solid ${s.outlineVariant}`,
                    backgroundColor: s.surfaceContainerLowest,
                    color: s.onBackground,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = s.primaryContainer;
                    e.target.style.boxShadow = `0 0 0 2px ${s.primaryContainer}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = s.outlineVariant;
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                  style={{ color: s.outline }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = s.onSurfaceVariant)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = s.outline)
                  }
                  aria-label="Mostrar/ocultar contraseña"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    {showPwd ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{
                    accentColor: s.primaryContainer,
                    borderColor: s.outlineVariant,
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="cursor-pointer"
                  style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: s.onSurfaceVariant,
                  }}
                >
                  Recuérdame
                </label>
              </div>
              <a
                href="#"
                className="transition-colors"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: s.primaryContainer,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = s.primary)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = s.primaryContainer)
                }
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Error message */}
            {error && (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--md-error)" }}
              >
                {error}
              </p>
            )}

            {/* Submit & OAuth */}
            <div className="flex flex-col gap-3">
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md text-sm font-medium shadow-sm transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: s.primaryContainer,
                  color: "var(--md-on-primary)",
                  border: "1px solid transparent",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.backgroundColor = s.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = s.primaryContainer;
                }}
              >
                {isLoading ? (
                  "Iniciando sesión…"
                ) : (
                  <>
                    Iniciar Sesión
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      login
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  // Simulate generic Google login by auto-filling generic user email
                  setForm({ email: "usuario@gmail.com", password: "password" });
                }}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md text-sm font-medium shadow-sm transition-all duration-300 bg-white"
                style={{
                  border: `1px solid ${s.outlineVariant}`,
                  color: s.onBackground,
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = s.outline;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = s.outlineVariant;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 2px 0 rgb(0 0 0 / 0.05)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Iniciar sesión con Google
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto"
        style={{
          borderTop: `1px solid ${s.outlineVariant}4d`,
          backgroundColor: s.surfaceContainerLowest,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined"
            style={{ color: s.outline, fontSize: "18px" }}
          >
            account_balance
          </span>
          <span
            style={{
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 600,
              color: s.onSurfaceVariant,
            }}
          >
            Alcaldía de Santiago de Cali
          </span>
        </div>
        <div className="flex gap-4">
          {["Privacidad", "Términos"].map((label) => (
            <a
              key={label}
              href="#"
              className="transition-colors"
              style={{ fontSize: "12px", fontWeight: 600, color: s.outline }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = s.primaryContainer)
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = s.outline)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
