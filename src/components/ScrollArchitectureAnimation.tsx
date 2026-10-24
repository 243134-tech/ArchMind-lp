import React, { useRef, useEffect, useCallback } from 'react';

const TOTAL_FRAMES = 300;
const MAX_CONCURRENT_LOADS = 12;
const LERP_FACTOR = 0.1;

interface ScrollArchitectureAnimationProps {
  className?: string;
  isSticky?: boolean;
}

export const ScrollArchitectureAnimation: React.FC<ScrollArchitectureAnimationProps> = ({
  className = '',
  isSticky = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadStatusRef = useRef<number[]>(new Array(TOTAL_FRAMES).fill(0));
  const activeLoadsRef = useRef<number>(0);
  const useFallbackPngRef = useRef<boolean>(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const getFramePath = useCallback((index: number, fallback = false): string => {
    const num = String(index + 1).padStart(4, '0');
    if (fallback || useFallbackPngRef.current) {
      return `/archmind_video_frames/frame_${num}.png`;
    }
    return `/frames/frame_${num}.webp`;
  }, []);

  const drawImageCover = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, cW: number, cH: number) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const iW = img.naturalWidth;
    const iH = img.naturalHeight;
    const imgAspect = iW / iH;
    const canvasAspect = cW / cH;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasAspect > imgAspect) {
      drawW = cW;
      drawH = cW / imgAspect;
      drawX = 0;
      drawY = (cH - drawH) / 2;
    } else {
      drawH = cH;
      drawW = cH * imgAspect;
      drawX = (cW - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const getNearestLoadedFrame = useCallback((targetIdx: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    const status = loadStatusRef.current;

    if (images[targetIdx] && status[targetIdx] === 2) {
      return images[targetIdx];
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && images[prev] && status[prev] === 2) return images[prev];
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && images[next] && status[next] === 2) return images[next];
    }

    return null;
  }, []);

  const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (index < 0 || index >= TOTAL_FRAMES || loadStatusRef.current[index] !== 0) {
      return Promise.resolve(imagesRef.current[index]);
    }

    loadStatusRef.current[index] = 1;
    activeLoadsRef.current += 1;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(index);

      const onDecoded = () => {
        imagesRef.current[index] = img;
        loadStatusRef.current[index] = 2;
        activeLoadsRef.current -= 1;
        pumpQueue();
        resolve(img);
      };

      const onError = () => {
        if (!useFallbackPngRef.current) {
          const fallbackImg = new Image();
          fallbackImg.src = getFramePath(index, true);
          fallbackImg.onload = () => {
            useFallbackPngRef.current = true;
            imagesRef.current[index] = fallbackImg;
            loadStatusRef.current[index] = 2;
            activeLoadsRef.current -= 1;
            pumpQueue();
            resolve(fallbackImg);
          };
          fallbackImg.onerror = () => {
            loadStatusRef.current[index] = 3;
            activeLoadsRef.current -= 1;
            pumpQueue();
            resolve(null);
          };
          return;
        }

        loadStatusRef.current[index] = 3;
        activeLoadsRef.current -= 1;
        pumpQueue();
        resolve(null);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(onDecoded).catch(() => onDecoded());
        } else {
          onDecoded();
        }
      };

      img.onerror = onError;
    });
  }, [getFramePath]);

  const pumpQueue = useCallback(() => {
    if (activeLoadsRef.current >= MAX_CONCURRENT_LOADS) return;

    const currentIdx = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
    const queue: number[] = [];
    const status = loadStatusRef.current;

    for (let d = 0; d <= 30; d++) {
      const forward = currentIdx + d;
      const backward = currentIdx - d;
      if (forward < TOTAL_FRAMES && status[forward] === 0 && !queue.includes(forward)) queue.push(forward);
      if (backward >= 0 && status[backward] === 0 && !queue.includes(backward)) queue.push(backward);
    }

    for (let i = 0; i < TOTAL_FRAMES; i += 5) {
      if (status[i] === 0 && !queue.includes(i)) queue.push(i);
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (status[i] === 0 && !queue.includes(i)) queue.push(i);
    }

    while (activeLoadsRef.current < MAX_CONCURRENT_LOADS && queue.length > 0) {
      const nextIdx = queue.shift();
      if (nextIdx !== undefined) loadFrame(nextIdx);
    }
  }, [loadFrame]);

  const renderCanvasAt = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const img = getNearestLoadedFrame(frameIdx);
    if (img && (frameIdx !== lastDrawnFrameRef.current || img !== lastDrawnImageRef.current)) {
      drawImageCover(ctx, img, canvas.width, canvas.height);
      lastDrawnFrameRef.current = frameIdx;
      lastDrawnImageRef.current = img;
    }
  }, [drawImageCover, getNearestLoadedFrame]);

  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * LERP_FACTOR;
      } else {
        currentProgressRef.current = target;
      }

      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1))));
      renderCanvasAt(frameIdx);

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [renderCanvasAt]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const scrolledPast = -rect.top;
      const rawProgress = scrolledPast / totalScrollableDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      targetProgressRef.current = clamped;
      pumpQueue();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pumpQueue]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastDrawnFrameRef.current = -1;
      lastDrawnImageRef.current = null;
      const currentIdx = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
      renderCanvasAt(currentIdx);
    }
  }, [renderCanvasAt]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    loadFrame(0).then((firstImg) => {
      if (firstImg) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
          if (ctx) {
            drawImageCover(ctx, firstImg, canvas.width, canvas.height);
            lastDrawnFrameRef.current = 0;
            lastDrawnImageRef.current = firstImg;
          }
        }
      }
      pumpQueue();
    });

    loadFrame(TOTAL_FRAMES - 1);
  }, [drawImageCover, loadFrame, pumpQueue]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isSticky ? 'h-[240vh]' : 'h-full'} ${className}`}
      id="scroll-architecture-animation-track"
    >
      <div className={`${isSticky ? 'sticky top-0 h-screen' : 'relative w-full h-full'} w-full flex items-center justify-center overflow-hidden bg-[#191B1A]`}>
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{
              imageRendering: 'auto',
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
            aria-label="Scroll-based architectural transformation"
          />
          <div className="absolute inset-0 pointer-events-none border border-[#E5E4DE]/10" />
        </div>
      </div>
    </div>
  );
};
