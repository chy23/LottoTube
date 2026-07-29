export function generateBucketLayouts(itemsLength) {
  const layouts = [];
  let seed = 12345; 
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  let N = Math.min(80, Math.max(1, itemsLength));
  
  // Flatten the curve by increasing sigma
  let sigma = Math.max(2.5, N / 6); 
  // Span across the entire bottom (max 7 columns on each side for 15 columns total)
  let maxCols = Math.min(7, Math.ceil(N / 2)); 
  
  let P = [];
  let sumP = 0;
  for (let c = -maxCols; c <= maxCols; c++) {
    let val = Math.exp(-(c * c) / (2 * sigma * sigma));
    P.push(val);
    sumP += val;
  }
  
  let counts = P.map(p => Math.floor((p / sumP) * N));
  let currentTotal = counts.reduce((a, b) => a + b, 0);
  
  let remainder = N - currentTotal;
  let offset = 0;
  while (remainder > 0) {
    if (maxCols + offset < counts.length) {
      counts[maxCols + offset]++;
      remainder--;
    }
    if (remainder > 0 && offset > 0 && maxCols - offset >= 0) {
      counts[maxCols - offset]++;
      remainder--;
    }
    offset++;
  }

  for (let c = -maxCols; c <= maxCols; c++) {
     let count = counts[c + maxCols];
     for (let r = 0; r < count; r++) {
        let xOffset = (r % 2 === 1) ? 2.5 : 0; 
        let bestX = 50 + c * 5.2 + xOffset;
        bestX = Math.max(15, Math.min(85, bestX));
        let bestY = 2 + r * 9.5;
        const rot = (rand() - 0.5) * 160;

        layouts.push({
          x: bestX,
          y: bestY,
          left: `${bestX}%`,
          bottom: `${bestY}%`,
          transform: `rotate(${rot}deg) scale(0.65)`,
          zIndex: Math.floor(40 - bestY / 2.5), 
          delay: `${(r * 0.05 + Math.abs(c) * 0.02)}s`,
          shakeClass: `animate-bounce-wild-${Math.floor(rand() * 5) + 1}`,
          shakeDuration: `${0.45 + rand() * 0.35}s`,
          shakeDelay: `-${rand() * 2}s`
        });
     }
  }

  const shuffled = [...layouts];
  for (let j = shuffled.length - 1; j > 0; j--) {
    const k = Math.floor(rand() * (j + 1));
    [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
  }
  
  while(shuffled.length < 80) {
    shuffled.push({ 
      left: '50%', bottom: '2%', zIndex: 0, transform: '', delay: '0s', 
      shakeClass: 'animate-bounce-wild-1', shakeDuration: '0.5s', shakeDelay: '0s' 
    });
  }

  return shuffled;
}
