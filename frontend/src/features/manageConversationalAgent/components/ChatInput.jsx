import { useState, useRef, useEffect } from "react";
import { CONTEXT_PAGES, AGENT_MODES } from "../utils/mockChat";

export default function ChatInput({
  onSendMessage,
  onSelectSuggestion,
  suggestions,
}) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState(AGENT_MODES[0]);
  const [contextOpen, setContextOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const contextWrapperRef = useRef(null);
  const modeWrapperRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicking entirely outside the ChatInput
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (text.trim() === "") {
          setIsExpanded(false);
        }
        setContextOpen(false);
        setModeOpen(false);
      } else {
        // If clicking inside ChatInput, but outside active popovers, close them
        if (
          contextWrapperRef.current &&
          !contextWrapperRef.current.contains(e.target)
        ) {
          setContextOpen(false);
        }
        if (
          modeWrapperRef.current &&
          !modeWrapperRef.current.contains(e.target)
        ) {
          setModeOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim(), mode.id, selectedContext);
    setText("");
    setSelectedContext([]);
    setIsExpanded(false);
    setContextOpen(false);
    setModeOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleContext = (page) => {
    setSelectedContext((prev) =>
      prev.find((p) => p.id === page.id)
        ? prev.filter((p) => p.id !== page.id)
        : [...prev, page],
    );
  };

  const handleFocus = () => setIsExpanded(true);
  const handleSuggestionClick = (suggestion) => {
    if (!suggestion) return;
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion, mode.id, selectedContext);
      return;
    }
    onSendMessage(suggestion, mode.id, selectedContext);
  };

  return (
    <div className="w-full bg-gradient-to-t from-background via-background to-transparent pb-6 pt-8 px-4 sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-3" ref={containerRef}>
        {Array.isArray(suggestions) && suggestions.length > 0 && (
          <div className="flex flex-col gap-2 px-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sugerencias
              </p>
              <button
                type="button"
                onClick={() => setShowSuggestions((prev) => !prev)}
                className="text-[10px] font-bold text-slate-400 hover:text-[var(--md-primary-container)] transition-colors"
              >
                {showSuggestions ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {showSuggestions && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={`${suggestion}-${idx}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-[11px] font-bold text-slate-600 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-white hover:text-[var(--md-primary-container)] hover:border-[var(--md-primary-container)]/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Input Container */}
        <div
          className={`relative group flex flex-col bg-white border rounded-3xl shadow-sm transition-all duration-500 ease-out overflow-visible ${
            isExpanded
              ? "border-[var(--md-primary-container)]/30 shadow-md"
              : "border-slate-200"
          }`}
        >
          {/* Top Bar: Add Context (Smooth Expand) */}
          <div
            className="grid transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
          >
            <div
              className={isExpanded ? "overflow-visible" : "overflow-hidden"}
            >
              <div
                className={`flex flex-col gap-3 px-3 pt-4 pb-2 border-b border-slate-100/50 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
              >
                {/* Context Selector */}
                <div className="relative" ref={contextWrapperRef}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setContextOpen(!contextOpen);
                    }}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[var(--md-primary-container)] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      add_circle
                    </span>
                    Contexto de Zona
                    {selectedContext.length > 0 && (
                      <span className="bg-[var(--md-primary-container)] text-white size-4 rounded-full flex items-center justify-center text-[9px]">
                        {selectedContext.length}
                      </span>
                    )}
                  </button>

                  {contextOpen && isExpanded && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 animate-fade-in [animation-duration:150ms] origin-bottom-left">
                      <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Select Area
                        </p>
                      </div>
                      <div className="max-h-48 overflow-y-auto pr-1">
                        {CONTEXT_PAGES.map((page) => {
                          const isSelected = selectedContext.find(
                            (p) => p.id === page.id,
                          );
                          return (
                            <button
                              key={page.id}
                              onClick={() => toggleContext(page)}
                              className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between ${
                                isSelected
                                  ? "bg-[var(--md-primary-container)]/10 text-[var(--md-primary-container)] font-bold"
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {page.label}
                              {isSelected && (
                                <span className="material-symbols-outlined text-[14px]">
                                  check
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Text Area (Always Visible) */}
          <div
            className={`flex gap-2 p-2 px-3 transition-all duration-300 ${isExpanded ? "items-end" : "items-center"}`}
          >
            {!isExpanded && (
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-[var(--md-primary-container)] transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add_circle
                </span>
              </button>
            )}

            <textarea
              ref={textareaRef}
              value={text}
              onFocus={handleFocus}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 resize-none outline-none transition-all duration-300 ${
                isExpanded
                  ? "min-h-[44px] py-3 px-2"
                  : "min-h-[24px] py-1.5 px-2"
              }`}
              placeholder="Haz tu consulta sobre la red de Cali..."
              rows={1}
            />

            {!isExpanded && (
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="bg-black/30 text-white p-2 rounded-full hover:bg-[var(--md-primary-container)] transition-colors flex items-center justify-center size-9 flex-shrink-0 disabled:opacity-50 disabled:hover:bg-black/30"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  arrow_upward
                </span>
              </button>
            )}
          </div>

          {/* Bottom Bar: Mode Selector & Send (Smooth Expand) */}
          <div
            className="grid transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
          >
            <div
              className={isExpanded ? "overflow-visible" : "overflow-hidden"}
            >
              <div
                className={`flex items-center justify-between px-3 pb-3 pt-1 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
              >
                <div className="relative" ref={modeWrapperRef}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setModeOpen(!modeOpen);
                    }}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all font-public-sans"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)]">
                      {mode.icon}
                    </span>
                    {mode.label}
                    <span className="material-symbols-outlined text-[14px] text-slate-400">
                      expand_more
                    </span>
                  </button>

                  {modeOpen && isExpanded && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-fade-in [animation-duration:150ms] origin-bottom-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1.5">
                        Model Mode
                      </p>
                      {AGENT_MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setMode(m);
                            setModeOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                            mode.id === m.id
                              ? "bg-[var(--md-primary-container)] text-white font-bold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">
                              {m.icon}
                            </span>
                            {m.label}
                          </div>
                          {mode.id === m.id && (
                            <span className="material-symbols-outlined text-[14px]">
                              check
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {text.trim() === "" && (
                    <button
                      onClick={() => setIsExpanded(false)}
                      type="button"
                      className="text-[10px] font-bold px-3 py-2 text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    className="p-2 text-slate-400 hover:text-[var(--md-primary-container)] transition-colors rounded-full"
                    title="Adjuntar"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      attach_file
                    </span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className="bg-black text-white p-2 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[var(--md-primary-container)]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center size-9"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      arrow_upward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-1">
          Cali Connect AI puede cometer errores. Verifica la info base.
        </p>
      </div>
    </div>
  );
}
