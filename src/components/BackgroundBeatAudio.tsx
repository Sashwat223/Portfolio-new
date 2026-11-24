import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MUSIC_TRACKS } from '../data/portfolioData';
import { Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

/**
 * Ambient background music (starting with Lukas Graham - 7 Years) +
 * creative multi-layer bluish-cyan Web Audio API beat visualizer.
 * Keeps native <audio> output active until AudioContext is running so
 * a suspended AudioContext never silences playback.
 */
export const BackgroundBeatAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [beatEnergy, setBeatEnergy] = useState(0);
  const unlockedRef = useRef(false);

  const track = MUSIC_TRACKS[trackIdx];

  const attachAnalyser = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        const source = ctx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      } else if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
    } catch {
      // If AudioContext cannot resume yet, native <audio> continues playing normally
    }
  }, []);

  // Attempt immediate unmuted autoplay on mount and on canplay; if browser policy blocks it,
  // unlock cleanly on the very first user gesture.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncState = () => {
      setIsPlaying(!audio.paused);
    };
    audio.addEventListener('play', syncState);
    audio.addEventListener('pause', syncState);

    const tryAutoplay = () => {
      if (unlockedRef.current || !audio.paused) return;
      audio.muted = false;
      audio.volume = 0.16;
      audio
        .play()
        .then(() => {
          unlockedRef.current = true;
          setIsPlaying(true);
          setIsMuted(false);
          setNeedsGesture(false);
          attachAnalyser();
        })
        .catch(() => {
          setNeedsGesture(true);
          audio.muted = true;
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        });
    };

    tryAutoplay();
    audio.addEventListener('canplay', tryAutoplay, { once: true });

    const unlockOnGesture = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      setNeedsGesture(false);
      audio.muted = false;
      audio.volume = 0.16;
      setIsMuted(false);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          attachAnalyser();
        })
        .catch(() => {});
    };

    window.addEventListener('pointerdown', unlockOnGesture, { once: true, passive: true });
    window.addEventListener('mousedown', unlockOnGesture, { once: true, passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { once: true, passive: true });
    window.addEventListener('keydown', unlockOnGesture, { once: true });

    return () => {
      audio.removeEventListener('play', syncState);
      audio.removeEventListener('pause', syncState);
      audio.removeEventListener('canplay', tryAutoplay);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('mousedown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };
  }, [attachAnalyser]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    audio.volume = isMuted ? 0 : 0.16;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      setTrackIdx((i) => (i + 1) % MUSIC_TRACKS.length);
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, []);

  const prevTrackIdxRef = useRef(trackIdx);

  useEffect(() => {
    if (prevTrackIdxRef.current === trackIdx) return;
    prevTrackIdxRef.current = trackIdx;
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [trackIdx, isPlaying]);

  // Creative bluish-cyan background beat visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const freqData = new Uint8Array(64);
    const peaks = new Float32Array(76);
    let lastEnergyUpdate = 0;

    const isMobile = (window.innerWidth || 1200) < 640;
    const particles: Particle[] = Array.from({ length: isMobile ? 16 : 34 }, () => ({
      x: Math.random() * (window.innerWidth || 1200),
      y: Math.random() * 240,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.2 + Math.random() * 0.55),
      r: 1.2 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.45,
    }));

    const render = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = 240;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      ctx.clearRect(0, 0, w, h);

      let bassSum = 0;
      if (analyserRef.current && isPlaying && !isMuted) {
        analyserRef.current.getByteFrequencyData(freqData);
        for (let i = 0; i < 8; i++) bassSum += freqData[i];
      } else {
        const t = now * 0.0022;
        for (let i = 0; i < 64; i++) {
          freqData[i] = Math.round(16 + Math.sin(t + i * 0.28) * 11 + Math.cos(t * 0.7 + i * 0.15) * 6);
        }
        bassSum = 125;
      }

      const avgBass = bassSum / (8 * 255);
      if (now - lastEnergyUpdate > 65) {
        lastEnergyUpdate = now;
        setBeatEnergy(avgBass);
      }

      // Floating oceanic light motes
      const speedBoost = 1 + avgBass * 3.2;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy * speedBoost;
        if (p.y < -10) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + avgBass * 0.7), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 224, 245, ${Math.min(0.85, p.alpha + avgBass * 0.35)})`;
        ctx.fill();
      }

      // Dual glowing harmonic cyan-sapphire wave ribbons
      const drawRibbon = (c1: string, c2: string, ampScale: number, phase: number, lw: number) => {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, 'rgba(56, 163, 199, 0)');
        grad.addColorStop(0.25, c1);
        grad.addColorStop(0.5, c2);
        grad.addColorStop(0.75, c1);
        grad.addColorStop(1, 'rgba(126, 196, 216, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.shadowColor = 'rgba(126, 196, 216, 0.75)';
        ctx.shadowBlur = 18;
        ctx.beginPath();

        const points = 56;
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * w;
          const idx = Math.min(47, Math.floor((i / points) * 40));
          const energy = freqData[idx] / 255;
          const wave = Math.sin(now * 0.0026 + i * 0.32 + phase) * (10 + energy * 48 * ampScale);
          const y = h - 42 - energy * 76 * ampScale + wave * 0.35;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };

      drawRibbon('rgba(126, 196, 216, 0.65)', 'rgba(191, 233, 245, 0.85)', 1.0, 0, 2.2);
      drawRibbon('rgba(56, 163, 199, 0.42)', 'rgba(126, 196, 216, 0.55)', 0.72, 1.9, 1.4);

      // Mirrored cyan-ice spectrum pillars
      const barCount = Math.min(76, Math.max(36, Math.floor(w / 18)));
      const gap = w / barCount;
      const barWidth = Math.max(2, gap * 0.36);

      for (let i = 0; i < barCount; i++) {
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const binIndex = Math.min(44, Math.floor(distFromCenter * 38));
        const bin = freqData[binIndex] / 255;
        const barH = Math.max(4, bin * 112);

        if (barH > peaks[i]) peaks[i] = barH;
        else peaks[i] = Math.max(4, peaks[i] - 1.15);

        const x = i * gap + (gap - barWidth) / 2;
        const y = h - barH;

        const barGrad = ctx.createLinearGradient(0, y, 0, h);
        barGrad.addColorStop(0, 'rgba(165, 228, 247, 0.58)');
        barGrad.addColorStop(0.55, 'rgba(56, 163, 199, 0.25)');
        barGrad.addColorStop(1, 'rgba(7, 23, 31, 0.02)');

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(210, 242, 252, 0.65)';
        ctx.fillRect(x, h - peaks[i] - 3, barWidth, 1.8);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    unlockedRef.current = true;
    setNeedsGesture(false);

    if (isPlaying && !isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 0.16;
      setIsMuted(false);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          attachAnalyser();
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="auto" autoPlay />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-200"
        style={{
          opacity: isPlaying ? 0.30 + beatEnergy * 0.65 : 0.16,
          background:
            'radial-gradient(ellipse 85% 52% at 50% 96%, rgba(86, 188, 222, 0.26) 0%, rgba(30, 111, 142, 0.12) 42%, transparent 72%)',
        }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-10 w-full h-[240px] opacity-90"
      />

      <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-40 rounded-full border border-[#7EC4D8]/30 bg-[#071922]/85 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 sm:gap-3 shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying && !isMuted ? 'Pause background music' : 'Play background music'}
          className="w-8 h-8 rounded-full bg-[#EFECE3] text-[#071922] hover:bg-[#7EC4D8] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          {isPlaying && !isMuted ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
        </button>

        <div className="pr-1 max-w-[175px] truncate">
          <div className="text-[11px] font-medium text-[#EFECE3] truncate">{track.title}</div>
          <div className="font-mono-tech text-[9px] uppercase tracking-[0.14em] text-[#7EC4D8] truncate">
            {needsGesture ? 'CLICK ANYWHERE FOR SOUND' : isPlaying ? 'PLAYING' : 'PAUSED'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            unlockedRef.current = true;
            setNeedsGesture(false);
            setIsMuted(false);
            setTrackIdx((i) => (i + 1) % MUSIC_TRACKS.length);
            setIsPlaying(true);
          }}
          aria-label="Next track"
          className="text-[#98B2BD] hover:text-[#EFECE3] transition-colors cursor-pointer"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            unlockedRef.current = true;
            setNeedsGesture(false);
            setIsMuted((m) => !m);
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="text-[#98B2BD] hover:text-[#EFECE3] transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );
};
