import React from 'react';
import { Sparkles, Triangle, AlertCircle, Star } from 'lucide-react';
import { renderItemStyle } from '../utils/styles';

export function ConfirmModal({ confirmModal, setConfirmModal }) {
  if (!confirmModal) return null;
  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-[80px] flex items-center justify-center p-8 z-[60] animate-in fade-in duration-300" role="dialog" aria-modal="true">
      <div className="bg-white/90 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] p-12 max-w-sm w-full text-center border border-white animate-in zoom-in-95 duration-400">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">操作確認</h2>
        <p className="text-slate-500 font-bold mb-10 text-lg">{confirmModal.message}</p>
        <div className="flex flex-col gap-3">
          <button onClick={confirmModal.onConfirm} className="w-full py-5 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95"> 確定執行 </button>
          {confirmModal.type !== 'alert' && (
            <button onClick={() => setConfirmModal(null)} className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-xl transition-all"> 取消 </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function VipPromptModal({ showVipPrompt, setShowVipPrompt, vipNumber, setVipNumber }) {
  if (!showVipPrompt) return null;
  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-[60px] flex items-center justify-center p-8 z-50 animate-in fade-in duration-300" role="dialog" aria-modal="true">
      <div className="bg-white rounded-[4rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] p-14 max-w-md w-full text-center border border-white animate-in slide-in-from-bottom-20 duration-500">
        <div className="w-24 h-24 bg-amber-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-6 shadow-xl border-4 border-white">
          <Star size={48} fill="#F59E0B" className="text-amber-500" />
        </div>
        <h2 className="text-4xl font-black text-amber-600 mb-4 tracking-tighter">卓越表現！</h2>
        <p className="text-slate-500 font-bold mb-10 text-lg leading-relaxed">挑戰已圓滿達成，<br/>請指定下一位 VIP 號碼：</p>
        <input type="text" autoFocus value={vipNumber} onChange={(e) => setVipNumber(e.target.value)} placeholder="座號" className="w-full p-6 mb-10 rounded-[2rem] border-4 border-slate-50 bg-slate-50/50 text-center font-black text-slate-900 text-5xl shadow-inner outline-none focus:bg-white focus:ring-8 focus:ring-amber-100 transition-all" />
        <button onClick={() => setShowVipPrompt(false)} className="w-full py-7 bg-amber-500 hover:bg-amber-600 text-white rounded-[2.5rem] font-black text-2xl active:scale-95 transition-transform shadow-2xl shadow-amber-500/40"> 設定完成 </button>
      </div>
    </div>
  );
}

export default function WinnerModal({
  showWinnerModal, setShowWinnerModal,
  winner, drawStyle, gameMode,
  vipNumber, setVipNumber,
  handleO, handleSkip, handleX
}) {
  if (!showWinnerModal || !winner) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-[60px] flex items-center justify-center p-8 z-50 animate-in fade-in duration-500" role="dialog" aria-modal="true">
      <div className="bg-white/95 backdrop-blur-3xl rounded-[4.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] p-14 max-w-2xl w-full text-center border border-white animate-in zoom-in-90 duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#cbd5e1_1px,_transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>

        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#007AFF] rounded-full flex items-center justify-center shadow-2xl border-[8px] border-white ring-4 ring-blue-50">
          <Sparkles size={60} className="text-white animate-pulse" />
        </div>
        <p className="text-slate-400 font-black tracking-[0.3em] uppercase mb-4 mt-10 relative z-10">Congratulations</p>
        
        <div className="flex justify-center items-center min-h-[250px] mb-12 animate-bounce-custom relative z-10">
          {renderItemStyle(winner, drawStyle, () => false, true)}
        </div>

        {gameMode === 'vip' && winner === 'VIP號' && (
          <div className="mb-10 p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem] border border-amber-200 shadow-inner relative overflow-hidden z-10">
            <p className="text-lg text-amber-800 font-black mb-5">👑 VIP 號碼設定</p>
            <input type="text" value={vipNumber} autoFocus onChange={(e) => setVipNumber(e.target.value)} placeholder="座號" className="w-full p-6 rounded-[2rem] border-4 border-white font-black text-slate-900 text-5xl shadow-2xl outline-none text-center bg-white/80 focus:ring-8 focus:ring-amber-200 transition-all" />
          </div>
        )}
        
        <div className="relative z-10 w-full">
          {gameMode === 'classic' ? (
            <button onClick={() => setShowWinnerModal(false)} className="w-full py-8 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-[2.5rem] font-black text-3xl shadow-2xl active:scale-95 transition-all"> OK </button>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              <button onClick={handleO} className="py-10 bg-[#34C759] hover:bg-[#28A745] text-white rounded-[3rem] transition-all active:scale-95 shadow-2xl shadow-green-500/30 flex flex-col items-center justify-center gap-2 border-b-[8px] border-green-700/30">
                <span className="text-6xl font-black italic leading-none">O</span>
                <span className="text-[10px] font-black opacity-90 uppercase tracking-widest mt-2">Bingo / 銷號</span>
              </button>
              <button onClick={handleSkip} className="py-10 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-[3rem] transition-all active:scale-95 shadow-2xl shadow-blue-500/30 flex flex-col items-center justify-center gap-4 border-b-[8px] border-blue-700/30">
                <Triangle size={48} fill="currentColor" className="rotate-90 ml-1" />
                <span className="text-[10px] font-black opacity-90 uppercase tracking-widest">Skip / 反灰</span>
              </button>
              <button onClick={handleX} className="py-10 bg-[#FF3B30] hover:bg-[#E02E24] text-white rounded-[3rem] transition-all active:scale-95 shadow-2xl shadow-red-500/30 flex flex-col items-center justify-center gap-2 border-b-[8px] border-red-700/30">
                <span className="text-6xl font-black italic leading-none">X</span>
                <span className="text-[10px] font-black opacity-90 uppercase tracking-widest mt-2">Next / 增加</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
