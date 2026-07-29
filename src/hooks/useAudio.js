import { useRef, useState, useCallback, useEffect } from 'react';

export function useAudio() {
  const audioCtxRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [soundMode, setSoundMode] = useState('classic');

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playHardShakeSound = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    for (let i = 0; i < 12; i++) {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = soundMode === 'retro' ? 'square' : soundMode === 'arcade' ? 'sawtooth' : 'triangle';
      const baseFreq = soundMode === 'arcade' ? 250 : 150;
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 200, now + i * 0.1);
      gain.gain.setValueAtTime(0.08, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.1);
      osc.connect(gain); gain.connect(audioCtxRef.current.destination);
      osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.1);
    }
  }, [isMuted, soundMode]);

  const playHandStirSound = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = soundMode === 'retro' ? 'square' : 'sine';
      const baseFreq = soundMode === 'arcade' ? 200 : 100;
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 80, now + i * 0.2);
      gain.gain.setValueAtTime(0.05, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.2);
      osc.connect(gain); gain.connect(audioCtxRef.current.destination);
      osc.start(now + i * 0.2); osc.stop(now + i * 0.2 + 0.2);
    }
  }, [isMuted, soundMode]);

  const playPopSound = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = soundMode === 'retro' ? 'square' : soundMode === 'arcade' ? 'triangle' : 'sine';
    const baseFreq = soundMode === 'arcade' ? 800 : soundMode === 'retro' ? 400 : 600;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain); gain.connect(audioCtxRef.current.destination);
    osc.start(); osc.stop(now + 0.4);
  }, [isMuted, soundMode]);

  const playVipFanfare = useCallback(() => {
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
  }, [isMuted]);

  const playActionO = useCallback(() => {
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
  }, [isMuted]);

  const playActionX = useCallback(() => {
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
  }, [isMuted]);

  const playActionSkip = useCallback(() => {
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
  }, [isMuted]);

  return {
    isMuted,
    setIsMuted,
    soundMode,
    setSoundMode,
    initAudio,
    playHardShakeSound,
    playHandStirSound,
    playPopSound,
    playVipFanfare,
    playActionO,
    playActionX,
    playActionSkip
  };
}
