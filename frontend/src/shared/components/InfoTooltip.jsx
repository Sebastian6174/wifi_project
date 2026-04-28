import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * InfoTooltip — uses a portal + fixed positioning so it is NEVER clipped
 * by parent overflow:hidden cards.
 */
export default function InfoTooltip({ text, title }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const updatePos = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      top: r.top + window.scrollY - 8,          // above the icon
      left: r.left + r.width / 2 + window.scrollX,
    });
  };

  useEffect(() => {
    if (open) updatePos();
  }, [open]);

  const tooltip = (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -100%)",
        zIndex: 99999,
        width: 224,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "rgba(0, 28, 33, 0.97)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(90, 176, 188, 0.25)",
          boxShadow: "0 12px 40px rgba(0, 72, 81, 0.45)",
          borderRadius: 12,
          padding: "10px 14px",
        }}
      >
        {title && (
          <p style={{ fontSize: 9, fontWeight: 900, color: "#5ab0bc", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
            {title}
          </p>
        )}
        <p style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 500, lineHeight: 1.55 }}>{text}</p>
      </div>
      {/* Arrow */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "7px solid rgba(0, 28, 33, 0.97)" }} />
      </div>
    </div>
  );

  return (
    <span
      ref={ref}
      className="relative inline-flex items-center"
      onMouseEnter={() => { updatePos(); setOpen(true); }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-[#004851] hover:bg-[#004851]/10 transition-all duration-150 focus:outline-none"
        aria-label="Más información"
        tabIndex={0}
        onFocus={() => { updatePos(); setOpen(true); }}
        onBlur={() => setOpen(false)}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14, lineHeight: 1 }}>info</span>
      </button>
      {open && createPortal(tooltip, document.body)}
    </span>
  );
}
