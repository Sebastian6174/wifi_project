import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ChatHistorySidebar from './components/ChatHistorySidebar';
import { INITIAL_CHAT, SUGGESTED_PROMPTS, generateMockResponse } from './utils/mockChat';

export default function ManageConversationalAgent() {
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const scrollRef = useRef(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto-scroll to bottom using window/main
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (text, modeId, contextArray) => {
    // Construct user message
    const newMessage = {
      id: Date.now(),
      role: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Simulate AI thinking and responding
    setTimeout(() => {
      const response = generateMockResponse(text, modeId);
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const handleSelectSuggestion = (text) => {
    handleSendMessage(text, 'auto', []);
  };

  return (
    <>
      <div className="flex flex-col flex-1 animate-fade-in w-full pb-0 relative">
        
        {/* Floating History Action (Right aligned, sticks to top while scrolling) */}
        <div className="sticky top-4 right-4 sm:right-8 z-30 flex justify-end px-4 sm:px-8 pointer-events-none mb-[-40px]">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="pointer-events-auto flex items-center shadow-md gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white backdrop-blur-sm border border-slate-200 text-slate-600 transition-colors text-xs font-bold"
          >
            <span className="material-symbols-outlined text-[16px] text-[var(--md-primary-container)]">history</span>
            Historial
          </button>
        </div>

        {/* Messages List - Responsive bounds */}
        <div className="flex flex-col gap-8 pb-4 px-2 lg:px-8 max-w-4xl mx-auto w-full pt-10">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={scrollRef} className="h-1" />
        </div>

        {/* Input Area (Sticky inside bottom of main page) */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          suggestions={SUGGESTED_PROMPTS}
          onSelectSuggestion={handleSelectSuggestion}
        />
      </div>

      <ChatHistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </>
  );
}
