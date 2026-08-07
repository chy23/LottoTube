import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { renderItemStyle } from '../utils/styles';

export default function Bucket({
  items,
  drawState,
  isGrabbed,
  targetIndex,
  targetBucketIndex,
  isRollingOut,
  tempWinner,
  drawStyle,
  isItemGrayedOut
}) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const itemsRef = useRef([]);

  // Fixed logical size for physics simulation
  const width = 300;
  const height = 500;
  const wallThickness = 100;
  
  useEffect(() => {
    // Handle potential Vite CJS/ESM interop issues
    const M = Matter.default || Matter;
    
    // Initialize Matter.js Engine
    const engine = M.Engine.create({
      positionIterations: 8,
      velocityIterations: 6,
    });
    engine.world.gravity.y = 1.2;
    engineRef.current = engine;

    // Create secure boundaries strictly inside the visible cylinder
    const floor = M.Bodies.rectangle(width / 2, height + wallThickness / 2 - 20, width * 2, wallThickness, { isStatic: true, friction: 0.6, restitution: 0.2 });
    const leftWall = M.Bodies.rectangle(-wallThickness / 2 + 35, height / 2, wallThickness, height * 2, { isStatic: true, friction: 0.2 });
    const rightWall = M.Bodies.rectangle(width + wallThickness / 2 - 35, height / 2, wallThickness, height * 2, { isStatic: true, friction: 0.2 });
    const ceiling = M.Bodies.rectangle(width / 2, -wallThickness / 2 + 75, width * 2, wallThickness, { isStatic: true, friction: 0.2, restitution: 0.2 });
    
    M.World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    // Create bodies for items
    const bodies = [];
    const maxItems = Math.min(items.length, 80);
    
    for (let i = 0; i < maxItems; i++) {
      const radius = 26; // approximate radius of item
      const x = width / 2 + (Math.random() - 0.5) * 80;
      const y = 90 + (i % 8) * 40; // drop smoothly inside the tube
      
      const body = M.Bodies.circle(x, y, radius, {
        restitution: 0.5,
        friction: 0.15,
        frictionAir: 0.015,
        density: 0.005,
        render: { visible: false } // Render via React DOM
      });
      
      bodies.push({ id: i, body });
      M.World.add(engine.world, body);
    }
    
    // Save bodies to refs for syncing with DOM
    itemsRef.current = bodies;

    // Run Engine
    const runner = M.Runner.create();
    M.Runner.run(runner, engine);
    runnerRef.current = runner;

    // Sync bodies to DOM with boundary clamping
    let animationFrame;
    const updateDOM = () => {
      if (itemsRef.current && sceneRef.current) {
        itemsRef.current.forEach((itemObj, i) => {
          const domElement = document.getElementById(`physics-item-${i}`);
          if (domElement) {
            const { position, angle } = itemObj.body;
            // Clamp position strictly within cylinder bounds
            const clampedX = Math.max(35, Math.min(width - 35, position.x));
            const clampedY = Math.max(75, Math.min(height - 25, position.y));
            
            const leftPct = (clampedX / width) * 100;
            const topPct = (clampedY / height) * 100;
            
            const isTarget = i === targetBucketIndex;
            if (isTarget && isRollingOut) {
              domElement.style.opacity = '0';
              return;
            }
            
            domElement.style.opacity = '1';
            domElement.style.left = `${leftPct}%`;
            domElement.style.top = `${topPct}%`;
            domElement.style.transform = `translate(-50%, -50%) rotate(${angle}rad) scale(0.65)`;
          }
        });
      }
      animationFrame = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    return () => {
      cancelAnimationFrame(animationFrame);
      M.Runner.stop(runner);
      M.Engine.clear(engine);
    };
  }, [items.length]); // Re-init if total items change

  // Apply shaking & stirring forces strictly within bounds
  useEffect(() => {
    if (!engineRef.current || !itemsRef.current) return;
    const M = Matter.default || Matter;
    const engine = engineRef.current;
    
    if (drawState === 'shaking') {
      // Natural, contained agitation that keeps all items inside
      itemsRef.current.forEach(({ body }) => {
        const forceX = (Math.random() - 0.5) * 0.04 * body.mass;
        const forceY = -(0.015 + Math.random() * 0.035) * body.mass;
        M.Body.applyForce(body, body.position, { x: forceX, y: forceY });
      });
    } else {
      engine.world.gravity.y = 1.2;
    }
  }, [drawState]);

  return (
    <div className="relative w-[85vw] md:w-[50vw] lg:w-[35vw] max-w-[320px] aspect-[3/5] mt-8 flex flex-col items-center justify-end">
      
      {/* Container visual layer */}
      <div 
        ref={sceneRef}
        className={`w-full h-full relative origin-center transition-transform duration-700 ease-in-out ${
          drawState === 'shaking' ? 'animate-bucket-shake-hard' : ''
        } ${drawState === 'reaching' ? 'rotate-[100deg] scale-90' : ''}`}
      >
        {/* Soft Ambient Floor Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/30 dark:bg-black/70 blur-xl rounded-full pointer-events-none z-0"></div>

        {/* Outer Cylinder Tube - Frosted & Concealed Body */}
        <div className="absolute left-[20px] right-[20px] top-4 bottom-0 rounded-b-[1.5rem] rounded-t-2xl bg-gradient-to-b from-white/80 via-white/50 to-white/70 dark:from-slate-700/85 dark:via-slate-800/80 dark:to-slate-900/90 border-2 border-white/80 dark:border-slate-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_0_30px_rgba(255,255,255,0.4)] backdrop-blur-2xl overflow-hidden z-0">
          {/* Internal vertical highlights */}
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-white/50 to-transparent opacity-80"></div>
          <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/40 to-transparent opacity-70"></div>
          <div className="absolute left-6 top-0 w-12 h-full bg-white/20 skew-x-[-10deg] transform -translate-x-1"></div>
        </div>
        
        {/* Physics Items Container (Inside the tube, strictly contained) */}
        <div className="absolute left-[22px] right-[22px] top-6 bottom-2 rounded-b-[1.5rem] rounded-t-lg z-10 overflow-hidden pointer-events-none">
           {items.slice(0, 80).map((item, idx) => {
             const isTarget = idx === targetBucketIndex;
             if (isTarget && isRollingOut) return null;

             return (
               <div 
                 key={`bucket-item-${idx}`} 
                 id={`physics-item-${idx}`}
                 className="absolute transition-none z-10"
                 style={{ 
                   left: '50%', top: '50%', // Initial center position
                 }}
               >
                 {renderItemStyle(item, drawStyle, isItemGrayedOut, false, true)}
               </div>
             );
           })}
        </div>

        {/* Front Frosted Glass Cylinder Layer - Masks & blurs numbers */}
        <div className="absolute left-[20px] right-[20px] top-4 bottom-0 rounded-b-[1.5rem] rounded-t-2xl bg-gradient-to-tr from-white/40 via-white/20 to-white/35 dark:from-white/10 dark:via-transparent dark:to-white/15 border border-white/50 dark:border-slate-600/40 backdrop-blur-xl shadow-[inset_0_-15px_30px_rgba(0,0,0,0.12),inset_0_0_20px_rgba(255,255,255,0.5)] pointer-events-none z-[100] overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/25 rounded-full blur-2xl"></div>
          {/* Subtle center metallic badge / logo watermark line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-white/30 rounded-full blur-[0.5px]"></div>
        </div>

        {/* Base Ring / Bottom Rim */}
        <div className="absolute left-[16px] right-[16px] bottom-[-2px] h-6 rounded-b-[1.8rem] rounded-t-[50%] bg-gradient-to-b from-[#dfd7d0] to-[#bcaaa4] dark:from-slate-600 dark:to-slate-800 border-2 border-t-0 border-[#d7ccc8] dark:border-slate-500 shadow-md z-[105] pointer-events-none"></div>

        {/* Top 3D Elliptical Rim / Mouth of the Bucket */}
        <div className="absolute left-[16px] right-[16px] top-2 h-10 rounded-[50%] bg-gradient-to-b from-[#dfd7d0] to-[#bcaaa4] dark:from-slate-600 dark:to-slate-800 border-2 border-[#d7ccc8] dark:border-slate-500 shadow-md flex items-center justify-center z-[110] pointer-events-none">
          {/* Inner Mouth Opening */}
          <div className="w-[88%] h-5 rounded-[50%] bg-gradient-to-b from-black/40 via-black/20 to-transparent border border-black/20 shadow-inner"></div>
        </div>

        {/* Dedicated Unclipped Winning Item Roll Out Layer (Reveals Number) */}
        {isRollingOut && (tempWinner || items[targetBucketIndex]) && (
          <div 
            className="absolute top-4 left-1/2 z-[120] pointer-events-none animate-roll-out-winner"
          >
            <div className="drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]">
              {renderItemStyle(tempWinner || items[targetBucketIndex], drawStyle, isItemGrayedOut, false, false)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
