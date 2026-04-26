/**
 * LoginForm.jsx  (manageLogin/components)
 * Authentication form with email + password fields.
 * Calls useLogin hook on submit.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Eye, EyeOff, LogIn } from 'lucide-react';
import useLogin from '../hooks/useLogin';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in shadow-[var(--shadow-modal)]">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary-600)] flex items-center justify-center mb-4 animate-pulse-glow">
          <Wifi size={28} className="text-[var(--color-primary-900)]" />
        </div>
        <h1 className="text-white text-2xl font-bold">WiFi Inteligente</h1>
        <p className="text-[var(--color-primary-300)] text-sm mt-1">Zonas Públicas · Cali</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-primary-200)] mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="operador@wifi.cali.gov.co"
            className="input bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--color-secondary-500)]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-primary-200)] mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input pr-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--color-secondary-500)]"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[var(--color-tertiary-400)] text-sm font-medium">{error}</p>
        )}

        <button
          id="btn-login-submit"
          type="submit"
          disabled={isLoading}
          className="btn btn-secondary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Ingresando…' : (
            <><LogIn size={16} /> Ingresar al Dashboard</>
          )}
        </button>
      </form>

      <p className="text-center text-[var(--color-primary-400)] text-xs mt-6">
        Hackathon · Zonas WiFi Inteligentes · Cali 2026
      </p>
    </div>
  );
}
