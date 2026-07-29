import React, { useRef } from 'react';
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
  importData
}) {
  const fileInputRef = useRef(null);
  const items = textList.split('\n').map(s => s.trim()).filter(s => s);
  const validItemsCount = items.filter(i => !cooldownList.includes(i)).length;

  return (
    <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl border border-white relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Edit3 className="text-[#007AFF]" size={24} />
          抽籤名單
        </h2>
        <span className="bg-[#007AFF]/10 text-[#007AFF] px-4 py-1.5 rounded-full text-sm font-black shadow-sm border border-[#007AFF]/20">
          剩餘: {validItemsCount} / {items.length}
        </span>
      </div>

      <div className="flex gap-2 mb-4 relative z-10">
        <button 
          onClick={sortTextList}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-bold py-2.5 px-4 rounded-xl shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <ListOrdered size={18} /> 智能排序
        </button>
        <button 
          onClick={resetWheel}
          className="flex-1 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw size={18} /> 重設進度
        </button>
      </div>
      
      <div className="relative group/textarea z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#007AFF]/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/textarea:opacity-100 transition-opacity duration-500"></div>
        <textarea 
          className="w-full h-48 md:h-64 p-5 border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-md focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/20 transition-all font-mono text-base leading-relaxed text-slate-700 shadow-inner resize-none relative z-10"
          value={textList}
          onChange={(e) => {
            setTextList(e.target.value);
            setCooldownList([]);
          }}
          placeholder="在此輸入選項...&#10;每行一個選項&#10;例如：&#10;1&#10;2&#10;3"
        />
      </div>
      
      <div className="flex justify-between mt-4 relative z-10 gap-2">
        <button onClick={() => { setTextList(''); setCooldownList([]); }} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 flex items-center gap-2 text-sm font-bold">
          <Trash2 size={16} /> 清空
        </button>
        <div className="flex gap-2">
          <button onClick={exportData} className="text-slate-400 hover:text-[#007AFF] transition-colors p-2 rounded-xl hover:bg-blue-50 flex items-center gap-2 text-sm font-bold" title="匯出名單">
            <Download size={18} />
          </button>
          <input type="file" accept=".txt" ref={fileInputRef} onChange={importData} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-[#007AFF] transition-colors p-2 rounded-xl hover:bg-blue-50 flex items-center gap-2 text-sm font-bold" title="匯入名單">
            <Upload size={18} />
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200/60 relative z-10">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          遊戲模式
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'quiz', label: '隨機抽籤', desc: '公平公正公開' },
            { id: 'vip', label: 'VIP 暗箱', desc: '神不知鬼不覺' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setGameMode(m.id);
                setTextList(generateDefaultItems(m.id));
                setCooldownList([]);
              }}
              className={`p-4 rounded-[1.5rem] text-left transition-all ${gameMode === m.id ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-105 border border-slate-200'}`}
            >
              <div className="font-black text-lg mb-1">{m.label}</div>
              <div className={`text-xs font-bold ${gameMode === m.id ? 'text-blue-100' : 'text-slate-400'}`}>{m.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
