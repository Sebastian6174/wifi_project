import { useState, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ChatChart({ data, config }) {
  const [showData, setShowData] = useState(false);
  const chartRef = useRef(null);

  if (!data || data.length === 0) return null;

  const handleDownloadPNG = () => {
    const svgComponent = chartRef.current?.querySelector('svg');
    if (!svgComponent) return;
    
    const svgData = new XMLSerializer().serializeToString(svgComponent);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = svgComponent.clientWidth || 600;
      canvas.height = svgComponent.clientHeight || 200;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `chart_${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 mt-4 shadow-sm relative overflow-hidden transition-all">
      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-700 capitalize">{config.title || "Visualización de Datos"}</h4>
      </div>
      
      <div className="h-[200px] w-full" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis 
              dataKey={config.xAxisKey} 
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748B' }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#0f172a'
              }}
              itemStyle={{ color: config.color }}
            />
            <Bar 
              dataKey={config.dataKey} 
              fill={config.color || "var(--md-primary-container)"} 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-slate-100">
        <button 
          onClick={handleDownloadPNG}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-[var(--md-primary-container)] hover:bg-teal-50 px-2 py-1.5 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">download</span> Exportar PNG
        </button>
        <button 
          onClick={() => setShowData(!showData)}
          className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1.5 rounded transition-colors ${
            showData ? 'text-[var(--md-primary-container)] bg-teal-50' : 'text-slate-500 hover:text-[var(--md-primary-container)] hover:bg-teal-50'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">table_chart</span> {showData ? 'Ocultar Datos' : 'Ver Datos'}
        </button>
      </div>

      {showData && (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in origin-top">
          <table className="w-full text-left text-[10px]">
            <thead className="text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-2 font-bold">{config.xAxisKey}</th>
                <th className="pb-2 font-bold">{config.dataKey}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 border-t border-slate-100">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 text-slate-600 font-medium">{item[config.xAxisKey]}</td>
                  <td className="py-2 text-slate-800 font-bold" style={{ color: config.color || 'var(--md-primary-container)' }}>
                    {item[config.dataKey]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
