/**
 * LoginVisualPanel.jsx  (manageLogin/components)
 * Left-side decorative panel with city image and hero copy.
 * Hidden on mobile, visible lg+.
 */

import loginImage from '../../../assets/loginImage.jpg';

export default function LoginVisualPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end justify-start p-12"
         style={{ backgroundColor: 'var(--md-primary-container)' }}>

      {/* Background image + gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={loginImage}
          alt="Cali, Colombia — skyline al atardecer con infraestructura moderna e iluminación vibrante"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--md-primary-container) 0%, color-mix(in srgb, var(--md-primary-container) 80%, transparent) 50%, transparent 100%)`,
          }}
        />
        {/* Salsa-path cultural decoration */}
        <div className="absolute inset-0 salsa-path-bg opacity-30" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10" style={{ color: 'var(--md-on-primary)' }}>
        {/* Hub icon */}
        <div className="mb-4">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ color: 'var(--md-secondary-fixed-dim)', fontSize: '36px' }}
          >
            hub
          </span>
        </div>

        <h1
          className="font-montserrat mb-4 leading-tight"
          style={{
            fontSize: '48px',
            lineHeight: '56px',
            letterSpacing: '-0.02em',
            fontWeight: 700,
            color: 'var(--md-on-primary)',
          }}
        >
          Conectando el<br />Futuro de Cali
        </h1>

        <p
          className="max-w-md"
          style={{
            fontSize: '18px',
            lineHeight: '28px',
            fontWeight: 400,
            color: 'var(--md-primary-fixed)',
          }}
        >
          Infraestructura tecnológica avanzada para una ciudad en constante
          movimiento y evolución.
        </p>
      </div>
    </div>
  );
}
