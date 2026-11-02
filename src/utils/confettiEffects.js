import confetti from 'canvas-confetti';

/**
 * 建立專屬特效 Shape (金幣、彩色星星)
 */
const createShapes = () => {
  try {
    const coin = confetti.shapeFromText ? confetti.shapeFromText({ text: '🪙', scalar: 3.2 }) : 'circle';
    const star = confetti.shapeFromText ? confetti.shapeFromText({ text: '⭐', scalar: 2.6 }) : 'star';
    const sparkle = confetti.shapeFromText ? confetti.shapeFromText({ text: '✨', scalar: 2.4 }) : 'circle';
    return { coin, star, sparkle };
  } catch (e) {
    return { coin: 'circle', star: 'star', sparkle: 'circle' };
  }
};

/**
 * 1. 璀璨大金幣噴發 (Gold Coins Shower)
 */
export const triggerCoinsShower = () => {
  const { coin } = createShapes();
  const duration = 2500;
  const animationEnd = Date.now() + duration;

  // 中央下方強力噴發金幣
  confetti({
    particleCount: 40,
    angle: 90,
    spread: 60,
    origin: { x: 0.5, y: 0.85 },
    shapes: [coin],
    scalar: 3.2,
    gravity: 0.8,
    drift: 0,
    ticks: 200,
    colors: ['#FFD700', '#FFA500', '#FF8C00']
  });

  // 搭配金色與亮黃閃光粒子
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    confetti({
      particleCount: 15,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.8 },
      colors: ['#FFE066', '#FFD43B', '#FAB005', '#F59F00'],
      shapes: [coin, 'circle'],
      scalar: 2.2,
      gravity: 0.9
    });
    confetti({
      particleCount: 15,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.8 },
      colors: ['#FFE066', '#FFD43B', '#FAB005', '#F59F00'],
      shapes: [coin, 'circle'],
      scalar: 2.2,
      gravity: 0.9
    });
  }, 350);
};

/**
 * 2. 彩色星星雨 (Rainbow Stars Blast)
 */
export const triggerStarsBlast = () => {
  const { star, sparkle } = createShapes();

  // 中央向四周爆發彩虹星星
  confetti({
    particleCount: 60,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    shapes: [star, sparkle],
    scalar: 2.8,
    ticks: 250,
    gravity: 0.65,
    colors: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE']
  });

  // 雙側向上拋射星星流星雨
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 80,
      origin: { x: 0.2, y: 0.7 },
      shapes: [star],
      scalar: 2.4,
      colors: ['#FFD700', '#FF69B4', '#00F0FF', '#7000FF']
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 80,
      origin: { x: 0.8, y: 0.7 },
      shapes: [star],
      scalar: 2.4,
      colors: ['#FFD700', '#FF69B4', '#00F0FF', '#7000FF']
    });
  }, 200);
};

/**
 * 3. 慶典狂歡雙向彩帶加農砲 (Festive Ribbons Cannon)
 */
export const triggerRibbonsShower = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#007AFF', '#34C759', '#FF2D55', '#5856D6', '#FF9500', '#FFCC00']
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#007AFF', '#34C759', '#FF2D55', '#5856D6', '#FF9500', '#FFCC00']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

/**
 * 4. 大滿貫豪華大慶祝 (Jackpot: 金幣 + 星星 + 彩帶三重奏)
 */
export const triggerJackpotCelebration = () => {
  const { coin, star, sparkle } = createShapes();

  // 第一波：中央金幣與星星同時大噴發
  confetti({
    particleCount: 50,
    spread: 100,
    origin: { x: 0.5, y: 0.6 },
    shapes: [coin, star, sparkle],
    scalar: 2.8,
    ticks: 220,
    colors: ['#FFD700', '#FF9500', '#FF2D55', '#34C759', '#007AFF']
  });

  // 第二波：兩側彩帶加農砲
  setTimeout(() => {
    triggerRibbonsShower();
  }, 150);

  // 第三波：金幣由底部再噴出一波
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.9 },
      shapes: [coin],
      scalar: 3.0,
      ticks: 180,
      colors: ['#FFD700', '#FFA500']
    });
  }, 500);
};

/**
 * 隨機呼叫一種答對 (Bingo) 慶祝動畫
 */
export const triggerBingoCelebration = () => {
  const effects = [
    triggerCoinsShower,        // 大金幣雨
    triggerStarsBlast,         // 彩色星星雨
    triggerRibbonsShower,      // 慶典彩帶
    triggerJackpotCelebration  // 大滿貫全開
  ];
  const chosen = effects[Math.floor(Math.random() * effects.length)];
  chosen();
};
