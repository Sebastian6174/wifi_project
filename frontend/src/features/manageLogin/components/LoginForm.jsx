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

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const [role, setRole] = useState("admin"); // 'admin' | 'technician'
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login({ ...form, role });
    if (ok) navigate("/dashboard");
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
            {/* Role toggle */}
            <div
              className="p-1 rounded-lg flex mb-6"
              style={{ backgroundColor: s.surfaceContainer }}
            >
              {["admin", "technician"].map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex-1 py-2 px-4 rounded-md transition-colors duration-200"
                    style={{
                      backgroundColor: active
                        ? s.surfaceContainerLowest
                        : "transparent",
                      color: active ? s.primaryContainer : s.onSurfaceVariant,
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: "0.02em",
                      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                      border: active ? `1px solid ${s.outlineVariant}` : "none",
                    }}
                  >
                    {r === "admin" ? "Admin" : "Technician"}
                  </button>
                );
              })}
            </div>

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
            <div className="flex items-center justify-between">
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

            {/* Submit */}
            <div>
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
