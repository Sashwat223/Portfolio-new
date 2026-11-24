import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GazeManifest {
  frameWidth: number;
  frameHeight: number;
  cols: number;
  totalFrames: number;
}

function mapCoordinatesToGaze360(sx: number, sy: number) {
  const radius = Math.hypot(sx, sy);
  const centerBlend = Math.max(0, Math.min(1, (radius - 0.06) / 0.30));

  let theta = Math.atan2(sy, sx);
  if (theta < -Math.PI / 2) {
    theta += Math.PI * 2;
  }

  if (theta > (5 * Math.PI) / 4) {
    const t = (theta - (5 * Math.PI) / 4) / (Math.PI / 4);
    return { centerBlend, ringA: 18, ringB: 102, ringFrac: t };
  }

  const ringFloat = 78 - (theta / (Math.PI / 4)) * 12;
  const clamped = Math.max(18, Math.min(102, ringFloat));
  const ringA = Math.floor(clamped);
  const ringB = Math.min(102, ringA + 1);
  return { centerBlend, ringA, ringB, ringFrac: clamped - ringA };
}

interface HeroAnimProps {
  onEnterJourney: () => void;
  journeyUnlocked: boolean;
}

export const HeroAnim: React.FC<HeroAnimProps> = ({ onEnterJourney, journeyUnlocked }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  const targetCoordRef = useRef({ x: 0, y: 0 });
  const smoothCoordRef = useRef({ x: 0, y: 0 });
  const lastInteractionRef = useRef<number>(Date.now());

  const [isLoaded, setIsLoaded] = useState(false);
  const [lookSide, setLookSide] = useState<'center' | 'left' | 'right'>('center');

  useEffect(() => {
    if (shouldReduceMotion) return;

    const updateFromClientPoint = (clientX: number, clientY: number) => {
      const stage = stageRef.current || containerRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height * 0.36;
      const spanX = Math.max(200, window.innerWidth * 0.28);
      const spanY = Math.max(170, window.innerHeight * 0.28);

      const nx = (clientX - eyeX) / spanX;
      const ny = (clientY - eyeY) / spanY;

      targetCoordRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
      lastInteractionRef.current = Date.now();
    };

    const onMouseMove = (e: MouseEvent) => updateFromClientPoint(e.clientX, e.clientY);
    const onMouseLeave = () => {
      targetCoordRef.current = { x: 0, y: 0 };
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) updateFromClientPoint(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateFromClientPoint(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => {
      lastInteractionRef.current = Date.now() - 1800;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    const container = containerRef.current;
    container?.addEventListener('touchstart', onTouchStart, { passive: true });
    container?.addEventListener('touchmove', onTouchMove, { passive: true });
    container?.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      container?.removeEventListener('touchstart', onTouchStart);
      container?.removeEventListener('touchmove', onTouchMove);
      container?.removeEventListener('touchend', onTouchEnd);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let lastSide: 'center' | 'left' | 'right' = 'center';

    const loadAssets = async () => {
      const [manifest, img] = await Promise.all([
        fetch('/assets/character/gaze360_manifest.json').then((r) => r.json() as Promise<GazeManifest>),
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = '/assets/character/gaze360_atlas.webp';
        }),
      ]);

      if (cancelled) return;
      setIsLoaded(true);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { frameWidth: fw, frameHeight: fh, cols } = manifest;
      canvas.width = fw;
      canvas.height = fh;

      const drawFrame = (frameIndex: number, alpha: number) => {
        if (alpha <= 0.01) return;
        const col = frameIndex % cols;
        const row = Math.floor(frameIndex / cols);
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, col * fw, row * fh, fw, fh, 0, 0, fw, fh);
      };

      const CENTER_FRAME = 4;

      const tick = () => {
        if (cancelled) return;

        if (!shouldReduceMotion) {
          if (Date.now() - lastInteractionRef.current > 2800) {
            targetCoordRef.current = { x: 0, y: 0 };
          }
          const lerp = 0.22;
          smoothCoordRef.current.x += (targetCoordRef.current.x - smoothCoordRef.current.x) * lerp;
          smoothCoordRef.current.y += (targetCoordRef.current.y - smoothCoordRef.current.y) * lerp;
        }

        const sx = smoothCoordRef.current.x;
        const sy = smoothCoordRef.current.y;

        const nextSide: 'center' | 'left' | 'right' =
          sx < -0.14 ? 'left' : sx > 0.14 ? 'right' : 'center';
        if (nextSide !== lastSide) {
          lastSide = nextSide;
          setLookSide(nextSide);
        }

        if (stageRef.current && !shouldReduceMotion) {
          const rotY = sx * 4.5;
          const rotX = -sy * 3.5;
          const tx = sx * 6;
          const ty = sy * 5;
          stageRef.current.style.transform = `perspective(1200px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }

        const { centerBlend, ringA, ringB, ringFrac } = mapCoordinatesToGaze360(sx, sy);

        ctx.clearRect(0, 0, fw, fh);
        if (centerBlend < 0.99) {
          drawFrame(CENTER_FRAME, 1 - centerBlend);
        }
        if (centerBlend > 0.01) {
          drawFrame(ringA, centerBlend * (1 - ringFrac));
          if (ringB !== ringA) {
            drawFrame(ringB, centerBlend * ringFrac);
          }
        }
        ctx.globalAlpha = 1;

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    loadAssets().catch((err) => console.error('HeroAnim 360 atlas load error:', err));

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  const blueActiveGradient: React.CSSProperties = {
    backgroundImage: 'linear-gradient(125deg, #EFECE3 0%, #8EE0F7 48%, #2E95BA 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 28px rgba(126, 196, 216, 0.45))',
    transform: 'scale(1.03)',
  };

  return (
    <section
      id="introduction"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden teal-studio-stage pt-10 pb-10 px-4 sm:px-8 md:px-12 lg:px-16 select-none"
    >
      <video src="/assets/character/character.mp4" className="hidden" muted playsInline preload="none" />

      {/* Diagonal volumetric studio light beam */}
      <div className="pointer-events-none absolute inset-0 teal-beam-overlay" />

      {/* Centerpiece: 3-column flex layout so PORT, Character, and FOLIO NEVER overlap */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-4">
        <div className="w-full max-w-7xl flex items-center justify-center gap-2 sm:gap-5 md:gap-8 lg:gap-10">
          {/* PORT (Left column) */}
          <span
            className="font-condensed font-bold uppercase tracking-[0.02em] text-[10.5vw] sm:text-[95px] md:text-[135px] lg:text-[175px] leading-[1.08] py-3 transition-all duration-300 ease-out shrink-0 hover-blue-gradient cursor-default"
            style={
              lookSide === 'left'
                ? blueActiveGradient
                : {
                    color: lookSide === 'right' ? 'rgba(239, 236, 227, 0.65)' : 'rgba(239, 236, 227, 0.93)',
                    filter: 'drop-shadow(0 14px 38px rgba(0,0,0,0.45))',
                  }
            }
          >
            PORT
          </span>

          {/* Seamless Vignetted Character Canvas (Center column) */}
          <div
            ref={stageRef}
            className="relative z-20 w-[160px] sm:w-[270px] md:w-[330px] lg:w-[370px] aspect-square flex items-center justify-center will-change-transform shrink-0"
          >
            <canvas
              ref={canvasRef}
              aria-label="Interactive 3D character following visitor cursor"
              className={`w-full h-full object-contain hero-char-vignette transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* FOLIO (Right column) */}
          <span
            className="font-condensed font-bold uppercase tracking-[0.02em] text-[10.5vw] sm:text-[95px] md:text-[135px] lg:text-[175px] leading-[1.08] py-3 transition-all duration-300 ease-out shrink-0 hover-blue-gradient cursor-default"
            style={
              lookSide === 'right'
                ? blueActiveGradient
                : {
                    color: lookSide === 'left' ? 'rgba(239, 236, 227, 0.65)' : 'rgba(239, 236, 227, 0.93)',
                    filter: 'drop-shadow(0 14px 38px rgba(0,0,0,0.45))',
                  }
            }
          >
            FOLIO
          </span>
        </div>

        {/* Name & Statement */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative z-30 text-center mt-4 sm:mt-6 max-w-3xl"
        >
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] text-[#EFECE3] hover-blue-gradient cursor-default">
            SASHWAT DHAKAL
          </h1>
          <p className="mt-3 font-editorial italic text-xl sm:text-2xl md:text-[1.75rem] text-[#7EC4D8] tracking-wide hover-blue-gradient cursor-default">
            “Building at the intersection of finance, technology, data and creativity.”
          </p>
        </motion.div>
      </div>

      {/* "My Journey" Gradient Gate Button */}
      <div className="relative z-20 flex items-center justify-center pt-4">
        <button
          type="button"
          onClick={onEnterJourney}
          className="group relative inline-flex items-center gap-3 rounded-full px-8 py-3.5 font-mono-tech text-xs font-semibold tracking-[0.22em] uppercase text-[#071922] shadow-[0_12px_35px_rgba(46,149,186,0.35)] hover:shadow-[0_16px_45px_rgba(142,224,247,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          style={{
            background: 'linear-gradient(125deg, #EFECE3 0%, #8EE0F7 48%, #2E95BA 100%)',
          }}
        >
          <span>{journeyUnlocked ? 'Explore Journey' : 'My Journey'}</span>
          <span className="inline-block w-5 h-[1.5px] bg-[#071922] group-hover:w-8 transition-all duration-300" />
        </button>
      </div>
    </section>
  );
};
