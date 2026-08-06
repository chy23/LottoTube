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
  drawStyle,
  isItemGrayedOut
}) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const itemsRef = useRef([]);

  // Fixed logical size for physics simulation
  const width = 400;
  const height = 500;
  const wallThickness = 60;
  
  useEffect(() => {
    // Handle potential Vite CJS/ESM interop issues
    const M = Matter.default || Matter;
    
    // Initialize Matter.js Engine
    const engine = M.Engine.create({
      positionIterations: 6,
      velocityIterations: 4,
    });
    engine.world.gravity.y = 1.2;
    engineRef.current = engine;

    // Create boundaries
    const floor = M.Bodies.rectangle(width / 2, height + wallThickness / 2 - 20, width, wallThickness, { isStatic: true, friction: 0.5, restitution: 0.2 });
    const leftWall = M.Bodies.rectangle(-wallThickness / 2 + 30, height / 2, wallThickness, height * 2, { isStatic: true, friction: 0.1 });
    const rightWall = M.Bodies.rectangle(width + wallThickness / 2 - 30, height / 2, wallThickness, height * 2, { isStatic: true, friction: 0.1 });
    
    M.World.add(engine.world, [floor, leftWall, rightWall]);

    // Create bodies for items
    const bodies = [];
    const maxItems = Math.min(items.length, 80);
    
    for (let i = 0; i < maxItems; i++) {
      const radius = 30; // approximate radius of item
      const x = width / 2 + (Math.random() - 0.5) * 100;
      const y = -100 - i * 20; // drop from top
      
      const body = M.Bodies.circle(x, y, radius, {
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.005,
        render: { visible: false } // We render via React DOM
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

    // Sync bodies to DOM
    let animationFrame;
    const updateDOM = () => {
      if (itemsRef.current && sceneRef.current) {
        itemsRef.current.forEach((itemObj, i) => {
          const domElement = document.getElementById(`physics-item-${i}`);
          if (domElement) {
            const { position, angle } = itemObj.body;
            // Map coordinates from generic 400x500 to percentages
            const leftPct = (position.x / width) * 100;
            const topPct = (position.y / height) * 100;
            
            // Note: If an item is the target and rolling out, we apply different animation via classes, but physics still runs.
            const isTarget = i === targetBucketIndex;
            if (isTarget && isRollingOut) {
              return; // Let CSS handle the roll out, stop syncing with physics
            }
            
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
  }, [items.length]); // Re-init if total items change (simplification)

  // Apply forces based on drawState
  useEffect(() => {
    if (!engineRef.current || !itemsRef.current) return;
    const M = Matter.default || Matter;
    const engine = engineRef.current;
    
    if (drawState === 'shaking') {
      // Apply random forces to all bodies
      itemsRef.current.forEach(({ body }) => {
        const forceMagnitude = 0.04 * body.mass;
        M.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * forceMagnitude,
          y: -Math.random() * forceMagnitude * 1.5
        });
      });
    } else if (drawState === 'reaching') {
      // Pop out ONLY the target item!
      // Keep gravity normal so other items stay in bucket
      engine.world.gravity.y = 1.2;
      
      const targetObj = itemsRef.current[targetBucketIndex];
      if (targetObj) {
        const { body } = targetObj;
        // Apply a strong upward force to the target item so it flies out
        M.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.05,
          y: -0.15 * body.mass
        });
      }
    } else {
      // Normal gravity
      engine.world.gravity.y = 1.2;
    }
  }, [drawState]);

  return (
    <div className="relative w-[90vw] md:w-[70vw] lg:w-[40vw] max-w-[500px] aspect-[4/5] md:aspect-[3/4] mt-10 flex flex-col items-center justify-end">
      
      {/* Container visual layer */}
      <div 
        ref={sceneRef}
        className={`w-full h-full relative origin-center transition-transform duration-1000 ${drawState === 'reaching' ? 'rotate-[120deg]' : ''} ${drawState === 'shaking' ? 'animate-bucket-shake-hard' : ''}`}
      >
        <div className="absolute left-[40px] right-[40px] inset-y-0 bg-slate-400/20 rounded-b-[4rem] rounded-t-2xl border border-white/40 transform scale-x-95 translate-y-4 z-0"></div>
        
        <div className="absolute left-[45px] right-[45px] bottom-6 top-6 rounded-b-[3.5rem] rounded-t-xl z-10 overflow-hidden">
           {items.slice(0, 80).map((item, idx) => {
             const isTarget = idx === targetBucketIndex;

             return (
               <div 
                 key={`bucket-item-${idx}`} 
                 id={`physics-item-${idx}`}
                 className={`absolute transition-none ${isTarget && isRollingOut ? 'animate-roll-out-winner z-[200]' : 'z-10'}`}
                 style={{ 
                   left: '50%', top: '-20%', // Initial off-screen position
                 }}
               >
                 {renderItemStyle(item, drawStyle, isItemGrayedOut, false)}
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
