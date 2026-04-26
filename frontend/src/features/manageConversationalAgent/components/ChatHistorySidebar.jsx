import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { MOCK_HISTORY } from '../utils/mockChat';

export default function ChatHistorySidebar({ isOpen, onClose }) {
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (id) => {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, title: editTitle } : h));
    setEditingId(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Sidebar Surface */}
      <div className="relative w-full max-w-[280px] bg-white h-screen flex flex-col border-l border-slate-200 shadow-2xl animate-fade-in origin-right">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[var(--md-primary-container)]">history</span>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Historial de Chats</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {['Hoy', 'Ayer', 'Hace 3 días'].map(groupDate => {
            const group = history.filter(h => h.date === groupDate);
            if (group.length === 0) return null;
            
            return (
              <div key={groupDate}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-2">
                  {groupDate}
                </p>
                <div className="space-y-1">
                  {group.map(chat => (
                    <div key={chat.id} className="group relative rounded-lg hover:bg-slate-50 transition-colors p-2.5 flex items-start gap-3 cursor-pointer border border-transparent hover:border-slate-100">
                      <MessageSquare size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        {editingId === chat.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(chat.id)}
                              className="text-xs font-bold text-slate-800 bg-white border border-[var(--md-primary-container)] rounded px-2 py-1 outline-none w-full shadow-sm"
                            />
                            <button onClick={() => handleSaveEdit(chat.id)} className="text-[10px] font-bold text-[var(--md-primary-container)] hover:underline">
                              Guardar
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-xs font-medium text-slate-700 truncate group-hover:text-[var(--md-primary-container)] transition-colors">
                            {chat.title}
                          </h3>
                        )}
                      </div>

                      {/* Actions */}
                      {editingId !== chat.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(chat.id, chat.title); }}
                            className="p-1 text-slate-400 hover:text-[var(--md-primary-container)] transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center p-6 text-slate-400">
              <span className="material-symbols-outlined text-3xl mb-2 opacity-50">search_off</span>
              <p className="text-xs font-bold">No hay historial</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
