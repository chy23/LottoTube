import React, { useEffect, useRef, useMemo } from 'react';
import Matter from 'matter-js';
import { renderItemStyle, getHash } from '../utils/styles';

export default function Bucket({
  items,
  drawState,
  targetBucketIndex,
  isRollingOut,
  tempWinner,
  drawStyle,
  isItemGrayedOut
}) {
  const isStickStyle = drawStyle === 'classic' || drawStyle === 'poem';

  // Refs for Sphere/Matter mode
  const sceneRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const itemsRef = useRef([]);
  const domRefs = useRef({});

  // Fixed logical size for Matter.js simulation (Non-stick styles)
  const sphereWidth = 240;
  const sphereHeight = 320;
  const wallThickness = 60;

  // Initialize Matter.js only when in ball/star/stone mode
  useEffect(() => {
    if (isStickStyle) return;

    const M = Matter.default || Matter;
    const engine = M.Engine.create({
      positionIterations: 6,
      velocityIterations: 4,
    });
    engine.world.gravity.y = 1.2;
    engineRef.current = engine;

    // Boundaries shaped to the capsule globe
    const floor = M.Bodies.rectangle(sphereWidth / 2, sphereHeight + wallThickness / 2 - 15, sphereWidth * 2, wallThickness, { isStatic: true, friction: 0.5, restitution: 0.3 });
    const leftWall = M.Bodies.rectangle(-wallThickness / 2 + 25, sphereHeight / 2, wallThickness, sphereHeight * 2, { isStatic: true, friction: 0.2 });
    const rightWall = M.Bodies.rectangle(sphereWidth + wallThickness / 2 - 25, sphereHeight / 2, wallThickness, sphereHeight * 2, { isStatic: true, friction: 0.2 });
    const ceiling = M.Bodies.rectangle(sphereWidth / 2, -wallThickness / 2 + 40, sphereWidth * 2, wallThickness, { isStatic: true, friction: 0.2, restitution: 0.3 });

    M.World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    const bodies = [];
    const maxItems = Math.min(items.length, 45);

    for (let i = 0; i < maxItems; i++) {
      const radius = 22;
      const x = sphereWidth / 2 + (Math.random() - 0.5) * 80;
      const y = 80 + (i % 6) * 35;

      const body = M.Bodies.circle(x, y, radius, {
        restitution: 0.5,
        friction: 0.15,
        frictionAir: 0.015,
        density: 0.005,
        render: { visible: false }
      });

      bodies.push({ id: i, body });
      M.World.add(engine.world, body);
    }

    itemsRef.current = bodies;

    const runner = M.Runner.create();
    M.Runner.run(runner, engine);
    runnerRef.current = runner;

    let animationFrame;
    const updateDOM = () => {
      if (itemsRef.current && sceneRef.current) {
        const bodiesList = itemsRef.current;
        for (let i = 0; i < bodiesList.length; i++) {
          const domElement = domRefs.current[i];
          if (!domElement) continue;

          const isTarget = i === targetBucketIndex;
          if (isTarget && isRollingOut) {
            domElement.style.opacity = '0';
            continue;
          }

          const { position, angle } = bodiesList[i].body;
          const clampedX = Math.max(25, Math.min(sphereWidth - 25, position.x));
          const clampedY = Math.max(50, Math.min(sphereHeight - 20, position.y));

          domElement.style.opacity = '1';
          domElement.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(0.65)`;
        }
      }
      animationFrame = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    return () => {
      cancelAnimationFrame(animationFrame);
      M.Runner.stop(runner);
      M.Engine.clear(engine);
    };
  }, [isStickStyle, items.length]);

  // Forces for Matter.js
  useEffect(() => {
    if (isStickStyle || !engineRef.current || !itemsRef.current) return;
    const M = Matter.default || Matter;
    const engine = engineRef.current;

    if (drawState === 'shaking') {
      itemsRef.current.forEach(({ body }) => {
        const forceX = (Math.random() - 0.5) * 0.05;
        const forceY = -(Math.random() * 0.07 + 0.02);
        M.Body.applyForce(body, body.position, { x: forceX, y: forceY });
      });
      engine.world.gravity.y = 0.5;
    } else if (drawState === 'reaching') {
      itemsRef.current.forEach(({ body }) => {
        const forceX = (Math.random() - 0.5) * 0.02;
        const forceY = -(Math.random() * 0.035);
        M.Body.applyForce(body, body.position, { x: forceX, y: forceY });
      });
      engine.world.gravity.y = 1.0;
    } else {
      engine.world.gravity.y = 1.2;
    }
  }, [isStickStyle, drawState]);

  // Deterministic stick layout calculation for authentic bamboo bundle
  const stickBundle = useMemo(() => {
    if (!isStickStyle) return [];
    const maxVisible = Math.min(items.length, 36);
    const visibleItems = items.slice(0, maxVisible);

    return visibleItems.map((item, idx) => {
      const hash = getHash(item);
      const ratio = maxVisible <= 1 ? 0.5 : idx / (maxVisible - 1);
      // Fan out across the mouth (-62px to +62px)
      const spreadX = (ratio - 0.5) * 124 + ((hash % 11) - 5) * 1.2;
      // Natural fan tilt: outer sticks lean outward up to 8.5 deg
      const baseTilt = (spreadX / 62) * 7.5;
      const tiltJitter = ((hash % 7) - 3) * 0.7;
      const tiltAngle = baseTilt + tiltJitter;
      // Staggered height
      const heightOffset = ((hash >> 2) % 18) - 9;
      // Layer depth
      const zIndex = 10 + (hash % 10);

      return {
        item,
        idx,
        spreadX,
        tiltAngle,
        heightOffset,
        zIndex,
        hash
      };
    });
  }, [isStickStyle, items]);

  // ==========================================
  // RENDER 1: Authentic Bamboo Tube (籤筒模式)
  // ==========================================
  if (isStickStyle) {
    return (
      <div className="relative w-[220px] sm:w-[240px] h-[340px] sm:h-[370px] flex flex-col items-center justify-end mx-auto select-none">
        {/* Soft Ground Contact Shadow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[190px] h-6 bg-black/30 dark:bg-black/60 blur-md rounded-full pointer-events-none z-0" />

        {/* Shaking & Tilting Container */}
        <div 
          className={`w-full h-full relative flex flex-col items-center justify-end transition-transform duration-500 origin-bottom ${
            drawState === 'shaking' ? 'animate-bamboo-tube-shake' : ''
          } ${
            drawState === 'reaching' ? 'rotate-12 translate-x-2 -translate-y-2' : ''
          }`}
        >
          {/* Top Cavity Dark Interior (Seen behind sticks) */}
          <div className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[194px] h-12 rounded-[50%] bg-[#2e1507] border-2 border-[#54280f] shadow-[inset_0_12px_22px_rgba(0,0,0,0.92)] z-0" />

          {/* Bamboo Sticks Bundle (z-10) */}
          <div className="absolute top-[48px] left-1/2 -translate-x-1/2 w-[194px] h-[220px] pointer-events-none z-10 flex items-start justify-center">
            {stickBundle.map(({ item, idx, spreadX, tiltAngle, heightOffset, zIndex, hash }) => {
              const isTarget = idx === targetBucketIndex;
              if (isTarget && isRollingOut) return null;

              // Shaking jitter class
              const jitterClass = drawState === 'shaking' 
                ? (idx % 3 === 0 ? 'animate-stick-jitter-1' : idx % 3 === 1 ? 'animate-stick-jitter-2' : 'animate-stick-jitter-3')
                : '';

              // When reaching, the target stick rises up excitedly
              const isRising = isTarget && drawState === 'reaching';
              const yTranslate = isRising ? -55 : heightOffset;
              const scale = isRising ? 1.08 : 1;
              const customZ = isRising ? 35 : zIndex;

              return (
                <div
                  key={`bamboo-stick-${idx}`}
                  className={`absolute origin-bottom transition-all duration-300 ${jitterClass}`}
                  style={{
                    left: `calc(50% + ${spreadX}px)`,
                    bottom: '10px',
                    transform: `translateX(-50%) translateY(${yTranslate}px) rotate(${tiltAngle}deg) scale(${scale})`,
                    zIndex: customZ,
                    animationDelay: `${(idx * 0.04) % 0.24}s`
                  }}
                >
                  {/* Single Authentic Bamboo Stick */}
                  <div className="relative w-[18px] h-[195px] flex flex-col items-center rounded-t-[4px] shadow-md border-x border-[#b58750]/50 overflow-hidden bg-gradient-to-r from-[#cfa169] via-[#faedcd] to-[#cfa169]">
                    {/* Auspicious Vermilion Red Tip (硃砂紅頂) */}
                    <div className="w-full h-[18px] bg-gradient-to-b from-[#dc2626] to-[#991b1b] border-b border-[#7f1d1d] shadow-sm flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-300/60 shadow-xs" />
                    </div>

                    {/* Subtle Bamboo Grain Lines */}
                    <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.15)_3px)] pointer-events-none" />

                    {/* Number / Name Inscription peek */}
                    <div className="mt-1 flex-1 flex items-start justify-center opacity-75">
                      <span 
                        className="text-[10px] font-bold text-[#5c2e0b] font-serif leading-none select-none tracking-tight pt-1" 
                        style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                      >
                        {item.length <= 4 ? item : item.slice(0, 3)}
                      </span>
                    </div>

                    {/* Glowing Aura if this is the chosen stick during reaching */}
                    {isRising && (
                      <div className="absolute inset-0 ring-2 ring-amber-400 bg-amber-300/25 animate-pulse rounded-t-[4px]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Front Tube Rim Lip (Front 3D half of ellipse, z-20) */}
          <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-[200px] h-7 rounded-b-[50%] bg-gradient-to-b from-[#874b20] to-[#5a2e14] border-t-2 border-[#d4af37]/80 shadow-md z-20 pointer-events-none" />

          {/* Tube Front Body (Covering the bottom 65% of sticks, z-20) */}
          <div className="absolute top-[78px] bottom-1 left-1/2 -translate-x-1/2 w-[200px] rounded-b-[2rem] bg-gradient-to-r from-[#5a2b0e] via-[#8c4b1f] via-[#c9803e] via-[#8c4b1f] to-[#5a2b0e] shadow-2xl overflow-hidden z-20 flex flex-col justify-between items-center pointer-events-none">
            {/* Glossy Bamboo Specular Highlights */}
            <div className="absolute left-4 top-0 w-6 h-full bg-gradient-to-r from-white/20 to-transparent skew-x-[-4deg] opacity-70 pointer-events-none" />
            <div className="absolute right-4 top-0 w-8 h-full bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

            {/* Top Metallic Brass Hoop (金色箍環) */}
            <div className="w-full h-3.5 mt-3 bg-gradient-to-r from-[#92400e] via-[#fde047] via-[#f59e0b] to-[#92400e] border-y border-[#78350f] shadow-md relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            </div>

            {/* Traditional Auspicious Medallion / Center Crest */}
            <div className="relative my-auto flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] border-2 border-[#fde047] shadow-lg flex items-center justify-center">
                <div className="w-11 h-11 rounded-full border border-[#fde047]/60 flex items-center justify-center bg-[#b91c1c]/40">
                  <span className="text-[#fef08a] font-serif font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    籤
                  </span>
                </div>
              </div>
              <div className="mt-1 px-3 py-0.5 rounded-full bg-black/40 border border-[#fde047]/30">
                <span className="text-[#fde047] text-[10px] font-bold tracking-widest uppercase">LottoTube</span>
              </div>
            </div>

            {/* Bottom Metallic Brass Hoop (金色箍環) */}
            <div className="w-full h-3.5 mb-3 bg-gradient-to-r from-[#92400e] via-[#fde047] via-[#f59e0b] to-[#92400e] border-y border-[#78350f] shadow-md relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>

          {/* Tube Base Ring / Foot Rim (z-25) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[202px] h-5 rounded-b-[2.2rem] bg-gradient-to-b from-[#5a2e14] to-[#2d1508] border-b border-black/40 shadow-xl z-25 pointer-events-none" />
        </div>

        {/* Selected Stick Zooming Out (isRollingOut) */}
        {isRollingOut && (tempWinner || items[targetBucketIndex]) && (
          <div className="absolute top-[40px] left-1/2 -translate-x-1/2 z-[60] pointer-events-none animate-stick-rise-and-present">
            <div className="drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]">
              {renderItemStyle(tempWinner || items[targetBucketIndex], drawStyle, isItemGrayedOut, false, false, true)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER 2: Capsule Lottery Tumbler (抽獎扭蛋箱模式)
  // For 'ball', 'star', 'stone', 'paper', 'glass'
  // ==========================================
  return (
    <div className="relative w-[240px] sm:w-[260px] h-[340px] sm:h-[370px] flex flex-col items-center justify-end mx-auto select-none">
      {/* Ground Shadow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[200px] h-6 bg-black/30 dark:bg-black/60 blur-md rounded-full pointer-events-none z-0" />

      {/* Container visual layer */}
      <div 
        ref={sceneRef}
        className={`w-full h-full relative flex flex-col items-center justify-end transition-transform duration-500 origin-bottom ${
          drawState === 'shaking' ? 'animate-bucket-shake-hard' : ''
        } ${drawState === 'reaching' ? 'rotate-[75deg] translate-x-[-10px] scale-90' : ''}`}
        style={{ willChange: 'transform' }}
      >
        {/* Back Acrylic Globe Interior */}
        <div className="absolute left-[15px] right-[15px] top-6 bottom-4 rounded-t-[5rem] rounded-b-[2.5rem] bg-gradient-to-b from-white/40 via-white/10 to-white/30 dark:from-slate-700/60 dark:via-slate-800/40 dark:to-slate-900/70 border-2 border-white/70 dark:border-slate-500/40 shadow-xl overflow-hidden z-0" />

        {/* Physics Items Container */}
        <div 
          ref={containerRef} 
          className="absolute left-[18px] right-[18px] top-8 bottom-6 rounded-t-[4.5rem] rounded-b-[2rem] z-10 overflow-hidden pointer-events-none"
        >
          {items.slice(0, 45).map((item, idx) => {
            const isTarget = idx === targetBucketIndex;
            if (isTarget && isRollingOut) return null;

            return (
              <div 
                key={`capsule-item-${idx}`} 
                ref={el => { if (el) domRefs.current[idx] = el; }}
                className="absolute transition-none z-10"
                style={{ left: 0, top: 0, willChange: 'transform' }}
              >
                {renderItemStyle(item, drawStyle, isItemGrayedOut, false, true)}
              </div>
            );
          })}
        </div>

        {/* Front Frosted Glass Specular Overlay (z-20) */}
        <div className="absolute left-[15px] right-[15px] top-6 bottom-4 rounded-t-[5rem] rounded-b-[2.5rem] bg-gradient-to-tr from-white/20 via-transparent to-white/30 dark:from-white/10 dark:via-transparent dark:to-white/10 border border-white/50 dark:border-slate-600/40 pointer-events-none z-20 overflow-hidden">
          <div className="absolute top-2 left-6 w-20 h-10 bg-white/40 rounded-full blur-[2px] rotate-[-20deg]" />
          <div className="absolute bottom-6 right-6 w-16 h-8 bg-white/20 rounded-full blur-[2px]" />
        </div>

        {/* Chrome / Brass Top Lid (z-25) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[120px] h-8 rounded-full bg-gradient-to-b from-slate-200 via-slate-100 to-slate-400 dark:from-slate-600 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-500 shadow-md flex items-center justify-center z-25 pointer-events-none">
          <div className="w-6 h-3 rounded-full bg-gradient-to-b from-slate-400 to-slate-600 shadow-inner" />
        </div>

        {/* Machine Base Stand (z-25) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[210px] h-8 rounded-b-2xl rounded-t-lg bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 dark:from-slate-700 dark:to-slate-900 border-2 border-slate-400 dark:border-slate-600 shadow-xl z-25 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-2.5 rounded-full bg-black/40 shadow-inner" />
        </div>
      </div>

      {/* Winning Item Roll Out Layer (z-50) */}
      {isRollingOut && (tempWinner || items[targetBucketIndex]) && (
        <div className="absolute z-[50] pointer-events-none animate-roll-out-to-corner">
          <div className="drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]">
            {renderItemStyle(tempWinner || items[targetBucketIndex], drawStyle, isItemGrayedOut, false, false, true)}
          </div>
        </div>
      )}
    </div>
  );
}
