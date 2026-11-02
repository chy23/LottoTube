import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Sparkles, Box, Volume2, VolumeX, Layout, Brain, UserCheck, RefreshCcw, Star, Music, Maximize, Minimize, History
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerBingoCelebration } from './utils/confettiEffects';
import { useAudio } from './hooks/useAudio';

import ControlPanel from './components/ControlPanel';
import Bucket from './components/Bucket';
import Roulette from './components/Roulette';
import WinnerModal, { ConfirmModal, VipPromptModal } from './components/WinnerModal';
import ChangelogModal from './components/ChangelogModal';

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
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
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

  const isItemGrayedOut = useCallback((item) => {
    if (cooldownList.includes(item)) return true;
    if (gameMode === 'vip' && item === 'VIP號') {
      const currentVip = vipNumber.trim();
      if (!currentVip) return true; // 沒輸入VIP號碼前不可抽
      if (currentVip && cooldownList.includes(currentVip)) return true;
    }
    return false;
  }, [cooldownList, vipNumber, gameMode]);

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
    // 衝突一修正：尊重使用者自訂輸入與順序，不再於 useEffect 內強制覆蓋 setTextList
    setItems([...currentItems]);
  }, [textList, gameMode]);

  // 衝突三（模式A）：大轉盤動態重繪輪盤（排除已豁免者，讓未抽者等比均分 360 度）
  const activeRouletteItems = useMemo(() => {
    if (gameMode === 'classic') return items;
    const available = items.filter(item => !isItemGrayedOut(item));
    return available.length > 0 ? available : items;
  }, [items, cooldownList, gameMode, isItemGrayedOut]);

  // Items for bucket: we pass all items directly so grayed out items stay in the bucket visually grayed out

  const drawLotRef = useRef(null);
  
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        const tagName = e.target.tagName?.toUpperCase() || '';
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'BUTTON') return;
        if (showVipPrompt || confirmModal || showWinnerModal) return;
        e.preventDefault();
        if (drawLotRef.current) drawLotRef.current();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showVipPrompt, confirmModal, showWinnerModal]);

  const drawLot = () => {
    if (drawState !== 'idle' || items.length === 0) return;

    // 衝突五修正：VIP 模式下若尚未輸入 VIP 號碼且名單只剩 VIP 號，提醒輸入
    if (gameMode === 'vip') {
      const nonVipValid = items.filter(i => i !== 'VIP號' && !isItemGrayedOut(i));
      if (nonVipValid.length === 0 && !vipNumber.trim()) {
        setShowVipPrompt(true);
        return;
      }
    }

    initAudio();
    setShowWinnerModal(false);
    setWinner(null);
    setTempWinner(null);
    setTargetIndex(null);
    setIsGrabbed(false);
    setIsRollingOut(false);

    // 衝突六修正：檢查有效候選人，若全員都在豁免區，觸發回合重置
    let validIndices = items.map((item, i) => !isItemGrayedOut(item) ? i : -1).filter(i => i !== -1);
    let needsReset = false;
    if (validIndices.length === 0) { 
      needsReset = true;
      setCooldownList([]); 
      validIndices = items.map((_, i) => i);
    }

    const executeDrawAnimation = (indicesToUse, isResetting) => {
      const randomI = Math.floor(Math.random() * indicesToUse.length);
      const selectedIndex = indicesToUse[randomI];
      const selected = items[selectedIndex];

      if (appMode === 'roulette') {
        // 衝突三（模式A）：大轉盤使用有效候選人計算扇形角度
        const currentWheelItems = isResetting ? items : activeRouletteItems;
        const targetWheelIndex = currentWheelItems.indexOf(selected);
        const actualWheelIndex = targetWheelIndex !== -1 ? targetWheelIndex : randomI;

        setDrawState('spinning');
        setTargetIndex(selectedIndex);
        setTempWinner(selected);
        
        const sliceAngle = 360 / currentWheelItems.length;
        const targetAngle = actualWheelIndex * sliceAngle + sliceAngle / 2;
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
        }, 2000);

      } else {
        setDrawState('shaking');
        playHandStirSound();
        
        setTimeout(() => {
          setDrawState('reaching');
          playHardShakeSound();
          
          // Wait 500ms for tilting
          setTimeout(() => {
            setTargetIndex(selectedIndex);
            setTempWinner(selected);
            setIsRollingOut(true);

            // Wait 750ms for rollout
            setTimeout(() => {
              setWinner(selected);
              setShowWinnerModal(true);
              setDrawState('idle'); 
              setIsRollingOut(false);
              confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
              
              if (gameMode === 'vip' && selected === 'VIP號') {
                playVipFanfare();
              } else {
                playPopSound();
              }
            }, 750);
          }, 500);
        }, 550);
      }
    };

    if (needsReset) {
      // 延遲 50ms 讓 React 刷新渲染清空豁免區後的狀態，解決視覺撕裂
      setTimeout(() => executeDrawAnimation(validIndices, true), 50);
    } else {
      executeDrawAnimation(validIndices, false);
    }
  };

  const handleO = () => {
    playActionO();
    // 答對時隨機噴出大金幣、彩色星星、彩帶豪華動畫
    triggerBingoCelebration();

    const isVipWinner = tempWinner === 'VIP號' || winner === 'VIP號';
    const target = isVipWinner ? vipNumber.trim() : tempWinner;
    const historyItem = isVipWinner 
      ? `${vipNumber.trim() || '未指定'} (VIP)` 
      : winner;

    setHistoryLog(prev => [{ time: new Date().toISOString(), item: historyItem, action: 'Bingo', mode: gameMode }, ...prev]);
    
    // 衝突二（模式A）：權重消減制（若有多隻籤，銷掉 1 隻；若只剩 1 隻籤，保底保留不移除）
    let currentItems = textList.split('\n').map(s => s.trim()).filter(s => s);
    const count = currentItems.filter(i => i === target).length;
    if (count > 1) {
      const idx = currentItems.indexOf(target);
      if (idx !== -1) {
        currentItems.splice(idx, 1);
        setTextList(currentItems.join('\n'));
      }
    }
    // else: 僅剩 1 隻籤保底留存
    
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
    const isVipWinner = tempWinner === 'VIP號' || winner === 'VIP號';
    const target = isVipWinner ? vipNumber.trim() : tempWinner;
    if (gameMode === 'vip' && isVipWinner && !vipNumber.trim()) {
      setConfirmModal({ message: '請輸入 VIP 號碼', type: 'alert', onConfirm: () => setConfirmModal(null) });
      return;
    }

    const historyItem = isVipWinner 
      ? `${vipNumber.trim() || '未指定'} (VIP)` 
      : winner;

    setHistoryLog(prev => [{ time: new Date().toISOString(), item: historyItem, action: 'Next / 增加', mode: gameMode }, ...prev]);

    if (target) {
      setTextList(prev => prev + (prev.trim() ? '\n' : '') + target);
    }

    setCooldownList(prev => {
      const next = [...prev];
      if (winner && !next.includes(winner)) next.push(winner);
      if (target && !next.includes(target)) next.push(target);
      return next;
    });
    setTargetIndex(null);
    setIsGrabbed(false);
    setIsRollingOut(false);
    setShowWinnerModal(false);
  };

  const handleSkip = () => {
    playActionSkip();
    const isVipWinner = tempWinner === 'VIP號' || winner === 'VIP號';
    const target = isVipWinner ? vipNumber.trim() : tempWinner;
    if (gameMode === 'vip' && isVipWinner && !vipNumber.trim()) {
      setConfirmModal({ message: '請輸入 VIP 號碼再跳過', type: 'alert', onConfirm: () => setConfirmModal(null) });
      return;
    }

    const historyItem = isVipWinner 
      ? `${vipNumber.trim() || '未指定'} (VIP)` 
      : winner;

    setHistoryLog(prev => [{ time: new Date().toISOString(), item: historyItem, action: 'Skip / 反灰', mode: gameMode }, ...prev]);

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

  drawLotRef.current = drawLot;


  return (
    <div className={`h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col font-sans relative bg-gradient-to-br from-[#E3F2FD] via-[#F3E5F5] to-[#E8F5E9] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 p-2.5 sm:p-4 selection:bg-blue-200 select-none`}>
      
      {/* Watermarks */}
      <div className="fixed top-24 right-4 text-[16pt] text-slate-500 opacity-20 dark:opacity-10 font-bold pointer-events-none z-0 select-none whitespace-nowrap hidden sm:block">
        網站建立自楊家驊老師
      </div>
      <div className="fixed bottom-2 right-4 text-[14pt] text-slate-500 opacity-20 dark:opacity-10 font-bold pointer-events-none z-0 select-none whitespace-nowrap hidden sm:block">
        網站建立自楊家驊老師
      </div>

      <div className="w-full h-full flex flex-col max-w-[2000px] mx-auto relative z-10 overflow-hidden">
        
        {/* Header: Compact & Responsive */}
        <header className="flex flex-row justify-between items-center mb-2.5 sm:mb-3 shrink-0 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2 drop-shadow-sm text-slate-800 dark:text-slate-100">
              <Box className="text-[#007AFF] dark:text-[#4DA8DA]" size={36} />
              <span>特製抽籤系統</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3 items-center relative z-20">
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-white/60 dark:border-slate-700/60 flex gap-1 items-center">
              <button 
                onClick={() => setAppMode('box')} 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 ${appMode === 'box' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}
              >
                籤筒模式
              </button>
              <button 
                onClick={() => setAppMode('roulette')} 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 ${appMode === 'roulette' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}
              >
                轉盤模式
              </button>
            </div>

            {appMode === 'box' && (
              <div className="hidden md:flex bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-white/60 dark:border-slate-700/60 gap-1 items-center">
                {[
                  { id: 'classic', label: '木籤' },
                  { id: 'star', label: '星星' },
                  { id: 'ball', label: '扭蛋' },
                  { id: 'poem', label: '詩籤' },
                  { id: 'paper', label: '摺紙' },
                  { id: 'stone', label: '彩石' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setDrawStyle(style.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${drawStyle === style.id ? 'bg-white dark:bg-slate-700 shadow-sm text-[#007AFF] dark:text-[#4DA8DA]' : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700/40'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-1.5 sm:gap-2">
              <button 
                onClick={() => {
                  const modes = ['classic', 'retro', 'arcade'];
                  setSoundMode(modes[(modes.indexOf(soundMode) + 1) % modes.length]);
                }} 
                className="p-2.5 sm:p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 dark:border-slate-700/60 text-[#007AFF] hover:bg-white/80 transition-all active:scale-95 flex items-center gap-1.5"
                title="切換音效模式"
              >
                <Music size={18} />
                <span className="font-bold text-xs hidden lg:inline-block">
                  {soundMode === 'classic' ? '經典' : soundMode === 'retro' ? '復古' : '遊樂場'}
                </span>
              </button>
              
              <button onClick={toggleFullscreen} className="p-2.5 sm:p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 transition-all active:scale-95" title="全螢幕">
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
              
              <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 sm:p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 transition-all active:scale-95" title={isMuted ? "取消靜音" : "靜音"}>
                {isMuted ? <VolumeX size={18} className="text-red-500" /> : <Volume2 size={18} className="text-[#007AFF] dark:text-[#4DA8DA]" />}
              </button>
              
              <button onClick={() => setIsChangelogOpen(true)} className="p-2.5 sm:p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 dark:border-slate-700/60 hover:bg-white/80 transition-all active:scale-95" title="更新紀錄">
                <History size={18} className="text-indigo-500 dark:text-indigo-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Stage & Control Grid: Fully Fits Viewport */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 items-stretch overflow-hidden">
          
          {/* Left Stage (Wheel / Bucket + Draw Button): Always 100% visible */}
          <div className="lg:col-span-8 h-full flex flex-col justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-3 sm:p-4 md:p-5 border border-white/70 dark:border-slate-700/50 shadow-xl overflow-hidden relative">
            
            {/* Visual Roulette or Bucket Container */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden py-1">
              {appMode === 'box' ? (
                <Bucket 
                  items={items}
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
                  items={activeRouletteItems}
                  wheelRotation={wheelRotation}
                  drawState={drawState}
                  isItemGrayedOut={() => false}
                />
              )}
            </div>

            {/* Cooldown Pills (if active) */}
            {cooldownList.length > 0 && gameMode !== 'classic' && (
              <div className="w-full max-h-12 overflow-x-auto py-1 px-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/60 rounded-full flex items-center justify-center gap-1.5 shrink-0 my-1 animate-in zoom-in-95">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">已作答:</span>
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {cooldownList.map((item, idx) => ( 
                    <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-700 shadow-sm rounded-full text-emerald-800 dark:text-emerald-300 font-bold text-xs shrink-0">{item}</span> 
                  ))}
                </div>
              </div>
            )}

            {/* Big Action Button: Always anchored at the bottom of the stage */}
            <button 
              onClick={drawLot} 
              disabled={drawState !== 'idle' || items.length === 0}
              className={`relative shrink-0 w-full py-4 sm:py-5 rounded-[2rem] text-xl sm:text-2xl font-black shadow-xl transition-all flex items-center justify-center gap-3 z-30 overflow-hidden group mt-1.5
                ${drawState !== 'idle' || items.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-[#007AFF] hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 hover:scale-[1.01] active:scale-95 text-white shadow-blue-500/30'}`}
            >
              {drawState !== 'idle' ? <RefreshCcw className="animate-spin relative z-10" size={28} /> : <Sparkles className="relative z-10" size={28} />}
              <span className="relative z-10">
                {drawState === 'shaking' ? '搖晃中...' : drawState === 'reaching' ? '抽取中...' : drawState === 'spinning' ? '轉動中...' : '抽出幸運兒'}
              </span>
              
              {/* Spacebar Hint */}
              {drawState === 'idle' && items.length > 0 && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity hidden sm:block">
                  <kbd className="font-sans text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg border-b border-white/30 text-white">Space</kbd>
                </div>
              )}
            </button>
          </div>

          {/* Right Control Panel */}
          <div className="lg:col-span-4 h-full flex flex-col overflow-hidden relative z-20">
            {/* Mode Switcher */}
            <div className="flex bg-slate-500/10 backdrop-blur-xl p-1 rounded-2xl mb-2 sm:mb-3 border border-white/20 shrink-0">
              {[ {id:'classic', label:'經典', icon:<Layout size={16}/>}, {id:'quiz', label:'答題', icon:<Brain size={16}/>}, {id:'vip', label:'VIP', icon:<UserCheck size={16}/>} ].map(m => (
                <button key={m.id} onClick={() => handleModeChange(m.id)} className={`flex-1 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${gameMode === m.id ? 'bg-white shadow-md text-[#007AFF] scale-102' : 'text-slate-500 hover:text-slate-800'}`}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* VIP Bar */}
            {gameMode === 'vip' && (
              <div className="flex items-center justify-between mb-2 sm:mb-3 bg-gradient-to-br from-amber-400/20 to-orange-400/20 p-3 sm:p-4 rounded-2xl border border-amber-200/50 shadow-inner shrink-0">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Current VIP</span>
                  <span className="font-black text-amber-900 text-lg flex items-center gap-1.5"><Star size={20} fill="#D97706" className="text-amber-600" />VIP號碼</span>
                </div>
                <input type="text" value={vipNumber} onChange={(e) => setVipNumber(e.target.value)} placeholder="座號" disabled={drawState !== 'idle'} className="w-24 p-2 text-center rounded-xl border-2 border-white/80 font-black text-2xl outline-none focus:ring-4 focus:ring-amber-200 bg-white/90 shadow-sm transition-all" />
              </div>
            )}

            {/* Control Panel (Scrollable content) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
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
        appMode={appMode}
      />
      
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
}
