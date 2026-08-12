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
    <div className="relative w-full shrink-0 flex items-center justify-center mx-auto overflow-visible">
      <div 
        className="relative w-full aspect-square max-h-[50vh] max-w-[50vh] md:max-h-[55vh] md:max-w-[55vh] lg:max-h-[50vh] lg:max-w-[50vh] xl:max-h-[65vh] xl:max-w-[65vh] 2xl:max-h-[70vh] 2xl:max-w-[70vh] flex flex-col items-center justify-center" 
        style={{ containerType: 'inline-size' }}
      >
        <div className="relative w-[95%] h-[95%] shrink-0 z-10 drop-shadow-2xl flex items-center justify-center">
          <div 
            className="w-full h-full rounded-full border-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden transition-transform ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ 
            borderWidth: '2.5cqi',
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
                  className="absolute top-1/2 left-1/2 w-[50%] bg-white origin-top-left"
                  style={{ height: '0.6cqi', transform: `rotate(${i * (360 / items.length) - 90}deg) translateY(-50%)` }}
                ></div>
              ))}
              {/* Text */}
              {items.map((item, idx) => {
                 const sliceAngle = 360 / items.length;
                 const rotation = idx * sliceAngle + sliceAngle / 2 - 90;
                 const isVip = item === 'VIP號' || item.startsWith('VIP');
                 const isLong = item.length >= 3;
                 const grayed = isItemGrayedOut && isItemGrayedOut(item);
                 
                 // Dynamic scaling using cqi (container query inline-size)
                 const relativeChordWidth = Math.min(16, 280 / items.length);
                 
                 let relativeTextSize;
                 if (items.length > 24) {
                   relativeTextSize = isLong ? Math.min(1.8, relativeChordWidth * 0.35) : Math.min(2.2, relativeChordWidth * 0.4);
                 } else if (items.length > 16) {
                   relativeTextSize = isLong ? Math.min(2.0, relativeChordWidth * 0.35) : Math.min(2.6, relativeChordWidth * 0.4);
                 } else {
                   relativeTextSize = isLong ? Math.min(2.5, relativeChordWidth * 0.35) : Math.min(3.5, relativeChordWidth * 0.45);
                 }
                 if (items.length <= 6) {
                   relativeTextSize = Math.min(relativeTextSize, 6);
                 }

                 return (
                   <div 
                     key={idx} 
                     className="absolute top-1/2 left-1/2 w-[46%] h-0 origin-top-left pointer-events-none"
                     style={{ transform: `rotate(${rotation}deg)` }}
                   >
                      <div 
                        className="absolute top-0 flex items-center justify-center"
                        style={{ 
                          right: '2cqi',
                          transform: 'translateY(-50%) rotate(90deg)',
                          width: `${relativeChordWidth}cqi`,
                        }}
                      >
                        <span 
                          className={`block text-center font-black truncate leading-none select-none ${
                            grayed ? 'text-slate-400 line-through opacity-50' : isVip ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-slate-900'
                          }`}
                          style={{ 
                            maxWidth: `${relativeChordWidth - 0.5}cqi`,
                            fontSize: `${relativeTextSize}cqi`,
                            letterSpacing: isLong ? '-0.05em' : 'normal'
                          }}
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
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold" style={{ fontSize: '4cqi' }}>請輸入名單</div>
          )}
        </div>
        
        {/* Pointer */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-[20]" style={{ top: '-4.5cqi' }}>
          <Triangle className="text-[#007AFF] drop-shadow-xl fill-current rotate-180" style={{ width: '12cqi', height: '12cqi' }} />
          <div className="absolute left-1/2 transform -translate-x-1/2 rounded-full bg-white opacity-80 mix-blend-overlay" style={{ top: '2.5cqi', width: '3cqi', height: '3cqi' }}></div>
        </div>
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border-slate-200 z-[20]" style={{ width: '12cqi', height: '12cqi', borderWidth: '1cqi' }}></div>
      </div>
    </div>
    </div>
  );
}
