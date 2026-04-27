import ChatChart from './ChatChart';

export default function ChatMessage({ message }) {
  const isAI = message.role === 'ai';

  return (
    <div className={`flex gap-4 w-full ${isAI ? '' : 'flex-row-reverse'}`}>
      
      {/* Avatar */}
      <div className={`size-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
        isAI 
          ? 'bg-[var(--md-primary-container)] text-white border-transparent' 
          : 'bg-white text-[var(--md-primary-container)] border-slate-200'
      }`}>
        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: isAI ? "'FILL' 1" : "'FILL' 0" }}>
          {isAI ? 'auto_awesome' : 'person'}
        </span>
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
        <h3 className="text-[11px] font-bold text-[var(--md-primary-container)] mb-1 uppercase tracking-wide">
          {isAI ? 'Cali Connect AI' : 'Tú'}
        </h3>
        
        <div className={`p-4 text-sm leading-relaxed shadow-sm max-w-[90%] md:max-w-[85%] ${
          isAI 
            ? 'glass-panel border-white rounded-2xl rounded-tl-none font-medium text-slate-700 bg-white/70' 
            : 'bg-[var(--md-primary-container)] text-white rounded-2xl rounded-tr-none'
        }`}>
          {message.text}

          {/* Conditional Rendering for AI Content */}
          {message.chartData && message.chartConfig && (
            <ChatChart data={message.chartData} config={message.chartConfig} />
          )}

          {message.tableData && (() => {
            const downloadCSV = () => {
              const { headers, rows } = message.tableData;
              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `cali_connect_report_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            return (
              <div className="mt-4 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      {message.tableData.headers.map((h, i) => <th key={i} className="px-3 py-2 text-[9px]">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {message.tableData.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        {row.map((cell, idx) => (
                          <td key={idx} className="px-3 py-2 text-slate-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end p-2 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--md-primary-container)] px-3 py-1.5 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span> Descargar CSV
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
