import React from 'react';
import { Triangle } from 'lucide-react';
import { getHash } from '../utils/styles';

export default function Roulette({
  items,
  wheelRotation,
  drawState,
  isItemGrayedOut
}) {
  return (
    <div className="relative w-full max-w-[800px] lg:max-w-[950px] aspect-square mx-auto mt-4 flex flex-col items-center justify-center overflow-visible">
      <div className="relative w-[95%] sm:w-[95%] max-w-[550px] md:max-w-[700px] lg:max-w-[800px] aspect-square z-10 drop-shadow-2xl flex items-center justify-center">
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
                  const grayed = isItemGrayedOut && isItemGrayedOut(item);
                  const hue = Math.imul(31, getHash(item)) % 360;
                  const color = grayed ? `hsl(0, 0%, 88%)` : `hsl(${hue}, 75%, 85%)`;
                  return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
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
                 const isVip = item === 'VIP號' || item.startsWith('VIP');
                 const isLong = item.length >= 3;
                 const grayed = isItemGrayedOut && isItemGrayedOut(item);
                 
                 // Approximate chord length at radius
                 const chordWidth = items.length > 26 ? 32 : items.length > 18 ? 44 : items.length > 12 ? 58 : 80;

                 return (
                   <div 
                     key={idx} 
                     className="absolute top-1/2 left-1/2 w-[46%] h-0 origin-top-left pointer-events-none"
                     style={{ transform: `rotate(${rotation}deg)` }}
                   >
                      <div 
                        className="absolute right-1 sm:right-2 top-0 flex items-center justify-center"
                        style={{ 
                          transform: 'translateY(-50%) rotate(90deg)',
                          width: `${chordWidth}px`,
                        }}
                      >
                        <span 
                          className={`block text-center font-black truncate leading-none select-none ${
                            grayed ? 'text-slate-400 line-through opacity-50' : isVip ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-slate-900'
                          } ${
                            items.length > 24 
                              ? (isLong ? 'text-[8.5px] tracking-tighter' : 'text-xs md:text-sm')
                              : items.length > 16
                              ? (isLong ? 'text-[10px] tracking-tight' : 'text-sm md:text-base')
                              : (isLong ? 'text-xs md:text-sm' : 'text-base md:text-lg')
                          }`}
                          style={{ maxWidth: `${chordWidth - 2}px` }}
                          title={item}
                        >
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
  );
}
