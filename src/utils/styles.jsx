import React from 'react';

export const getHash = (str) => {
  let hash = 0;
  if (typeof str !== 'string') return hash;
  for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  return Math.abs(hash);
};

export const renderItemStyle = (text, drawStyle, isItemGrayedOut, isModal = false) => {
  const baseClass = "flex items-center justify-center font-black ease-out";
  const sizeClass = isModal ? "w-64 h-64 text-7xl" : "w-16 h-16 text-lg"; 
  
  const hashValue = getHash(text);
  const hue = hashValue % 360;
  const mainColor = `hsl(${hue}, 85%, 60%)`;
  const darkColor = `hsl(${hue}, 90%, 40%)`;

  const grayClass = isItemGrayedOut(text) ? "grayscale opacity-40 mix-blend-luminosity" : "";

  switch (drawStyle) {
    case 'ball':
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

    case 'classic':
      const stickSize = isModal ? "w-24 h-80 text-5xl" : "w-6 h-28 text-sm";
      return (
        <div 
          className={`${baseClass} ${stickSize} ${grayClass} relative overflow-hidden`}
          style={{ 
            color: '#451a03', 
            background: 'linear-gradient(to right, #d4a373 0%, #faedcd 20%, #e9edc9 50%, #faedcd 80%, #d4a373 100%)',
            boxShadow: 'inset 2px 0 5px rgba(255,255,255,0.5), inset -2px 0 5px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.3)',
            borderRadius: isModal ? '20px 20px 5px 5px' : '5px 5px 2px 2px'
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.05 0.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
          <span className="relative z-10 font-bold font-serif drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: isModal ? '8px' : '2px' }}>
            {text}
          </span>
          <div className={`absolute top-0 w-full ${isModal ? 'h-10' : 'h-3'} bg-red-700/80 shadow-sm`}></div>
        </div>
      );

    case 'star':
      const starSize = isModal ? "w-64 h-64 text-4xl" : "w-16 h-16 text-xs";
      return (
        <div 
          className={`${baseClass} ${starSize} ${grayClass} relative flex items-center justify-center`}
          style={{ 
            color: '#fff', 
            background: `linear-gradient(135deg, ${mainColor}, ${darkColor})`,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/50 mix-blend-overlay"></div>
          <span className="relative z-10 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mt-2">{text}</span>
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

    default:
      const fallbackSize = isModal ? "w-24 h-80 text-5xl" : "w-6 h-28 text-sm";
      return (
        <div 
          className={`${baseClass} ${fallbackSize} ${grayClass} relative overflow-hidden`}
          style={{ 
            color: '#451a03', 
            background: 'linear-gradient(to right, #d4a373 0%, #faedcd 20%, #e9edc9 50%, #faedcd 80%, #d4a373 100%)',
            boxShadow: 'inset 2px 0 5px rgba(255,255,255,0.5), inset -2px 0 5px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.3)',
            borderRadius: isModal ? '20px 20px 5px 5px' : '5px 5px 2px 2px'
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.05 0.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
          <span className="relative z-10 font-bold font-serif drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: isModal ? '8px' : '2px' }}>
            {text}
          </span>
          <div className={`absolute top-0 w-full ${isModal ? 'h-10' : 'h-3'} bg-red-700/80 shadow-sm`}></div>
        </div>
      );
  }
};
