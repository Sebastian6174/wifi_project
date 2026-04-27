import { useState, useEffect } from "react";

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Accessibility states
  const [fontSize, setFontSize] = useState(16); // px
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleIncreaseFont = () => {
    if (fontSize < 24) setFontSize((prev) => prev + 2);
  };

  const handleDecreaseFont = () => {
    if (fontSize > 12) setFontSize((prev) => prev - 2);
  };

  const handleReset = () => {
    setFontSize(16);
    setIsHighContrast(false);
    setIsDarkMode(false);
  };

  return (
    <div className="fixed left-0 top-1/3 -translate-y-1/2 z-[100] flex items-start">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#004851] text-white p-2 sm:p-3 rounded-r-xl shadow-lg hover:bg-[#003840] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004851]"
        aria-label="Abrir menú de accesibilidad"
      >
        <span className="material-symbols-outlined text-[24px] sm:text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          accessibility_new
        </span>
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="ml-2 w-64 bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 animate-slide-in-left overflow-hidden">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-bold text-[#004851] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">settings_accessibility</span>
              Accesibilidad
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* Tamaño de texto */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Tamaño de Texto</p>
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <button
                  onClick={handleDecreaseFont}
                  disabled={fontSize <= 12}
                  className="flex-1 py-1.5 flex items-center justify-center text-slate-600 bg-white rounded shadow-sm border border-slate-200 hover:bg-slate-100 disabled:opacity-50"
                  aria-label="Disminuir texto"
                >
                  <span className="font-bold text-sm">A-</span>
                </button>
                <div className="px-2 text-xs font-bold text-slate-500">{fontSize}px</div>
                <button
                  onClick={handleIncreaseFont}
                  disabled={fontSize >= 24}
                  className="flex-1 py-1.5 flex items-center justify-center text-slate-600 bg-white rounded shadow-sm border border-slate-200 hover:bg-slate-100 disabled:opacity-50"
                  aria-label="Aumentar texto"
                >
                  <span className="font-bold text-lg">A+</span>
                </button>
              </div>
            </div>

            {/* Contrastes y Modos */}
            <div className="space-y-2">
              {/* Alto Contraste */}
              <button
                onClick={() => setIsHighContrast(!isHighContrast)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                  isHighContrast
                    ? "bg-[#004851] text-white border-[#004851]"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    contrast
                  </span>
                  <span className="text-xs font-semibold">Alto Contraste</span>
                </div>
                {isHighContrast && <span className="material-symbols-outlined text-[16px]">check</span>}
              </button>

              {/* Modo Oscuro */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-[#004851] text-white border-[#004851]"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    dark_mode
                  </span>
                  <span className="text-xs font-semibold">Modo Oscuro</span>
                </div>
                {isDarkMode && <span className="material-symbols-outlined text-[16px]">check</span>}
              </button>
            </div>

            {/* Restablecer */}
            <button
              onClick={handleReset}
              className="w-full mt-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              Restablecer valores
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
