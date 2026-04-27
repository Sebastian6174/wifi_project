import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageUserMap from "../features/manageUserMap/ManageUserMap";
import ManageConversationalAgent from "../features/manageConversationalAgent/ManageConversationalAgent";
import AccessibilityMenu from "../shared/components/AccessibilityMenu";

import heroBg from "../assets/hero landing page.png";
import bulevarImg from "../assets/bulevar.png";
import cayzedoImg from "../assets/caideo.png";
import sanAntonioImg from "../assets/san antonio.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-[#f8fafc] text-[var(--md-on-background)] font-sans selection:bg-[#004851]/20 flex flex-col overflow-x-hidden relative">
      
      {/* ── Accessibility ── */}
      <AccessibilityMenu />

      {/* ── Navbar ── */}
      <header className="absolute top-0 z-50 w-full bg-black/30 backdrop-blur-md border-b border-white/10 shadow-sm px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-[#004851] flex items-center justify-center shadow-sm">
            <span
              className="material-symbols-outlined text-white text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              wifi
            </span>
          </div>
          <div>
            <h1 className="text-white font-black text-sm leading-none tracking-tight">
              Cali Conecta
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 bg-[#004851] hover:bg-[#003840] text-white px-4 py-2 rounded-full font-semibold text-[10px] sm:text-[11px] shadow hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">login</span>
          <span className="hidden sm:inline">Portal de Acceso</span>
        </button>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black px-6">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} className="w-full h-full object-cover" alt="Hero Cali" />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold text-[10px] uppercase tracking-wider mb-6 shadow-sm">
            Internet Público Gratuito
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] mb-5">
            La sucursal del cielo, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              ahora conectada
            </span>
          </h2>
          <p className="text-xs sm:text-base text-slate-300 mb-8 max-w-xl mx-auto font-medium leading-relaxed">
            Descubre la nueva red inteligente de espacios públicos. Navega sin
            límites en los lugares más emblemáticos de Santiago de Cali.
          </p>
          <div className="flex justify-center">
            <a
              href="#mapa"
              className="px-6 py-3 bg-[#004851] text-white rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 border border-white/10"
            >
              <span className="material-symbols-outlined text-[18px]">
                explore
              </span>
              Ver Puntos de Cobertura
            </a>
          </div>
        </div>
      </section>

      {/* ── Galería Institucional (Cali) ── */}
      <section className="py-16 px-6 bg-white relative z-10 border-t border-slate-200 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004851]/10 text-[#004851] font-bold text-[11px] uppercase tracking-wider mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">public</span>
              Infraestructura Digital
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-[#001a1d] tracking-tight mb-6">
              Cali te conecta con el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004851] to-teal-500">futuro</span>
            </h3>
            <p className="text-slate-600 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed mb-4">
              El proyecto "Cali Conecta" liderado por la Gobernación, busca reducir la brecha digital desplegando una red WiFi gratuita y de alta velocidad en los espacios más transitados y emblemáticos de la ciudad.
            </p>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              No es solo internet; es una iniciativa integral que incorpora inteligencia artificial para guiar a los ciudadanos y turistas, asegurando una conexión estable para el estudio, el trabajo y el esparcimiento al aire libre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-48 rounded-xl overflow-hidden shadow group">
              <img
                src={bulevarImg}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Bulevar del Río"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Bulevar del Río
                  </h4>
                  <p className="text-orange-400 text-[10px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      wifi
                    </span>{" "}
                    Cobertura 100%
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-48 rounded-xl overflow-hidden shadow group">
              <img
                src={sanAntonioImg}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="San Antonio"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Colina de San Antonio
                  </h4>
                  <p className="text-orange-400 text-[10px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      wifi
                    </span>{" "}
                    Alta Velocidad
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-48 rounded-xl overflow-hidden shadow group">
              <img
                src={cayzedoImg}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Plaza de Cayzedo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Plaza de Cayzedo
                  </h4>
                  <p className="text-orange-400 text-[10px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      wifi
                    </span>{" "}
                    Cobertura Extendida
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section id="mapa" className="py-16 px-6 relative z-10 bg-[#f8fafc] min-h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="material-symbols-outlined text-[32px] text-orange-500 animate-bounce"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-[#001a1d] tracking-tight">
                  Mapa de Cobertura
                </h3>
              </div>
              <p className="text-slate-500 text-sm max-w-lg">
                Nuestra red detecta tu ubicación en tiempo real. Utiliza el mapa interactivo para encontrar tu punto de acceso óptimo.
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-3xl shadow-lg border border-slate-200">
            <ManageUserMap />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#004851] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance
            </span>
            <h1 className="text-[#001a1d] font-bold text-sm tracking-tight">
              Alcaldía de Santiago de Cali
            </h1>
          </div>
          <div className="flex gap-4 text-[10px] font-semibold text-slate-500">
            <a href="#mapa" className="hover:text-orange-500 transition-colors">
              Mapa
            </a>
            <a href="/login" className="hover:text-[#004851] transition-colors">
              Acceso Operadores
            </a>
          </div>
          <p className="text-[10px] text-slate-400">
            © 2026 Red WiFi Inteligente. Gobernación del Valle.
          </p>
        </div>
      </footer>

      {/* ── Floating Chatbot Button & Panel ── */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-[90vw] sm:w-[420px] md:w-[480px] h-[80vh] max-h-[700px] min-h-[500px] bg-white rounded-xl shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col animate-fade-in relative">
            {/* Header del Chat */}
            <div className="bg-[#004851] text-white px-4 py-3 flex justify-between items-center shadow-md z-20 relative shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_toy
                </span>
                <span className="font-bold text-xs">Asistente IA Caleño</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:text-orange-400 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
            {/* Contenido del Chat */}
            <div className="flex-1 relative flex flex-col min-h-0 bg-slate-50/50">
              <ManageConversationalAgent isLanding={true} />
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`size-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isChatOpen
              ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
              : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1"
          }`}
          aria-label="Abrir asistente IA"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isChatOpen ? "close" : "forum"}
          </span>
        </button>
      </div>
    </div>
  );
}
