import React from 'react';
import { renderItemStyle } from '../utils/styles';

export default function Bucket({
  items,
  bucketLayouts,
  drawState,
  isGrabbed,
  targetIndex,
  isRollingOut,
  drawStyle,
  isItemGrayedOut
}) {
  return (
    <div className="relative w-[90vw] md:w-[70vw] lg:w-[40vw] max-w-[500px] aspect-[4/5] md:aspect-[3/4] mt-10 flex flex-col items-center justify-end">
      <div className={`w-full h-full relative origin-center transition-transform duration-1000 ${drawState === 'reaching' ? 'rotate-[120deg]' : ''} ${drawState === 'shaking' ? 'animate-bucket-shake-hard' : ''}`}>
        <div className="absolute left-[40px] right-[40px] inset-y-0 bg-slate-400/20 rounded-b-[4rem] rounded-t-2xl border border-white/40 transform scale-x-95 translate-y-4 z-0"></div>
        
        <div className={`absolute left-[45px] right-[45px] bottom-6 top-6 rounded-b-[3.5rem] rounded-t-xl z-10 ${drawState === 'shaking' ? 'overflow-hidden' : 'overflow-visible'}`}>
           {items.slice(0, 80).map((item, idx) => {
             const layout = bucketLayouts[idx] || bucketLayouts[0];
             const isTarget = idx === targetIndex;
             
             return (
               <div 
                 key={`bucket-item-${idx}`} 
                 className={`absolute transition-all ease-[cubic-bezier(0.25,1,0.5,1)] ${isTarget && isRollingOut ? 'animate-roll-out-winner z-[200]' : ''}`}
                 style={{ 
                   left: layout.left, 
                   bottom: layout.bottom, 
                   zIndex: isTarget && isRollingOut ? 200 : layout.zIndex,
                   transitionDuration: drawState === 'reaching' && !(isTarget && isRollingOut) ? '1.5s' : '0s',
                   transform: drawState === 'reaching' ? `translate(-30px, -200px) rotate(${layout.x * 2}deg)` : 'translate(0, 0)' 
                 }}
               >
                 <div style={{ transform: `translate(-50%, 50%) ${layout.transform}` }}>
                   <div className="animate-drop-in" style={{ animationDelay: layout.delay, animationFillMode: 'both' }}>
                     <div 
                       className={`${drawState === 'shaking' && !isGrabbed ? layout.shakeClass : ''}`} 
                       style={{ 
                         animationDuration: layout.shakeDuration, 
                         animationDelay: layout.shakeDelay 
                       }}
                     >
                       {renderItemStyle(item, drawStyle, isItemGrayedOut, false)}
                     </div>
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
    </div>
  );
}
