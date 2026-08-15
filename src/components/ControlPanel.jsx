import React, { useRef, useState } from 'react';
import { 
  Edit3, ListOrdered, RotateCcw, Trash2, Download, Upload, 
  Sparkles, Settings2, RefreshCcw
} from 'lucide-react';

export default function ControlPanel({
  textList, setTextList,
  cooldownList, setCooldownList,
  gameMode, setGameMode,
  drawStyle, setDrawStyle,
  sortTextList,
  resetWheel,
  generateDefaultItems,
  exportData,
  importData,
  historyLog = []
}) {
  const [activeTab, setActiveTab] = useState('list');
  const fileInputRef = useRef(null);
  const items = textList.split('\n').map(s => s.trim()).filter(s => s);
  const validItemsCount = items.filter(i => !cooldownList.includes(i)).length;

  const exportHistoryCsv = () => {
    const header = "時間,名單\n";
    const csvContent = historyLog.map(log => {
      const timeStr = new Date(log.time).toLocaleTimeString('zh-TW', { hour12: false });
      return `${timeStr},${log.name || log.item || ''}`;
    }).join('\n');
    
    const blob = new Blob(["\uFEFF" + header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `抽籤紀錄_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl border border-white relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 relative">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${activeTab === 'list' ? 'bg-white dark:bg-slate-700 shadow text-[#007AFF] dark:text-[#4DA8DA]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Edit3 size={16} />名單
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 shadow text-[#007AFF] dark:text-[#4DA8DA]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <ListOrdered size={16} />紀錄
          </button>
        </div>
        
        {activeTab === 'list' && (
          <span className="bg-[#007AFF]/10 text-[#007AFF] dark:text-[#4DA8DA] px-3 py-1 rounded-full text-xs font-black border border-[#007AFF]/20">
            剩餘: {validItemsCount} / {items.length}
          </span>
        )}
      </div>

      {activeTab === 'list' ? (
        <>
          <div className="flex gap-2 mb-4 relative z-10">
            <button 
              onClick={sortTextList}
              className="px-6 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <ListOrdered size={18} /> 智能排序
            </button>
            <button 
              onClick={resetWheel}
              className="px-6 py-3 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw size={18} /> 重設進度
            </button>
          </div>
          
          <div className="relative group/textarea z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#007AFF]/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/textarea:opacity-100 transition-opacity duration-500"></div>
            <textarea 
              className="w-full h-48 md:h-64 p-5 border-2 border-slate-200 dark:border-slate-600 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md focus:border-[#007AFF] dark:focus:border-[#4DA8DA] focus:ring-4 focus:ring-[#007AFF]/20 transition-all font-mono text-base leading-relaxed text-slate-700 dark:text-slate-200 shadow-inner resize-none relative z-10 outline-none"
              value={textList}
              onChange={(e) => {
                setTextList(e.target.value);
                setCooldownList([]);
              }}
              placeholder="在此輸入選項...&#10;每行一個選項&#10;例如：&#10;1&#10;2&#10;3"
            />
          </div>
          
          <div className="flex justify-between mt-4 relative z-10 gap-2">
            <button onClick={() => { setTextList(''); setCooldownList([]); }} className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all active:scale-95 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-sm font-bold">
              <Trash2 size={18} /> 清空
            </button>
            <div className="flex gap-2">
              <button onClick={exportData} className="text-slate-400 dark:text-slate-500 hover:text-[#007AFF] dark:hover:text-[#4DA8DA] transition-all active:scale-95 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2 text-sm font-bold" title="匯出名單">
                <Download size={18} />
              </button>
              <input type="file" accept=".txt" ref={fileInputRef} onChange={importData} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 dark:text-slate-500 hover:text-[#007AFF] dark:hover:text-[#4DA8DA] transition-all active:scale-95 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2 text-sm font-bold" title="匯入名單">
                <Upload size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col h-[320px] md:h-[400px] z-10 relative">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            {historyLog.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold">無紀錄</div>
            ) : (
              <div className="flex flex-col gap-2">
                {historyLog.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-lg mr-3">{log.item}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-400">{new Date(log.time).toLocaleTimeString('zh-TW', { hour12: false })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={exportHistoryCsv} 
              disabled={historyLog.length === 0}
              className="bg-[#007AFF] hover:bg-[#0062CC] disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} /> 匯出 CSV
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
