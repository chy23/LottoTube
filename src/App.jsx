import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Box, Volume2, VolumeX, Layout, Brain, UserCheck, RefreshCcw, Star, Music, Maximize, Minimize
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from './hooks/useAudio';

import ControlPanel from './components/ControlPanel';
import Bucket from './components/Bucket';
import Roulette from './components/Roulette';
import WinnerModal, { ConfirmModal, VipPromptModal } from './components/WinnerModal';

export default function App() {
  const { 
    isMuted, setIsMuted, soundMode, setSoundMode, initAudio,
    playHardShakeSound, playHandStirSound, playPopSound, playVipFanfare,
    playActionO, playActionX, playActionSkip
  } = useAudio();

  const [gameMode, setGameMode] = useState(() => localStorage.getItem('drawLots_gameMode') || 'quiz'); 
  const [appMode, setAppMode] = useState(() => localStorage.getItem('drawLots_appMode') || 'box');
  const [wheelRotation, setWheelRotation] = useState(0);
  
  const generateDefaultItems = (mode) => {
    let list = Array.from({ length: 26 }, (_, i) => (i + 1).toString());
    if (mode === 'vip') list.push('VIP號');
    return list.join('\n');
  };

  const [textList, setTextList] = useState(() => {
    const saved = localStorage.getItem('drawLots_textList');
    if (saved) return saved;
    return generateDefaultItems(gameMode);
  });
  
  const [items, setItems] = useState([]);
  const [targetIndex, setTargetIndex] = useState(null);
  
  // 'idle' | 'shaking' | 'reaching' | 'spinning'
  const [drawState, setDrawState] = useState('idle');
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [drawStyle, setDrawStyle] = useState(() => localStorage.getItem('drawLots_drawStyle') || 'glass'); 
  const [cooldownList, setCooldownList] = useState(() => {
    const saved = localStorage.getItem('drawLots_cooldownList');
    return saved ? JSON.parse(saved) : [];
  });
  const [confirmModal, setConfirmModal] = useState(null);
  const [tempWinner, setTempWinner] = useState(null);
  const [vipNumber, setVipNumber] = useState(() => localStorage.getItem('drawLots_vipNumber') || '');
  const [showVipPrompt, setShowVipPrompt] = useState(false);
  const [historyLog, setHistoryLog] = useState(() => JSON.parse(localStorage.getItem('drawLots_historyLog')) || []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isRollingOut, setIsRollingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem('drawLots_appMode', appMode);
    localStorage.setItem('drawLots_gameMode', gameMode);
    localStorage.setItem('drawLots_textList', textList);
    localStorage.setItem('drawLots_drawStyle', drawStyle);
    localStorage.setItem('drawLots_vipNumber', vipNumber);
    localStorage.setItem('drawLots_cooldownList', JSON.stringify(cooldownList));
  }, [appMode, gameMode, textList, drawStyle, vipNumber, cooldownList]);
  
  useEffect(() => {
    localStorage.setItem('drawLots_historyLog', JSON.stringify(historyLog));
  }, [historyLog]);

  // Auto detect and sync system dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    updateTheme(mediaQuery);
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isItemGrayedOut = (item) => {
    if (cooldownList.includes(item)) return true;
    if (gameMode === 'vip' && item === 'VIP號') {
      const currentVip = vipNumber.trim();
      if (!currentVip) return true; // 沒輸入VIP號碼前不可抽
      if (currentVip && cooldownList.includes(currentVip)) return true;
    }
    return false;
  };

  const handleModeChange = (newMode) => {
    setGameMode(newMode);
    let currentItems = textList.split('\n').map(s => s.trim()).filter(s => s);
    if (newMode === 'vip') {
      if (!currentItems.includes('VIP號')) {
        currentItems.push('VIP號');
        setTextList(currentItems.join('\n'));
      }
    } else {
      if (currentItems.includes('VIP號')) {
        currentItems = currentItems.filter(i => i !== 'VIP號');
        setTextList(currentItems.join('\n'));
      }
    }
    setCooldownList([]);
  };

  const sortTextListArray = (itemsArray) => {
    return itemsArray.sort((a, b) => {
      const numA = Number(a), numB = Number(b);
      const isNumA = !isNaN(numA) && a.trim() !== '', isNumB = !isNaN(numB) && b.trim() !== '';
      if (isNumA && isNumB) return numA - numB;
      if (isNumA && !isNumB) return -1;
      if (!isNumA && isNumB) return 1;
      return a.localeCompare(b);
    });
  };

  const sortTextList = () => {
    const current = textList.split('\n').map(s => s.trim()).filter(s => s);
    setTextList(sortTextListArray(current).join('\n'));
  };

  useEffect(() => {
    let currentItems = textList.split('\n').map(s => s.trim()).filter(s => s);
    if (gameMode !== 'vip') {
      currentItems = currentItems.filter(item => item !== "VIP號");
    }
    // Auto-sort textList only
    const sortedItems = sortTextListArray([...currentItems]);
    const sorted = sortedItems.join('\n');
    const raw = textList.split('\n').map(s => s.trim()).filter(s => s);
    if (gameMode !== 'vip') {
      if (sorted !== raw.filter(i => i !== 'VIP號').join('\n')) {
        setTextList(sorted);
      }
    } else {
      if (sorted !== raw.join('\n')) {
        setTextList(sorted);
      }
    }
    // Shuffle for visual display (truly random)
    const shuffled = [...sortedItems];
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }
    setItems(shuffled);
  }, [textList, gameMode]);

  // Items for bucket: exclude grayed-out ones (they go to exemption area)
  const bucketItems = useMemo(() => items.filter(item => !isItemGrayedOut(item)), [items, cooldownList, vipNumber, gameMode]);

  const drawLot = () => {
    if (drawState !== 'idle' || items.length === 0) return;
    initAudio();
    setShowWinnerModal(false);
    setWinner(null);
    setTempWinner(null);
    setTargetIndex(null);
    setIsGrabbed(false);
    setIsRollingOut(false);

    let validIndices = items.map((item, i) => !isItemGrayedOut(item) ? i : -1).filter(i => i !== -1);
    if (validIndices.length === 0) { 
      validIndices = items.map((_, i) => i);
      setCooldownList([]); 
    }
    
    const randomI = Math.floor(Math.random() * validIndices.length);
    const selectedIndex = validIndices[randomI];
    const selected = items[selectedIndex];

    if (appMode === 'roulette') {
      setDrawState('spinning');
      setTargetIndex(selectedIndex);
      setTempWinner(selected);
      
      const sliceAngle = 360 / items.length;
      const targetAngle = selectedIndex * sliceAngle + sliceAngle / 2;
      const extraSpins = 5 * 360; 
      const currentRotationMod = wheelRotation % 360;
      let newRotation = wheelRotation + extraSpins + (360 - targetAngle) - currentRotationMod;
      if (newRotation - wheelRotation < extraSpins) newRotation += 360;
      
      setWheelRotation(newRotation);
      playHardShakeSound();

      setTimeout(() => {
        setWinner(selected);
        setDrawState('idle');
        setShowWinnerModal(true);
        if (gameMode === 'vip' && selected === 'VIP號') playVipFanfare();
        else playPopSound();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }, 4000);

    } else {
      setDrawState('shaking');
      playHandStirSound();
      
      setTimeout(() => {
        setDrawState('reaching');
        playHardShakeSound();
        const bucketIdx = bucketItems.indexOf(selected);
        setTargetIndex(bucketIdx !== -1 ? bucketIdx : 0);
        setTempWinner(selected);
        setIsRollingOut(true);

        setTimeout(() => {
          setWinner(selected);
          setShowWinnerModal(true);
          setDrawState('idle'); 
          setTempWinner(null);
          setIsRollingOut(false);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          
          if (gameMode === 'vip' && selected === 'VIP號') {
            playVipFanfare();
          } else {
            playPopSound();
          }
        }, 1400);
      }, 1100);
    }
  };

  const handleO = () => {
    playActionO();
    const target = tempWinner === 'VIP號' ? vipNumber.trim() : tempWinner;
    setHistoryLog(prev => [{ time: new Date().toISOString(), item: winner, action: 'Bingo', mode: gameMode }, ...prev]);
    
    // 銷號: Remove one copy, but keep at least one of each unique number
    let currentItems = textList.split('\n').map(s => s.trim()).filter(s => s);
    const count = currentItems.filter(i => i === target).length;
    if (count > 1) {
      const idx = currentItems.indexOf(target);
      if (idx !== -1) {
        currentItems.splice(idx, 1);
        setTextList(currentItems.join('\n'));
      }
    }
    // else: only 1 left, don't remove
    
    setCooldownList([]); // 重置豁免區
    setTargetIndex(null);
    setIsGrabbed(false);
    setIsRollingOut(false);

    setShowWinnerModal(false);

    if (gameMode === 'vip') {
      setVipNumber('');
      setShowVipPrompt(true);
    }
  };

  const handleX = () => {
    playActionX();
    const target = tempWinner === 'VIP號' ? vipNumber.trim() : tempWinner;
    if (gameMode === 'vip' && tempWinner === 'VIP號' && !vipNumber.trim()) {
      setConfirmModal({ message: '請輸入 VIP 號碼', type: 'alert', onConfirm: () => setConfirmModal(null) });
      return;
    }
    
    if (target) {
      setTextList(prev => prev + (prev.trim() ? '\n' : '') + target);
    }

    setCooldownList(prev => {
      const next = [...prev];
      if (!next.includes(winner)) next.push(winner);
      if (!next.includes(target)) next.push(target);
      return next;
    });
    setTargetIndex(null);
    setIsGrabbed(false);
    setIsRollingOut(false);
    setShowWinnerModal(false);
  };

  const handleSkip = () => {
    playActionSkip();
    const target = tempWinner === 'VIP號' ? vipNumber.trim() : tempWinner;
    if (gameMode === 'vip' && tempWinner === 'VIP號' && !vipNumber.trim()) {
      setConfirmModal({ message: '請輸入 VIP 號碼再跳過', type: 'alert', onConfirm: () => setConfirmModal(null) });
      return;
    }
    setCooldownList(prev => {
      const next = [...prev];
      if (!next.includes(winner)) next.push(winner);
      if (!next.includes(target)) next.push(target);
      return next;
    });
    setTargetIndex(null);
    setIsGrabbed(false);
    setIsRollingOut(false);
    setShowWinnerModal(false);
  };

  const resetWheel = () => {
    setTextList(generateDefaultItems(gameMode));
    setDrawState('idle'); 
    setShowWinnerModal(false); 
    setShowVipPrompt(false);
    setVipNumber(''); 
    setCooldownList([]);
    setConfirmModal(null);
  };

  const exportData = () => {
    const blob = new Blob([textList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '籤筒名單.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setTextList(ev.target.result); setCooldownList([]); };
    reader.readAsText(file); e.target.value = null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#F3E5F5] to-[#E8F5E9] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-8 font-sans overflow-x-hidden selection:bg-blue-200 transition-colors duration-500">
      
      {/* Watermarks */}
      <div className="fixed top-40 md:top-24 right-4 md:right-8 text-[18pt] text-slate-500 opacity-25 dark:opacity-10 font-bold pointer-events-none z-0 select-none whitespace-nowrap">
        網站建立自楊家驊老師
      </div>
      <div className="fixed bottom-4 right-4 md:right-8 text-[18pt] text-slate-500 opacity-25 dark:opacity-10 font-bold pointer-events-none z-0 select-none whitespace-nowrap">
        網站建立自楊家驊老師
      </div>

      <div className="max-w-[1500px] mx-auto relative z-10">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-5xl font-black flex items-center justify-center md:justify-start gap-3 drop-shadow-sm text-slate-800 dark:text-slate-100">
              <Box className="text-[#007AFF] dark:text-[#4DA8DA]" size={48} />
              特製抽籤系統
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 items-center relative z-20">
            
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] shadow-lg border border-white/60 dark:border-slate-700/60 flex gap-1 items-center">
              <button 
                onClick={() => setAppMode('box')} 
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${appMode === 'box' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}
              >
                籤筒模式
              </button>
              <button 
                onClick={() => setAppMode('roulette')} 
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${appMode === 'roulette' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}
              >
                轉盤模式
              </button>
            </div>

            {appMode === 'box' && (
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] shadow-lg border border-white/60 dark:border-slate-700/60 flex gap-1 items-center">
                <span className="flex items-center px-4 text-sm font-bold text-slate-500 border-r border-slate-300/30 mr-1">
                  樣式
                </span>
                {[
                  { id: 'classic', label: '經典木籤' },
                  { id: 'star', label: '幸運星' },
                  { id: 'ball', label: '扭蛋球' },
                  { id: 'poem', label: '寺廟詩籤' },
                  { id: 'paper', label: '摺紙籤' },
                  { id: 'stone', label: '繽紛石頭' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setDrawStyle(style.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${drawStyle === style.id ? 'bg-white dark:bg-slate-700 shadow-sm text-[#007AFF] dark:text-[#4DA8DA]' : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700/40'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const modes = ['classic', 'retro', 'arcade'];
                  setSoundMode(modes[(modes.indexOf(soundMode) + 1) % modes.length]);
                }} 
                className="p-4 bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-lg border border-white/60 text-[#007AFF] hover:bg-white/80 transition-colors flex items-center gap-2"
                title="切換音效模式"
              >
                <Music size={24} />
                <span className="font-bold text-sm hidden md:inline-block">
                  {soundMode === 'classic' ? '經典' : soundMode === 'retro' ? '復古' : '遊樂場'}
                </span>
              </button>
              
              <button onClick={toggleFullscreen} className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[1.5rem] shadow-lg border border-white/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors" title="全螢幕">
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
              
              <button onClick={() => setIsMuted(!isMuted)} className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[1.5rem] shadow-lg border border-white/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors">
                {isMuted ? <VolumeX size={24} className="text-red-500" /> : <Volume2 size={24} className="text-[#007AFF] dark:text-[#4DA8DA]" />}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          <div className="lg:col-span-7 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[40px] rounded-[4rem] p-4 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/70 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
            
            {appMode === 'box' ? (
              <Bucket 
                items={bucketItems}
                drawState={drawState}
                isGrabbed={isGrabbed}
                targetIndex={targetIndex}
                targetBucketIndex={targetIndex}
                isRollingOut={isRollingOut}
                tempWinner={tempWinner}
                drawStyle={drawStyle}
                isItemGrayedOut={isItemGrayedOut}
              />
            ) : (
              <Roulette 
                items={items}
                wheelRotation={wheelRotation}
                drawState={drawState}
                isItemGrayedOut={isItemGrayedOut}
              />
            )}

            <button 
              onClick={drawLot} 
              disabled={drawState !== 'idle' || items.length === 0}
              className={`mt-12 w-full py-6 md:py-8 rounded-[2.5rem] text-2xl md:text-3xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 z-50
                ${drawState !== 'idle' || items.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#007AFF] hover:bg-[#0062CC] hover:scale-105 active:scale-95 text-white shadow-blue-500/40'}`}
            >
              {drawState !== 'idle' ? <RefreshCcw className="animate-spin" size={36} /> : <Sparkles size={36} />}
              {drawState === 'shaking' ? '搖晃中...' : drawState === 'reaching' ? '抽取中...' : drawState === 'spinning' ? '轉動中...' : '抽出幸運兒'}
            </button>
            
            {cooldownList.length > 0 && gameMode !== 'classic' && (
              <div className="mt-8 w-full bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-[2.5rem] p-5 flex flex-col items-center justify-center animate-in zoom-in-95">
                <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-2">已回答空間 (豁免中)</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {cooldownList.map((item, idx) => ( <span key={idx} className="px-4 py-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-full text-emerald-800 dark:text-emerald-300 font-black text-lg">{item}</span> ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 h-full relative z-20">
            <div className="flex bg-slate-500/10 backdrop-blur-2xl p-1.5 rounded-[2rem] mb-8 border border-white/20">
              {[ {id:'classic', label:'經典', icon:<Layout size={18}/>}, {id:'quiz', label:'答題', icon:<Brain size={18}/>}, {id:'vip', label:'VIP', icon:<UserCheck size={18}/>} ].map(m => (
                <button key={m.id} onClick={() => handleModeChange(m.id)} className={`flex-1 py-3.5 rounded-[1.6rem] font-black text-base transition-all flex items-center justify-center gap-2 ${gameMode === m.id ? 'bg-white shadow-xl text-[#007AFF] scale-105' : 'text-slate-500 hover:text-slate-800'}`}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {gameMode === 'vip' && (
              <div className="flex items-center justify-between mb-10 bg-gradient-to-br from-amber-400/20 to-orange-400/20 p-6 rounded-[2.5rem] border border-amber-200/50 shadow-inner animate-in slide-in-from-top-6">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">Current VIP</span>
                  <span className="font-black text-amber-900 text-2xl flex items-center gap-2"><Star size={28} fill="#D97706" className="text-amber-600" />VIP號碼</span>
                </div>
                <input type="text" value={vipNumber} onChange={(e) => setVipNumber(e.target.value)} placeholder="座號" disabled={drawState !== 'idle'} className="w-32 p-4 text-center rounded-[1.5rem] border-2 border-white/80 font-black text-3xl outline-none focus:ring-4 focus:ring-amber-200 bg-white/90 shadow-xl transition-all" />
              </div>
            )}

            <ControlPanel 
              textList={textList}
              setTextList={setTextList}
              cooldownList={cooldownList}
              setCooldownList={setCooldownList}
              gameMode={gameMode}
              setGameMode={handleModeChange}
              drawStyle={drawStyle}
              setDrawStyle={setDrawStyle}
              sortTextList={sortTextList}
              resetWheel={resetWheel}
              generateDefaultItems={generateDefaultItems}
              exportData={exportData}
              importData={importData}
              historyLog={historyLog}
            />
          </div>
        </div>
      </div>

      <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
      <VipPromptModal showVipPrompt={showVipPrompt} setShowVipPrompt={setShowVipPrompt} vipNumber={vipNumber} setVipNumber={setVipNumber} />
      
      <WinnerModal 
        showWinnerModal={showWinnerModal}
        setShowWinnerModal={setShowWinnerModal}
        winner={winner}
        drawStyle={drawStyle}
        gameMode={gameMode}
        vipNumber={vipNumber}
        setVipNumber={setVipNumber}
        handleO={handleO}
        handleSkip={handleSkip}
        handleX={handleX}
      />
    </div>
  );
}
