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
  const [handType, setHandType] = useState('cat'); 
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
    localStorage.setItem('drawLots_gameMode', gameMode);
    localStorage.setItem('drawLots_textList', textList);
    localStorage.setItem('drawLots_drawStyle', drawStyle);
    localStorage.setItem('drawLots_vipNumber', vipNumber);
    localStorage.setItem('drawLots_cooldownList', JSON.stringify(cooldownList));
  }, [gameMode, textList, drawStyle, vipNumber, cooldownList]);

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

        let hitY = 1 + Math.pow(testX - 50, 2) / 45; 

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

    const hands = ['human', 'cat', 'robot', 'dragon', 'monkey', 'chameleon', 'elephant', 'bird'];
    setHandType(hands[Math.floor(Math.random() * hands.length)]);
    
    let validIndices = items.map((item, i) => !isItemGrayedOut(item) ? i : -1).filter(i => i !== -1);
    if (validIndices.length === 0) { 
      validIndices = items.map((_, i) => i);
      setCooldownList([]); 
    }
    
    setDrawState('shaking');
    playHardShakeSound();

    setTimeout(() => {
      const randomI = Math.floor(Math.random() * validIndices.length);
      const selectedIndex = validIndices[randomI];
      const selected = items[selectedIndex];
      
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

  const renderItemStyle = (text, isModal = false) => {
    const baseClass = "flex items-center justify-center font-black ease-out";
    const sizeClass = isModal ? "w-64 h-64 text-7xl" : "w-16 h-16 text-lg"; 
    
    const getHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
      return Math.abs(hash);
    };
    
    const hashValue = getHash(text);
    const hue = hashValue % 360;
    const mainColor = `hsl(${hue}, 85%, 60%)`;
    const darkColor = `hsl(${hue}, 90%, 40%)`;

    const grayClass = isItemGrayedOut(text) ? "grayscale opacity-40 mix-blend-luminosity" : "";

    switch (drawStyle) {
      case 'pingpong':
        return (
          <div 
            className={`${baseClass} ${sizeClass} ${grayClass} rounded-full shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.2)] relative overflow-hidden bg-orange-400`}
            style={{ color: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div className="absolute top-[10%] left-[20%] w-1/3 h-1/3 bg-white/40 rounded-full blur-[2px]"></div>
            <span className="relative z-10 drop-shadow-md">{text}</span>
          </div>
        );

      case 'glass':
        return (
          <div 
            className={`${baseClass} ${sizeClass} ${grayClass} rounded-full shadow-[inset_-10px_-20px_30px_rgba(0,0,0,0.4),inset_10px_20px_30px_rgba(255,255,255,0.9),0_10px_20px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden`}
            style={{ background: `radial-gradient(circle at 70% 70%, ${darkColor}, ${mainColor} 70%)`, border: '2px solid rgba(255,255,255,0.7)' }}
          >
            <div className="absolute top-[5%] left-[15%] w-1/2 h-1/3 bg-white/80 rounded-full blur-[4px] transform -rotate-12"></div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isModal ? 'w-36 h-36 border-4' : 'w-10 h-10 border-2'} bg-white rounded-full flex items-center justify-center border-slate-200/50 shadow-inner`}>
              <span className="relative z-10 text-slate-800 drop-shadow-sm">{text}</span>
            </div>
          </div>
        );

      case 'poem':
        const poemSizeClass = isModal ? "w-40 h-80 text-6xl" : "w-10 h-28 text-sm";
        const isNumeric = /^\d+$/.test(text);
        return (
          <div 
            className={`${baseClass} ${poemSizeClass} ${grayClass} bg-[#Fdf6e3] shadow-[0_10px_20px_rgba(0,0,0,0.2)] relative overflow-hidden`}
            style={{ color: '#b71c1c', border: '1px solid #d7ccc8', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10zM10 0h10v10H10V0z\' fill=\'%23d7ccc8\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}
          >
            <div className={`absolute inset-2 border-2 border-[#b71c1c] ${isModal ? 'inset-4 border-4' : ''}`}></div>
            <div className={`absolute inset-3 border border-[#b71c1c] ${isModal ? 'inset-6 border-2' : ''}`}></div>
            <span className="relative z-10" style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: isModal ? '10px' : '2px', ...(isNumeric ? { textCombineUpright: 'all', WebkitTextCombine: 'horizontal' } : {}) }}>
              {text}
            </span>
          </div>
        );

      case 'paper':
        const paperSize = isModal ? "w-72 h-44 text-7xl" : "w-20 h-12 text-lg";
        return (
          <div 
            className={`${baseClass} ${paperSize} ${grayClass} shadow-[0_10px_20px_rgba(0,0,0,0.2)] relative flex items-center justify-center`}
            style={{ color: '#1e293b', background: `linear-gradient(to right, #e2e8f0 0%, #f8fafc 33%, #cbd5e1 33%, #ffffff 66%, #e2e8f0 66%, #f8fafc 100%)`, clipPath: 'polygon(0% 8%, 33% 0%, 66% 8%, 100% 0%, 100% 92%, 66% 100%, 33% 92%, 0% 100%)' }}
          >
            <span className="relative z-10 font-bold font-serif drop-shadow-sm transform -rotate-2">{text}</span>
          </div>
        );

      case 'stone':
        const br1 = 40 + (hashValue % 40); const br2 = 40 + ((hashValue >> 2) % 40);
        const br3 = 40 + ((hashValue >> 4) % 40); const br4 = 40 + ((hashValue >> 6) % 40);
        const br5 = 40 + ((hashValue >> 8) % 40); const br6 = 40 + ((hashValue >> 10) % 40);
        const br7 = 40 + ((hashValue >> 12) % 40); const br8 = 40 + ((hashValue >> 14) % 40);
        const blobShape = `${br1}% ${100-br1}% ${br2}% ${100-br2}% / ${br3}% ${br4}% ${100-br4}% ${100-br3}%`;

        return (
          <div 
            className={`${baseClass} ${sizeClass} ${grayClass} shadow-[inset_-8px_-12px_20px_rgba(0,0,0,0.3),0_12px_20px_rgba(0,0,0,0.3)]`}
            style={{ background: `radial-gradient(circle at 35% 35%, ${mainColor}, ${darkColor})`, color: '#fff', borderRadius: blobShape, border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="absolute w-1/3 h-1/3 bg-white/20 rounded-full blur-[2px]" style={{ top: '15%', left: '20%', borderRadius: blobShape }}></div>
            <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{text}</span>
          </div>
        );

      default: return null;
    }
  };

  const renderCharacterBody = (type) => {
    switch(type) {
      case 'human': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="robe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#6d28d9" />
                <stop offset="100%" stopColor="#4c1d95" />
             </linearGradient>
             <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
             </linearGradient>
             <filter id="glow">
               <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
               <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
               </feMerge>
             </filter>
          </defs>
          <path d="M10,150 C15,90 35,50 50,50 C65,50 85,90 90,150 Z" fill="url(#robe)"/>
          <path d="M20,150 C25,100 40,70 50,70 C60,70 75,100 80,150 Z" fill="#5b21b6" opacity="0.5"/>
          <circle cx="50" cy="40" r="25" fill="url(#skin)"/>
          <path d="M40,35 Q50,45 60,35" stroke="#854d0e" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <circle cx="43" cy="30" r="3" fill="#422006"/>
          <circle cx="57" cy="30" r="3" fill="#422006"/>
          <circle cx="43" cy="29" r="1" fill="white"/>
          <circle cx="57" cy="29" r="1" fill="white"/>
          <path d="M15,10 L85,45 L50,15 Z" fill="#fcd34d" filter="url(#glow)"/>
          <path d="M50,15 L15,10 C20,30 40,5 50,20 C60,5 80,30 85,10 Z" fill="#6d28d9"/>
        </svg>
      );
      case 'cat': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
            <radialGradient id="catBody" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="80%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
            <radialGradient id="catBelly" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="100%" stopColor="#ffedd5" />
            </radialGradient>
          </defs>
          <path d="M15,150 C15,60 85,60 85,150 Z" fill="url(#catBody)"/>
          <path d="M30,150 C30,90 70,90 70,150 Z" fill="url(#catBelly)"/>
          <polygon points="15,60 10,10 45,40" fill="#c2410c"/>
          <polygon points="85,60 90,10 55,40" fill="#c2410c"/>
          <polygon points="20,50 15,20 40,40" fill="#fecaca"/>
          <polygon points="80,50 85,20 60,40" fill="#fecaca"/>
          <circle cx="35" cy="70" r="8" fill="#1e293b"/>
          <circle cx="65" cy="70" r="8" fill="#1e293b"/>
          <circle cx="37" cy="67" r="3" fill="white"/>
          <circle cx="67" cy="67" r="3" fill="white"/>
          <path d="M50,85 L45,90 L55,90 Z" fill="#fca5a5"/>
          <path d="M50,90 Q40,100 30,95 M50,90 Q60,100 70,95" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M10,80 L-5,75 M10,85 L-10,85 M10,90 L-5,95" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M90,80 L105,75 M90,85 L110,85 M90,90 L105,95" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
      case 'chameleon': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="chamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
             </linearGradient>
          </defs>
          <path d="M5,150 C5,40 60,40 95,120 Z" fill="url(#chamGrad)"/>
          <circle cx="30" cy="70" r="5" fill="#16a34a"/>
          <circle cx="50" cy="60" r="4" fill="#16a34a"/>
          <circle cx="70" cy="80" r="6" fill="#16a34a"/>
          <circle cx="45" cy="90" r="5" fill="#16a34a"/>
          <path d="M15,50 Q40,35 60,45" stroke="#86efac" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <circle cx="75" cy="90" r="22" fill="#1e293b"/>
          <circle cx="75" cy="90" r="16" fill="#fbbf24"/>
          <circle cx="80" cy="90" r="6" fill="#000"/>
          <circle cx="82" cy="88" r="2" fill="#fff"/>
          <path d="M5,150 C-20,150 -20,190 20,190 C50,190 50,160 20,160 C5,160 5,175 20,175" stroke="url(#chamGrad)" strokeWidth="16" fill="none" strokeLinecap="round"/>
        </svg>
      );
      case 'elephant': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="eleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
             </linearGradient>
             <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
             </linearGradient>
          </defs>
          <path d="M40,50 C-10,30 -20,140 40,130 Z" fill="url(#earGrad)"/>
          <path d="M30,60 C-5,50 -10,120 30,110 Z" fill="#f1f5f9" opacity="0.3"/>
          <rect x="25" y="40" width="70" height="110" rx="35" fill="url(#eleGrad)"/>
          <path d="M35,60 Q50,45 65,60" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <circle cx="70" cy="70" r="6" fill="#0f172a"/>
          <circle cx="72" cy="68" r="2" fill="#fff"/>
          <path d="M85,85 Q115,100 105,130 Q100,140 90,135" stroke="#f8fafc" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M90,85 Q125,100 115,130" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
      );
      case 'monkey': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
            <radialGradient id="monkeyBody" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#713f12" />
            </radialGradient>
            <radialGradient id="monkeyFace" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fde047" />
            </radialGradient>
          </defs>
          <circle cx="15" cy="70" r="18" fill="url(#monkeyBody)"/>
          <circle cx="85" cy="70" r="18" fill="url(#monkeyBody)"/>
          <circle cx="15" cy="70" r="10" fill="#fef08a"/>
          <circle cx="85" cy="70" r="10" fill="#fef08a"/>
          <rect x="20" y="50" width="60" height="100" rx="30" fill="url(#monkeyBody)"/>
          <path d="M25,80 Q50,50 75,80 Q85,110 50,110 Q15,110 25,80 Z" fill="url(#monkeyFace)"/>
          <circle cx="38" cy="75" r="6" fill="#422006"/>
          <circle cx="62" cy="75" r="6" fill="#422006"/>
          <circle cx="40" cy="73" r="2" fill="#fff"/>
          <circle cx="64" cy="73" r="2" fill="#fff"/>
          <path d="M45,95 Q50,105 55,95" stroke="#713f12" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M48,88 L52,88" stroke="#713f12" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
      case 'dragon': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="dragonBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
             </linearGradient>
             <linearGradient id="dragonBelly" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#eab308" />
             </linearGradient>
          </defs>
          <path d="M30,150 C30,70 10,50 40,20 C50,10 60,10 70,30 L90,20 L80,45 L95,50 L70,60 C75,90 70,150 70,150 Z" fill="url(#dragonBody)"/>
          <path d="M45,150 C45,80 40,60 55,40 C60,50 65,70 65,150 Z" fill="url(#dragonBelly)"/>
          <polygon points="35,30 15,20 30,45" fill="#b91c1c"/>
          <polygon points="55,20 40,0 60,25" fill="#b91c1c"/>
          <circle cx="65" cy="45" r="6" fill="#ef4444"/>
          <circle cx="65" cy="45" r="2" fill="#fff"/>
          <path d="M60,35 Q65,30 70,35" stroke="#000" strokeWidth="2" fill="none"/>
          <path d="M75,55 Q80,60 85,55" stroke="#000" strokeWidth="1" fill="none"/>
          <circle cx="78" cy="58" r="1.5" fill="#fcd34d"/>
        </svg>
      );
      case 'bird': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
            <radialGradient id="birdBody" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
            <radialGradient id="birdBelly" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </radialGradient>
          </defs>
          <path d="M10,120 Q5,90 20,70 Q30,60 50,70 Q20,100 10,120 Z" fill="#0284c7"/>
          <ellipse cx="50" cy="100" rx="45" ry="60" fill="url(#birdBody)"/>
          <ellipse cx="65" cy="110" rx="20" ry="45" fill="url(#birdBelly)"/>
          <path d="M50,45 Q70,40 75,60 Q85,50 90,70 L50,70 Z" fill="#0284c7"/>
          <polygon points="75,70 115,75 75,85" fill="#f59e0b"/>
          <polygon points="75,75 110,75 75,80" fill="#fcd34d"/>
          <circle cx="60" cy="65" r="6" fill="#0f172a"/>
          <circle cx="62" cy="63" r="2" fill="#fff"/>
          <path d="M20,130 Q10,140 0,130 Q20,150 40,140 Z" fill="#0369a1"/>
        </svg>
      );
      case 'robot': return (
        <svg width="150" height="180" viewBox="0 0 100 150" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="20%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="80%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
             </linearGradient>
             <linearGradient id="darkMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#334155" />
             </linearGradient>
          </defs>
          <path d="M50,15 L50,45" stroke="#94a3b8" strokeWidth="4"/>
          <circle cx="50" cy="15" r="6" fill="#ef4444">
             <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <rect x="20" y="45" width="60" height="55" rx="10" fill="url(#metal)"/>
          <rect x="25" y="55" width="50" height="25" rx="5" fill="url(#darkMetal)"/>
          <circle cx="35" cy="67" r="5" fill="#38bdf8"/>
          <circle cx="65" cy="67" r="5" fill="#38bdf8"/>
          <path d="M25,100 Q50,110 75,100 L70,150 L30,150 Z" fill="url(#metal)"/>
          <line x1="30" y1="115" x2="70" y2="115" stroke="#475569" strokeWidth="2"/>
          <line x1="30" y1="130" x2="70" y2="130" stroke="#475569" strokeWidth="2"/>
        </svg>
      );
      default: return null;
    }
  };

  const renderCharacterLimb = (type) => {
    switch(type) {
      case 'human': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="armRobe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#6d28d9" />
                <stop offset="100%" stopColor="#5b21b6" />
             </linearGradient>
             <linearGradient id="armSkin" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
             </linearGradient>
          </defs>
          <path d="M30,-50 C20,30 35,90 25,140 L75,140 C65,90 80,30 70,-50 Z" fill="url(#armRobe)"/>
          <path d="M25,120 L75,120 L72,145 L28,145 Z" fill="#4c1d95"/>
          <rect x="20" y="135" width="60" height="15" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/>
          <path d="M30,150 C10,180 20,210 50,215 C80,210 90,180 70,150 Z" fill="url(#armSkin)"/>
          <path d="M40,150 L40,195 M50,150 L50,200 M60,150 L60,195" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="50" cy="180" r="15" fill="#fbbf24" opacity="0.4" filter="blur(4px)"/>
        </svg>
      );
      case 'cat': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
          <defs>
            <radialGradient id="pawGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
          </defs>
          <path d="M25,-50 C20,30 35,100 20,160 C15,200 85,200 80,160 C65,100 80,30 75,-50 Z" fill="url(#pawGrad)"/>
          <circle cx="30" cy="175" r="12" fill="url(#pawGrad)"/>
          <circle cx="50" cy="182" r="12" fill="url(#pawGrad)"/>
          <circle cx="70" cy="175" r="12" fill="url(#pawGrad)"/>
          <path d="M35,150 C45,135 55,135 65,150 C72,165 60,175 50,165 C40,175 28,165 35,150 Z" fill="#fca5a5"/>
          <circle cx="30" cy="180" r="4" fill="#fca5a5"/>
          <circle cx="50" cy="187" r="4" fill="#fca5a5"/>
          <circle cx="70" cy="180" r="4" fill="#fca5a5"/>
        </svg>
      );
      case 'robot': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
           <defs>
             <linearGradient id="armMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#64748b" />
             </linearGradient>
           </defs>
          <rect x="35" y="-50" width="30" height="170" fill="url(#armMetal)" rx="10"/>
          <line x1="35" y1="20" x2="65" y2="20" stroke="#475569" strokeWidth="4"/>
          <line x1="35" y1="60" x2="65" y2="60" stroke="#475569" strokeWidth="4"/>
          <line x1="35" y1="100" x2="65" y2="100" stroke="#475569" strokeWidth="4"/>
          <circle cx="50" cy="120" r="20" fill="#f59e0b"/>
          <circle cx="50" cy="120" r="12" fill="#1e293b"/>
          <path d="M35,130 C15,150 10,180 25,200 L40,180 C30,165 35,145 45,140 Z" fill="url(#armMetal)"/>
          <path d="M65,130 C85,150 90,180 75,200 L60,180 C70,165 65,145 55,140 Z" fill="url(#armMetal)"/>
          <circle cx="25" cy="200" r="4" fill="#ef4444"/>
          <circle cx="75" cy="200" r="4" fill="#ef4444"/>
        </svg>
      );
      case 'dragon': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="dragonArm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
             </linearGradient>
          </defs>
          <path d="M30,-50 C20,30 45,90 25,150 C45,170 55,170 75,150 C55,90 80,30 70,-50 Z" fill="url(#dragonArm)"/>
          <path d="M25,20 L15,15 M28,60 L18,55 M30,100 L20,95" stroke="#14532d" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="50" cy="140" r="22" fill="#15803d"/>
          <path d="M25,150 C5,180 0,210 15,220 C25,200 30,180 40,160 Z" fill="#fef08a"/>
          <path d="M50,155 C40,195 45,225 60,230 C65,205 60,180 60,155 Z" fill="#fef08a"/>
          <path d="M75,150 C95,180 100,210 85,220 C75,200 70,180 60,160 Z" fill="#fef08a"/>
        </svg>
      );
      case 'monkey': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
           <defs>
             <linearGradient id="monkeyArm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5a2b" />
                <stop offset="100%" stopColor="#5c3a21" />
             </linearGradient>
             <linearGradient id="monkeyHand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d4b455" />
             </linearGradient>
           </defs>
          <path d="M45,-50 C30,30 20,90 55,150 C90,210 105,150 80,120 C55,90 40,130 50,160 C55,175 75,175 80,160" stroke="url(#monkeyArm)" strokeWidth="24" fill="none" strokeLinecap="round"/>
          <path d="M55,150 C90,210 105,150 80,120 C55,90 40,130 50,160 C55,175 75,175 80,160" stroke="url(#monkeyHand)" strokeWidth="16" fill="none" strokeLinecap="round"/>
        </svg>
      );
      case 'chameleon': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="chamArm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#db2777" />
             </linearGradient>
          </defs>
          <path d="M45,-50 Q30,60 50,160 L70,160 Q85,60 75,-50 Z" fill="url(#chamArm)"/>
          <circle cx="45" cy="30" r="4" fill="#be185d"/>
          <circle cx="75" cy="70" r="5" fill="#be185d"/>
          <circle cx="40" cy="110" r="3" fill="#be185d"/>
          <ellipse cx="60" cy="175" rx="30" ry="25" fill="url(#chamArm)"/>
          <ellipse cx="60" cy="175" rx="30" ry="25" fill="rgba(255,255,255,0.3)" clipPath="ellipse(20px 15px at 50px 165px)"/>
          <path d="M40,185 Q60,210 80,185" stroke="#be185d" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      );
      case 'elephant': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
             </linearGradient>
          </defs>
          <path d="M35,-50 C35,60 20,140 45,180 C60,205 80,205 85,180 C100,140 85,60 85,-50 Z" fill="url(#trunkGrad)"/>
          <path d="M35,30 Q60,40 85,30" stroke="#64748b" strokeWidth="3" fill="none"/>
          <path d="M30,80 Q60,95 87,80" stroke="#64748b" strokeWidth="3" fill="none"/>
          <path d="M25,130 Q60,150 90,130" stroke="#64748b" strokeWidth="3" fill="none"/>
          <path d="M50,185 C45,200 60,210 65,190 Z" fill="#f1f5f9"/>
          <path d="M75,180 C90,195 75,205 65,190 Z" fill="#f1f5f9"/>
        </svg>
      );
      case 'bird': return (
        <svg width="150" height="300" viewBox="0 0 100 200" fill="none" className="drop-shadow-2xl">
          <defs>
             <linearGradient id="birdClaw" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
             </linearGradient>
          </defs>
          <path d="M45,-50 L45,80 L75,80 L75,-50 Z" fill="url(#birdClaw)"/>
          <line x1="45" y1="20" x2="75" y2="20" stroke="#b45309" strokeWidth="2"/>
          <line x1="45" y1="50" x2="75" y2="50" stroke="#b45309" strokeWidth="2"/>
          <path d="M35,70 C20,130 35,180 45,210 C60,170 55,130 55,70 Z" fill="url(#birdClaw)"/>
          <path d="M55,70 C40,130 55,180 65,220 C80,170 75,130 75,70 Z" fill="url(#birdClaw)"/>
          <path d="M75,70 C60,130 75,180 85,210 C100,170 95,130 95,70 Z" fill="url(#birdClaw)"/>
          <path d="M42,210 L45,220 L48,210 Z" fill="#1e293b"/>
          <path d="M62,220 L65,230 L68,220 Z" fill="#1e293b"/>
          <path d="M82,210 L85,220 L88,210 Z" fill="#1e293b"/>
        </svg>
      );
      default: return null;
    }
  };

  const getGrabOffset = (type) => {
    switch(type) {
      case 'human': return { x: 50, y: 190 };
      case 'cat': return { x: 50, y: 180 };
      case 'robot': return { x: 50, y: 185 };
      case 'dragon': return { x: 50, y: 200 };
      case 'monkey': return { x: 75, y: 165 };
      case 'chameleon': return { x: 60, y: 180 };
      case 'elephant': return { x: 65, y: 190 };
      case 'bird': return { x: 60, y: 190 };
      default: return { x: 50, y: 180 };
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

            <button onClick={() => setIsMuted(!isMuted)} className="p-4 bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-lg border border-white/60 text-slate-700 hover:bg-white/80 transition-colors">
              {isMuted ? <VolumeX size={24} className="text-red-500" /> : <Volume2 size={24} className="text-[#007AFF]" />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          <div className="lg:col-span-7 bg-white/40 backdrop-blur-[40px] rounded-[4rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/70 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
            
            <div className="relative w-[400px] h-[28rem] mt-10 flex flex-col items-center justify-end">
              
              <div className="absolute right-[-20px] top-[-60px] z-[5]">
                {renderCharacterBody(handType)}
              </div>

              <div className="absolute left-[40px] right-[40px] inset-y-0 bg-slate-400/20 rounded-b-[4rem] rounded-t-2xl border border-white/40 transform scale-x-95 translate-y-4 z-0"></div>
              
              <div className="absolute left-[45px] right-[45px] bottom-6 top-6 overflow-hidden rounded-b-[3.5rem] rounded-t-xl z-10">
                 {items.slice(0, 80).map((item, idx) => {
                   const layout = bucketLayouts[idx] || bucketLayouts[0];
                   
                   const isTarget = idx === targetIndex;
                   const hideItem = isTarget && isGrabbed;

                   return (
                     <div 
                       key={idx} 
                       className={`absolute transition-all duration-300 ${hideItem ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                       style={{ 
                         left: layout.left, 
                         bottom: layout.bottom, 
                         zIndex: layout.zIndex 
                       }}
                     >
                       <div style={{ transform: `translate(-50%, 50%) ${layout.transform}` }}>
                         <div className={`${drawState !== 'idle' && !isGrabbed ? 'animate-stir' : ''}`} style={{ animationDelay: layout.delay }}>
                           {renderItemStyle(item)}
                         </div>
                       </div>
                     </div>
                   );
                 })}
              </div>

              {drawState === 'reaching' && (
                <div className="absolute top-[-50px] left-1/2 z-[45] animate-hand-reach drop-shadow-2xl">
                  {renderCharacterLimb(handType)}

                  {tempWinner && (
                    <div 
                      className="absolute z-[60] animate-appear-grab"
                      style={{ 
                        left: `${getGrabOffset(handType).x}px`, 
                        top: `${getGrabOffset(handType).y}px` 
                      }}
                    >
                      <div className="transform -translate-x-1/2 -translate-y-1/2 scale-75">
                         {renderItemStyle(tempWinner)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={`absolute left-[40px] right-[40px] inset-y-0 bg-gradient-to-b from-white/30 to-white/5 backdrop-blur-[2px] border-4 border-t-0 border-white/60 rounded-b-[4rem] rounded-t-none shadow-[inset_0_-20px_40px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.05)] z-[100] transition-transform pointer-events-none ${drawState === 'shaking' ? 'animate-bucket-shake-hard' : drawState === 'reaching' ? 'animate-bucket-shake-light' : ''}`}>
                <div className="w-1/3 h-full bg-gradient-to-r from-white/60 to-transparent skew-x-12 transform -translate-x-4 opacity-50"></div>
              </div>

              <div className={`absolute left-[40px] right-[40px] top-0 h-12 bg-[#d7ccc8]/90 backdrop-blur-md rounded-[1.1rem] border-b-4 border-[#8d6e63] shadow-md flex items-center justify-center z-[110] transition-transform ${drawState === 'shaking' ? 'animate-bucket-shake-hard' : drawState === 'reaching' ? 'animate-bucket-shake-light' : ''}`}>
                <div className="w-[90%] h-4 bg-black/10 rounded-full blur-[2px]"></div>
              </div>

            </div>

            <button 
              onClick={drawLot} 
              disabled={drawState !== 'idle' || items.length === 0}
              className={`mt-12 w-full max-w-sm py-7 rounded-[2.5rem] text-3xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 z-50
                ${drawState !== 'idle' || items.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#007AFF] hover:bg-[#0062CC] hover:scale-105 active:scale-95 text-white shadow-blue-500/40'}`}
            >
              {drawState !== 'idle' ? <RefreshCcw className="animate-spin" size={36} /> : <Sparkles size={36} />}
              {drawState === 'shaking' ? '搖晃中...' : drawState === 'reaching' ? '抽取中...' : '抽出幸運兒'}
            </button>
            
            {cooldownList.length > 0 && gameMode !== 'classic' && (
              <div className="mt-8 w-full max-w-sm bg-white/30 backdrop-blur-md border border-white/60 rounded-[2.5rem] p-5 flex flex-col items-center justify-center animate-in zoom-in-95">
                <span className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2"><Shield size={18} className="text-emerald-500" />已回答空間 (豁免中)</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {cooldownList.map((item, idx) => ( <span key={idx} className="px-4 py-1.5 bg-white shadow-sm rounded-full text-emerald-800 font-black text-lg">{item}</span> ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white/40 backdrop-blur-[40px] rounded-[4rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/70 flex flex-col h-full">
            
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

        @keyframes hand-reach {
          0% { transform: translate(-50%, -350px); opacity: 0; }
          15% { transform: translate(-50%, -20px); opacity: 1; } 
          35% { transform: translate(calc(-50% - 20px), 150px) rotate(-10deg); } 
          50% { transform: translate(calc(-50% + 10px), 180px) rotate(10deg); } 
          65% { transform: translate(-50%, 150px) scale(0.9); } 
          85% { transform: translate(-50%, -20px); opacity: 1; }
          100% { transform: translate(calc(-50% + 150px), -50px); opacity: 0; } 
        }
        .animate-hand-reach { animation: hand-reach 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

        @keyframes appear-grab {
          0%, 49.9% { opacity: 0; transform: scale(0.3); }
          50%, 100% { opacity: 1; transform: scale(1); }
        }
        .animate-appear-grab { animation: appear-grab 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

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
