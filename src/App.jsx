import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Edit3, ListOrdered, RotateCcw, Trash2, Download, Upload, 
  Sparkles, Settings2, RefreshCcw, Box, Volume2, VolumeX, 
  Layout, Brain, UserCheck, Star, Shield, AlertCircle, Triangle 
} from 'lucide-react';

export default function App() {
  const audioCtxRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playHardShakeSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    for (let i = 0; i < 12; i++) {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 200, now + i * 0.1);
      gain.gain.setValueAtTime(0.08, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.1);
      osc.connect(gain); gain.connect(audioCtxRef.current.destination);
      osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.1);
    }
  };

  const playHandStirSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100 + Math.random() * 80, now + i * 0.2);
      gain.gain.setValueAtTime(0.05, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.2);
      osc.connect(gain); gain.connect(audioCtxRef.current.destination);
      osc.start(now + i * 0.2); osc.stop(now + i * 0.2 + 0.2);
    }
  };

  const playPopSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain); gain.connect(audioCtxRef.current.destination);
    osc.start(); osc.stop(now + 0.4);
  };

  const playVipFanfare = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    [880, 1100, 1320, 1760].forEach((f, i) => {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0.08, now + i * 0.1); gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      osc.connect(gain); gain.connect(audioCtxRef.current.destination);
      osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.5);
    });
  };

  const playActionO = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(now + 0.2);
  };

  const playActionX = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    [600, 400].forEach((f, i) => {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.03, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.1);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.1);
    });
  };

  const playActionSkip = () => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(now + 0.15);
  };

  const [gameMode, setGameMode] = useState(() => localStorage.getItem('drawLots_gameMode') || 'quiz'); 
  const [appMode, setAppMode] = useState(() => localStorage.getItem('drawLots_appMode') || 'box');
  const [wheelRotation, setWheelRotation] = useState(0);
  const generateDefaultItems = (mode) => {
    let list = Array.from({ length: 26 }, (_, i) => (i + 1).toString());
    if (mode === 'vip') list.push("VIP號");
    return list.join('\n');
  };

  const [textList, setTextList] = useState(() => {
    const saved = localStorage.getItem('drawLots_textList');
    return saved !== null ? saved : generateDefaultItems(gameMode);
  });
  const [items, setItems] = useState([]);
  
  const [drawState, setDrawState] = useState('idle'); 
  const [winner, setWinner] = useState(null);
  const [tempWinner, setTempWinner] = useState(null); 
  const [targetIndex, setTargetIndex] = useState(null); 
  const [isGrabbed, setIsGrabbed] = useState(false);    

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [drawStyle, setDrawStyle] = useState(() => localStorage.getItem('drawLots_drawStyle') || 'glass'); 
  const [vipNumber, setVipNumber] = useState(() => localStorage.getItem('drawLots_vipNumber') || '');
  const [showVipPrompt, setShowVipPrompt] = useState(false);
  const [cooldownList, setCooldownList] = useState(() => {
    const saved = localStorage.getItem('drawLots_cooldownList');
    return saved ? JSON.parse(saved) : [];
  });
  const [confirmModal, setConfirmModal] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('drawLots_appMode', appMode);
    localStorage.setItem('drawLots_gameMode', gameMode);
    localStorage.setItem('drawLots_textList', textList);
    localStorage.setItem('drawLots_drawStyle', drawStyle);
    localStorage.setItem('drawLots_vipNumber', vipNumber);
    localStorage.setItem('drawLots_cooldownList', JSON.stringify(cooldownList));
  }, [appMode, gameMode, textList, drawStyle, vipNumber, cooldownList]);

  const isItemGrayedOut = (item) => {
    if (cooldownList.includes(item)) return true;
    if (gameMode === 'vip' && item === 'VIP號') {
      const currentVip = vipNumber.trim();
      if (currentVip && cooldownList.includes(currentVip)) return true;
    }
    return false;
  };

  const handleModeChange = (newMode) => {
    setGameMode(newMode);
    let currentItems = textList.split('\n').map(s => s.trim()).filter(s => s);
    if (newMode !== 'vip') {
      setTextList(currentItems.filter(item => item !== "VIP號").join('\n'));
    } else {
      if (!currentItems.includes("VIP號")) {
        currentItems.push("VIP號");
        setTextList(sortTextListArray(currentItems).join('\n'));
      }
    }
  };

  const sortTextListArray = (itemsArray) => {
    return [...itemsArray].sort((a, b) => {
      const numA = Number(a), numB = Number(b);
      const isNumA = !isNaN(numA) && a.trim() !== '', isNumB = !isNaN(numB) && b.trim() !== '';
      if (isNumA && isNumB) return numA - numB;
      if (isNumA && !isNumB) return -1;
      if (!isNumA && isNumB) return 1;
      if (a === "VIP號") return 1;
      if (b === "VIP號") return -1;
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
    setItems(currentItems);
  }, [textList, gameMode]);

  const bucketLayouts = useMemo(() => {
    const layouts = [];
    let seed = 12345; 
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

    const ITEM_W = 14; 
    const ITEM_H = 10; 

    for (let i = 0; i < 80; i++) {
      let bestY = 999;
      let bestX = 50;

      for (let attempt = 0; attempt < 30; attempt++) {
        let u = 0, v = 0;
        while(u === 0) u = rand();
        while(v === 0) v = rand();
        let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        
        let testX = 50 + z * 12;
        testX = Math.max(15, Math.min(85, testX)); 

        let hitY = 2; // Flat floor instead of parabola

        for (let j = 0; j < layouts.length; j++) {
          const other = layouts[j];
          const dx = Math.abs(testX - other.x);
          
          if (dx < ITEM_W) {
            const dy = ITEM_H * Math.sqrt(1 - Math.pow(dx / ITEM_W, 2));
            const localHitY = other.y + dy * 0.85; 
            if (localHitY > hitY) {
              hitY = localHitY;
            }
          }
        }

        if (hitY < bestY) {
          bestY = hitY;
          bestX = testX;
        }
      }

      const rot = (rand() - 0.5) * 160;

      layouts.push({
        x: bestX,
        y: bestY,
        left: `${bestX}%`,
        bottom: `${bestY}%`,
        transform: `rotate(${rot}deg) scale(0.65)`,
        zIndex: Math.floor(40 - bestY / 2.5), 
        delay: `${(i % 5) * 0.05}s`
      });
    }

    const shuffled = [...layouts];
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }
    return shuffled;
  }, []);

  const drawLot = () => {
    if (drawState !== 'idle' || items.length === 0) return;
    initAudio();
    setShowWinnerModal(false);
    setWinner(null);
    setTempWinner(null);
    setTargetIndex(null);
    setIsGrabbed(false);

    

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
      const targetAngle = 360 - (selectedIndex * sliceAngle + sliceAngle / 2);
      const spins = 360 * 5; 
      
      setWheelRotation(prev => {
        const currentRotation = prev % 360;
        let diff = targetAngle - currentRotation;
        if (diff < 0) diff += 360;
        return prev + spins + diff + (Math.random() - 0.5) * (sliceAngle * 0.8);
      });
      
      playHandStirSound();

      setTimeout(() => {
        if (gameMode === 'vip' && selected === 'VIP號') {
          playVipFanfare();
        } else {
          playPopSound();
        }
        setWinner(selected);
        setShowWinnerModal(true);
        setDrawState('idle'); 
        setTempWinner(null);
        setTargetIndex(null);
      }, 4000);
      return;
    }
    
    setDrawState('shaking');
    playHardShakeSound();

    setTimeout(() => {
      setTargetIndex(selectedIndex);
      setTempWinner(selected);

      setDrawState('reaching');
      playHandStirSound();

      setTimeout(() => {
        setIsGrabbed(true);
      }, 900);

      setTimeout(() => {
        if (gameMode === 'vip' && selected === 'VIP號') {
          playVipFanfare();
        } else {
          playPopSound();
        }

        setWinner(selected);
        setShowWinnerModal(true);
        setDrawState('idle'); 
        setTempWinner(null);
        setTargetIndex(null);
        setIsGrabbed(false);
      }, 1800); 
    }, 1200); 
  };

  const handleO = () => {
    if (!winner) return;
    playActionO();
    let target = winner;
    if (gameMode === 'vip' && winner === 'VIP號') {
      target = vipNumber.trim();
      if (!target) { 
        setConfirmModal({ message: '請先輸入 VIP 號碼再執行動作唷！', onConfirm: () => setConfirmModal(null), type: 'alert' });
        return; 
      }
    }
    const currentList = textList.split('\n').map(s => s.trim()).filter(s => s);
    const count = currentList.filter(item => item === target).length;
    if (count > 1) {
      const idx = currentList.indexOf(target);
      if (idx > -1) {
        currentList.splice(idx, 1);
        setTextList(sortTextListArray(currentList).join('\n'));
      }
    }
    setCooldownList([]); 
    setShowWinnerModal(false);
    if (gameMode === 'vip') {
      setVipNumber(''); setTimeout(() => setShowVipPrompt(true), 500);
    }
  };

  const handleX = () => {
    if (!winner) return;
    playActionX();
    let target = winner;
    if (gameMode === 'vip' && winner === 'VIP號') {
      target = vipNumber.trim();
      if (!target) { 
        setConfirmModal({ message: '請先輸入 VIP 號碼再執行動作唷！', onConfirm: () => setConfirmModal(null), type: 'alert' });
        return; 
      }
    }
    const currentList = textList.split('\n').map(s => s.trim()).filter(s => s);
    currentList.push(target);
    setTextList(sortTextListArray(currentList).join('\n'));
    setCooldownList(prev => {
      const next = [...prev];
      if (!next.includes(winner)) next.push(winner);
      if (!next.includes(target)) next.push(target);
      return next;
    });
    setShowWinnerModal(false);
  };

  const handleSkip = () => {
    if (!winner) return;
    playActionSkip();
    let target = winner;
    if (gameMode === 'vip' && winner === 'VIP號') {
      target = vipNumber.trim();
      if (!target) { 
        setConfirmModal({ message: '請先輸入 VIP 號碼再執行跳過唷！', onConfirm: () => setConfirmModal(null), type: 'alert' });
        return; 
      }
    }
    setCooldownList(prev => {
      const next = [...prev];
      if (!next.includes(winner)) next.push(winner);
      if (!next.includes(target)) next.push(target);
      return next;
    });
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

  const getHash = (str) => {
    let hash = 0;
    if (typeof str !== 'string') return hash;
    for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    return Math.abs(hash);
  };

  const renderItemStyle = (text, isModal = false) => {
    const baseClass = "flex items-center justify-center font-black ease-out";
    const sizeClass = isModal ? "w-64 h-64 text-7xl" : "w-16 h-16 text-lg"; 
    
    const hashValue = getHash(text);
    const hue = hashValue % 360;
    const mainColor = `hsl(${hue}, 85%, 60%)`;
    const darkColor = `hsl(${hue}, 90%, 40%)`;

    const grayClass = isItemGrayedOut(text) ? "grayscale opacity-40 mix-blend-luminosity" : "";

    switch (drawStyle) {
      case 'pingpong':
        return (
          <div 
            className={`${baseClass} ${sizeClass} ${grayClass} rounded-full relative overflow-hidden`}
            style={{ 
              color: '#fff', 
              background: `radial-gradient(circle at 30% 30%, ${mainColor}, ${darkColor})`,
              boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.4), inset 10px 10px 20px rgba(255,255,255,0.5), 0 10px 15px -3px rgba(0,0,0,0.3)'
            }}
          >
            <div className="absolute top-[8%] left-[15%] w-[50%] h-[35%] bg-gradient-to-b from-white/70 to-transparent rounded-[100%] rotate-[-20deg] blur-[1px]"></div>
            <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] font-black">{text}</span>
          </div>
        );

      case 'glass':
        return (
          <div 
            className={`${baseClass} ${sizeClass} ${grayClass} rounded-full backdrop-blur-xl relative overflow-hidden`}
            style={{ 
              background: `radial-gradient(circle at 60% 60%, ${darkColor}40, ${mainColor}80)`, 
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: `inset -10px -20px 30px rgba(0,0,0,0.3), inset 10px 20px 30px rgba(255,255,255,0.8), 0 15px 25px rgba(0,0,0,0.2), 0 0 20px ${mainColor}40`
            }}
          >
            <div className="absolute top-[5%] left-[10%] w-[70%] h-[40%] bg-gradient-to-b from-white/90 to-white/10 rounded-[100%] rotate-[-15deg]"></div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isModal ? 'w-40 h-40 border-4' : 'w-10 h-10 border-[1.5px]'} bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.2)]`}>
              <span className="relative z-10 text-slate-800 drop-shadow-sm font-black">{text}</span>
            </div>
          </div>
        );

      case 'poem':
        const poemSizeClass = isModal ? "w-40 h-80 text-6xl" : "w-10 h-28 text-sm";
        const isNumeric = /^\d+$/.test(text);
        return (
          <div 
            className={`${baseClass} ${poemSizeClass} ${grayClass} relative overflow-hidden`}
            style={{ 
              color: '#7f1d1d', 
              background: 'linear-gradient(to right, #fef3c7 0%, #fde68a 20%, #fcd34d 50%, #fde68a 80%, #fef3c7 100%)',
              boxShadow: 'inset 2px 0 5px rgba(255,255,255,0.9), inset -2px 0 5px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.25)',
              borderRadius: isModal ? '8px 8px 12px 12px' : '2px 2px 4px 4px'
            }}
          >
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.02 0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            
            <div className={`absolute border-[#991b1b] ${isModal ? 'inset-4 border-y-8 border-x-4' : 'inset-1.5 border-y-2 border-x-[1px]'}`}></div>
            <div className={`absolute border-[#991b1b] ${isModal ? 'inset-6 border-y-4 border-x-2' : 'inset-2.5 border-y-[1px] border-x-[0.5px]'}`}></div>
            
            <span className="relative z-10 font-serif drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: isModal ? '10px' : '2px', ...(isNumeric ? { textCombineUpright: 'all', WebkitTextCombine: 'horizontal' } : {}) }}>
              {text}
            </span>
            
            <div className={`absolute top-0 w-full ${isModal ? 'h-6' : 'h-2'} bg-gradient-to-b from-red-800 to-red-600 shadow-sm`}></div>
          </div>
        );

      case 'paper':
        const paperSize = isModal ? "w-80 h-48 text-7xl" : "w-20 h-12 text-lg";
        return (
          <div 
            className={`${baseClass} ${paperSize} ${grayClass} shadow-[0_15px_25px_rgba(0,0,0,0.25)] relative flex items-center justify-center`}
            style={{ 
              color: '#0f172a', 
              background: `linear-gradient(to right, #e2e8f0 0%, #ffffff 32%, #94a3b8 33%, #cbd5e1 34%, #ffffff 65%, #94a3b8 66%, #cbd5e1 67%, #ffffff 100%)`, 
              clipPath: 'polygon(0% 10%, 33% 0%, 66% 10%, 100% 0%, 100% 90%, 66% 100%, 33% 90%, 0% 100%)'
            }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            <span className="relative z-10 font-bold font-serif drop-shadow-[0_1px_1px_rgba(255,255,255,1)] transform -rotate-1 skew-x-2 text-slate-800">{text}</span>
          </div>
        );

      case 'stone':
        const br1 = 40 + (hashValue % 30); const br2 = 40 + ((hashValue >> 2) % 30);
        const br3 = 40 + ((hashValue >> 4) % 30); const br4 = 40 + ((hashValue >> 6) % 30);
        const br5 = 40 + ((hashValue >> 8) % 30); const br6 = 40 + ((hashValue >> 10) % 30);
        const br7 = 40 + ((hashValue >> 12) % 30); const br8 = 40 + ((hashValue >> 14) % 30);
        const blobShape = `${br1}% ${100-br1}% ${br2}% ${100-br2}% / ${br3}% ${br4}% ${100-br4}% ${100-br3}%`;

        return (
          <div 
            className={`${baseClass} ${sizeClass} ${grayClass} shadow-[inset_-8px_-12px_20px_rgba(0,0,0,0.5),0_15px_25px_rgba(0,0,0,0.3)] relative overflow-hidden`}
            style={{ 
              background: `radial-gradient(circle at 35% 35%, ${mainColor}, ${darkColor})`, 
              color: '#fff', 
              borderRadius: blobShape, 
              border: '2px solid rgba(255,255,255,0.3)' 
            }}
          >
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            <div className="absolute w-[60%] h-[40%] bg-gradient-to-b from-white/70 to-transparent rounded-full rotate-[-30deg]" style={{ top: '10%', left: '15%', borderRadius: blobShape }}></div>
            <div className="absolute w-[30%] h-[20%] bg-white/40 blur-[2px] rounded-full" style={{ bottom: '15%', right: '15%', borderRadius: blobShape }}></div>
            
            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-black tracking-wider">{text}</span>
          </div>
        );

      default: return null;
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#F3E5F5] to-[#E8F5E9] text-slate-900 p-4 md:p-8 font-sans overflow-x-hidden selection:bg-blue-200">
      <div className="max-w-[1500px] mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <h1 className="text-5xl font-black flex items-center justify-center md:justify-start gap-3 drop-shadow-sm">
              <Box className="text-[#007AFF]" size={48} />
              LottoTube
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium opacity-80">充滿驚喜的真實物理堆疊與多種魔幻手勢</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 items-center">
            
            <div className="bg-white/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] shadow-lg border border-white/60 flex gap-1 items-center">
              <button 
                onClick={() => setAppMode('box')} 
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${appMode === 'box' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-500 hover:bg-white/60'}`}
              >
                籤筒模式
              </button>
              <button 
                onClick={() => setAppMode('roulette')} 
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${appMode === 'roulette' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-500 hover:bg-white/60'}`}
              >
                轉盤模式
              </button>
            </div>

            {appMode === 'box' && (
              <div className="bg-white/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] shadow-lg border border-white/60 flex flex-wrap gap-1">
                <span className="flex items-center px-4 text-sm font-bold text-slate-500 border-r border-slate-300/30">
                <Settings2 size={18} className="mr-1" /> 樣式
              </span>
              {[
                { id: 'pingpong', label: '乒乓球' },
                { id: 'glass', label: '玻璃球' },
                { id: 'poem', label: '寺廟詩籤' },
                { id: 'paper', label: '摺紙籤' },
                { id: 'stone', label: '繽紛石頭' }
              ].map(style => (
                <button
                  key={style.id}
                  onClick={() => setDrawStyle(style.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${drawStyle === style.id ? 'bg-white shadow-sm text-[#007AFF]' : 'text-slate-500 hover:bg-white/40'}`}
                >
                  {style.label}
                </button>
              ))}
              </div>
            )}

            <button onClick={() => setIsMuted(!isMuted)} className="p-4 bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-lg border border-white/60 text-slate-700 hover:bg-white/80 transition-colors">
              {isMuted ? <VolumeX size={24} className="text-red-500" /> : <Volume2 size={24} className="text-[#007AFF]" />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          <div className="lg:col-span-7 bg-white/40 backdrop-blur-[40px] rounded-[4rem] p-4 md:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/70 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
            
            {appMode === 'box' ? (
              <div className="relative w-[90vw] md:w-[70vw] lg:w-[40vw] max-w-[500px] aspect-[4/5] md:aspect-[3/4] mt-10 flex flex-col items-center justify-end">
                <div className={`w-full h-full relative origin-center transition-transform duration-1000 ${drawState === 'reaching' ? 'rotate-180' : ''} ${drawState === 'shaking' ? 'animate-bucket-shake-hard' : ''}`}>
                  <div className="absolute left-[40px] right-[40px] inset-y-0 bg-slate-400/20 rounded-b-[4rem] rounded-t-2xl border border-white/40 transform scale-x-95 translate-y-4 z-0"></div>
                  
                  <div className="absolute left-[45px] right-[45px] bottom-6 top-6 overflow-visible rounded-b-[3.5rem] rounded-t-xl z-10">
                     {items.slice(0, 80).map((item, idx) => {
                       const layout = bucketLayouts[idx] || bucketLayouts[0];
                       const isTarget = idx === targetIndex;
                       
                       return (
                         <div 
                           key={idx} 
                           className={`absolute transition-all ${isTarget && drawState === 'reaching' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                           style={{ 
                             left: layout.left, 
                             bottom: layout.bottom, 
                             zIndex: layout.zIndex,
                             transitionDuration: drawState === 'reaching' ? '1.5s' : '0.3s',
                             transform: drawState === 'reaching' ? `translate(-50%, -800px) rotate(${layout.x * 2}deg)` : 'translate(0, 0)' 
                           }}
                         >
                           <div style={{ transform: `translate(-50%, 50%) ${layout.transform}` }}>
                             <div className={`animate-drop-in ${drawState !== 'idle' && !isGrabbed ? 'animate-stir' : ''}`} style={{ animationDelay: layout.delay }}>
                               {renderItemStyle(item)}
                             </div>
                           </div>
                         </div>
                       );
                     })}
                  </div>

                  <div className={`absolute left-[40px] right-[40px] inset-y-0 bg-gradient-to-b from-white/30 to-white/5 backdrop-blur-[2px] border-4 border-t-0 border-white/60 rounded-b-[4rem] rounded-t-none shadow-[inset_0_-20px_40px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.05)] z-[100] pointer-events-none`}>
                    <div className="w-1/3 h-full bg-gradient-to-r from-white/60 to-transparent skew-x-12 transform -translate-x-4 opacity-50"></div>
                  </div>

                  <div className={`absolute left-[40px] right-[40px] top-0 h-12 bg-[#d7ccc8]/90 backdrop-blur-md rounded-[1.1rem] border-b-4 border-[#8d6e63] shadow-md flex items-center justify-center z-[110]`}>
                    <div className="w-[90%] h-4 bg-black/10 rounded-full blur-[2px]"></div>
                  </div>
                </div>

                {drawState === 'reaching' && tempWinner && (
                  <div className="absolute bottom-0 left-1/2 z-[120] animate-item-fall-out">
                    <div className="transform -translate-x-1/2 scale-150 md:scale-200 drop-shadow-2xl">
                       {renderItemStyle(tempWinner)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full aspect-square mt-4 flex flex-col items-center justify-center overflow-visible">

                <div className="relative w-[90vw] md:w-[70vw] lg:w-[45vw] aspect-square z-10 drop-shadow-2xl flex items-center justify-center">
                  <div 
                    className="w-full h-full rounded-full border-[10px] md:border-[16px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden transition-transform ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{ 
                      transform: `rotate(${wheelRotation}deg)`, 
                      transitionDuration: drawState === 'spinning' ? '4s' : '0s' 
                    }}
                  >
                    {items.length > 0 ? (
                      <div 
                        className="relative w-full h-full rounded-full overflow-hidden" 
                        style={{ 
                          background: `conic-gradient(${items.map((item, i) => {
                            const sliceAngle = 360 / items.length;
                            const hue = Math.imul(31, getHash(item)) % 360;
                            return `hsl(${hue}, 75%, 85%) ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
                          }).join(', ')})` 
                        }}
                      >
                        {/* Slice Dividers */}
                        {items.map((_, i) => (
                          <div 
                            key={`div-${i}`}
                            className="absolute top-1/2 left-1/2 w-[50%] h-[3px] bg-white origin-top-left"
                            style={{ transform: `rotate(${i * (360 / items.length) - 90}deg) translateY(-50%)` }}
                          ></div>
                        ))}
                        {/* Text */}
                        {items.map((item, idx) => {
                           const sliceAngle = 360 / items.length;
                           const rotation = idx * sliceAngle + sliceAngle / 2 - 90;
                           
                           return (
                             <div 
                               key={idx} 
                               className="absolute top-1/2 left-1/2 w-[47%] h-0 origin-top-left"
                               style={{ transform: `rotate(${rotation}deg)` }}
                             >
                               <div 
                                 className="absolute right-0 top-0"
                                 style={{ transform: 'translateY(-50%) rotate(90deg)' }}
                               >
                                 <span className="text-slate-800 font-black text-base md:text-xl whitespace-nowrap">
                                   {item}
                                 </span>
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">請輸入名單</div>
                    )}
                  </div>
                  
                  {/* Pointer */}
                  <div className="absolute top-[-25px] md:top-[-35px] left-1/2 transform -translate-x-1/2 z-[20]">
                    <Triangle className="text-[#007AFF] drop-shadow-xl fill-current rotate-180 scale-125 md:scale-150" size={56} />
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white opacity-80 mix-blend-overlay"></div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-md border-4 md:border-8 border-slate-200 z-[20]"></div>
                </div>
              </div>
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
              <div className="mt-8 w-full bg-white/30 backdrop-blur-md border border-white/60 rounded-[2.5rem] p-5 flex flex-col items-center justify-center animate-in zoom-in-95">
                <span className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2"><Shield size={18} className="text-emerald-500" />已回答空間 (豁免中)</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {cooldownList.map((item, idx) => ( <span key={idx} className="px-4 py-1.5 bg-white shadow-sm rounded-full text-emerald-800 font-black text-lg">{item}</span> ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white/40 backdrop-blur-[40px] rounded-[4rem] p-6 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/70 flex flex-col h-full">
            
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

            <div className="flex items-center justify-between mb-5 px-2">
              <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                <Edit3 size={26} className="text-[#007AFF]" />
                參與清單
              </h2>
              <span className="bg-blue-500/10 text-[#007AFF] text-sm font-black px-4 py-2 rounded-full border border-blue-100">
                {items.length} 位參與者
              </span>
            </div>
            
            <textarea 
              value={textList} 
              onChange={(e) => setTextList(e.target.value)} 
              disabled={drawState !== 'idle'}
              className="flex-grow min-h-[220px] w-full p-8 border-2 border-white/80 rounded-[3rem] focus:ring-8 focus:ring-blue-100/50 focus:border-blue-400 outline-none resize-none transition-all text-slate-700 font-bold text-2xl leading-relaxed bg-white/60 shadow-inner"
              placeholder="請輸入每一行一個名稱或號碼..." 
            />

            <div className="grid grid-cols-3 gap-4 mt-8">
              <button onClick={() => setConfirmModal({ message: '確定要還原預設名單嗎？', onConfirm: resetWheel })} className="flex flex-col items-center justify-center gap-2 p-5 bg-white/60 hover:bg-white rounded-[2rem] font-black text-slate-700 transition-all shadow-sm active:scale-90 border border-white/80 text-sm">
                <RotateCcw size={22} /> 重設
              </button>
              <button onClick={sortTextList} className="flex flex-col items-center justify-center gap-2 p-5 bg-white/60 hover:bg-white rounded-[2rem] font-black text-slate-700 transition-all shadow-sm active:scale-90 border border-white/80 text-sm">
                <ListOrdered size={22} /> 排序
              </button>
              <button onClick={() => setConfirmModal({ message: '確定要清空所有參與者嗎？', onConfirm: () => { setTextList(''); setCooldownList([]); setConfirmModal(null); } })} className="flex flex-col items-center justify-center gap-2 p-5 bg-red-50 hover:bg-red-100 rounded-[2rem] font-black text-red-600 transition-all shadow-sm active:scale-90 border border-red-100 text-sm">
                <Trash2 size={22} /> 清空
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button onClick={exportData} className="flex items-center justify-center gap-3 px-4 py-5 bg-blue-500/10 hover:bg-blue-500/20 text-[#007AFF] rounded-[2rem] font-black border border-blue-200 transition-all active:scale-95 text-lg">
                <Download size={22} /> 匯出雲端
              </button>
              <button onClick={() => fileInputRef.current.click()} className="flex items-center justify-center gap-3 px-4 py-5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 rounded-[2rem] font-black border border-emerald-200 transition-all active:scale-95 text-lg">
                <Upload size={22} /> 匯入名單
              </button>
              <input type="file" ref={fileInputRef} onChange={importData} accept=".txt" className="hidden" />
            </div>
          </div>
        </div>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-[80px] flex items-center justify-center p-8 z-[60] animate-in fade-in duration-300">
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
      )}

      {showWinnerModal && winner && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-[60px] flex items-center justify-center p-8 z-50 animate-in fade-in duration-500">
          <div className="bg-white/95 backdrop-blur-3xl rounded-[4.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] p-14 max-w-2xl w-full text-center border border-white animate-in zoom-in-90 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_#cbd5e1_1px,_transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>

            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#007AFF] rounded-full flex items-center justify-center shadow-2xl border-[8px] border-white ring-4 ring-blue-50">
              <Sparkles size={60} className="text-white animate-pulse" />
            </div>
            <p className="text-slate-400 font-black tracking-[0.3em] uppercase mb-4 mt-10 relative z-10">Congratulations</p>
            
            <div className="flex justify-center items-center min-h-[250px] mb-12 animate-bounce-custom relative z-10">
              {renderItemStyle(winner, true)}
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
      )}

      {gameMode === 'vip' && showVipPrompt && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-[60px] flex items-center justify-center p-8 z-50 animate-in fade-in duration-300">
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
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bucket-shake-hard {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15% { transform: translateX(-15px) rotate(-8deg); }
          30% { transform: translateX(15px) rotate(8deg); }
          45% { transform: translateX(-15px) rotate(-8deg); }
          60% { transform: translateX(15px) rotate(8deg); }
          75% { transform: translateX(-10px) rotate(-5deg); }
          90% { transform: translateX(10px) rotate(5deg); }
        }
        .animate-bucket-shake-hard { animation: bucket-shake-hard 0.3s ease-in-out infinite; }

        @keyframes bucket-shake-light {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-1deg); }
          50% { transform: translateX(3px) rotate(1deg); }
          75% { transform: translateX(-3px) rotate(-1deg); }
        }
        .animate-bucket-shake-light { animation: bucket-shake-light 0.4s ease-in-out infinite; }

        @keyframes stir {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(6px, -12px) rotate(10deg); }
          50% { transform: translate(-6px, 8px) rotate(-10deg); }
          75% { transform: translate(8px, -8px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-stir { animation: stir 0.4s ease-in-out infinite alternate; }

        @keyframes item-fall-out {
          0% { transform: translateY(0px) scale(0.1); opacity: 0; }
          20% { transform: translateY(120px) scale(0.8); opacity: 1; }
          40% { transform: translateY(-250px) scale(1.6); }
          60% { transform: translateY(-180px) scale(1.4); }
          80% { transform: translateY(-220px) scale(1.8); }
          100% { transform: translateY(-220px) scale(2); opacity: 1; }
        }
        .animate-item-fall-out { animation: item-fall-out 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

        @keyframes drop-in {
          0% { transform: translateY(-500px) scale(0.5); opacity: 0; }
          60% { transform: translateY(20px) scale(1); opacity: 1; }
          80% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .animate-drop-in { animation: drop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }

        @keyframes bounce-custom {
          0% { transform: translateY(80px) scale(0.5); opacity: 0; }
          60% { transform: translateY(-30px) scale(1.1); opacity: 1; }
          80% { transform: translateY(15px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-bounce-custom { animation: bounce-custom 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </div>
  );
}
