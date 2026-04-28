import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ChatHistorySidebar from "./components/ChatHistorySidebar";
import { SUGGESTED_PROMPTS } from "./utils/mockChat";
import useConversation from "./hooks/useConversation";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "¡Hola! Soy el asistente de red. Preguntame por tablas o graficas y mantendre el hilo de la conversacion.",
  timestamp: new Date().toISOString(),
};

export default function ManageConversationalAgent({ isLanding = false }) {
  const { messages, isLoading, error, sendMessage, clearChat } =
    useConversation();
  const allMessages = messages.length ? messages : [INITIAL_MESSAGE];
  const displayMessages = isLoading
    ? [
        ...allMessages,
        {
          id: "typing",
          role: "assistant",
          isTyping: true,
          timestamp: new Date().toISOString(),
        },
      ]
    : allMessages;
  const scrollRef = useRef(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto-scroll to bottom using window/main
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (text, modeId) => {
    sendMessage(text, { modeId });
  };

  const handleSelectSuggestion = (text, modeId) => {
    handleSendMessage(text, modeId);
  };

  return (
    <>
      <div
        className={`flex flex-col flex-1 animate-fade-in w-full relative ${isLanding ? "overflow-hidden" : "pb-0"}`}
      >
        {/* Floating History Action (Right aligned, sticks to top while scrolling) */}
        {!isLanding && (
          <div className="sticky top-4 right-4 sm:right-8 z-30 flex justify-end px-4 sm:px-8 pointer-events-none mb-[-40px]">
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center shadow-md gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-sm border border-slate-200 text-slate-600 transition-colors text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)]">
                  history
                </span>
                Historial
              </button>
              <button
                onClick={clearChat}
                className="flex items-center shadow-md gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-sm border border-slate-200 text-slate-600 transition-colors text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  delete
                </span>
                Borrar chat
              </button>
            </div>
          </div>
        )}

        {/* Messages List - Responsive bounds */}
        <div
          className={`flex flex-col max-w-4xl mx-auto w-full ${
            isLanding
              ? "gap-5 px-3 sm:px-4 pt-4 overflow-y-auto flex-1 pb-24"
              : "gap-8 px-2 lg:px-8 pt-10 pb-16"
          }`}
        >
          {displayMessages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={scrollRef} className="h-1 shrink-0" />
        </div>

        {/* Input Area (Sticky inside bottom of main page) */}
        <div
          className={
            isLanding
              ? "absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200"
              : "sticky bottom-0 z-40 w-full"
          }
        >
          <ChatInput
            onSendMessage={handleSendMessage}
            suggestions={SUGGESTED_PROMPTS}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </div>
      </div>

      {!isLanding && (
        <ChatHistorySidebar
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </>
  );
}
