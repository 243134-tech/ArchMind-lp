import React, { useRef, useEffect, useCallback } from 'react';

const TOTAL_FRAMES = 300;
const CONCURRENT_LOADS = 16;
const LERP_FACTOR = 0.09; // Smooth 60fps inertial lerping

export const ScrollBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cached frame images & loading states
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadStatusRef = useRef<number[]>(new Array(TOTAL_FRAMES).fill(0)); // 0: unrequested, 1: loading, 2: loaded, 3: failed
  const activeLoadsRef = useRef<number>(0);
  const useFallbackPngRef = useRef<boolean>(false);

  // Scrubbing & RAF state
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Format frame URL
  const getFramePath = useCallback((index: number, fallback = false): string => {
    const num = String(index + 1).padStart(4, '0');
    if (fallback || useFallbackPngRef.current) {
      return `/archmind_video_frames/frame_${num}.png`;
    }
    return `/frames/frame_${num}.webp`;
  }, []);

  // Cover-fit image drawing onto High-DPI Canvas
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

  // Find nearest loaded frame to eliminate any blank flashes
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

  // Load a single frame with off-thread decode
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (index < 0 || index >= TOTAL_FRAMES || loadStatusRef.current[index] !== 0) {
      return Promise.resolve(imagesRef.current[index]);
    }

    loadStatusRef.current[index] = 1; // Loading
    activeLoadsRef.current += 1;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(index);

      const onDecoded = () => {
        imagesRef.current[index] = img;
        loadStatusRef.current[index] = 2; // Loaded
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

  // Intelligent priority queue loader
  const pumpQueue = useCallback(() => {
    if (activeLoadsRef.current >= CONCURRENT_LOADS) return;

    const currentIdx = Math.round(currentFrameRef.current);
    const queue: number[] = [];
    const status = loadStatusRef.current;

    // 1. Proximity neighborhood around current frame position (-20 to +40)
    for (let d = 0; d <= 40; d++) {
      const forward = currentIdx + d;
      const backward = currentIdx - d;
      if (forward < TOTAL_FRAMES && status[forward] === 0 && !queue.includes(forward)) {
        queue.push(forward);
      }
      if (backward >= 0 && status[backward] === 0 && !queue.includes(backward)) {
        queue.push(backward);
      }
    }

    // 2. Uniform sample stride (every 5th frame) across timeline
    for (let i = 0; i < TOTAL_FRAMES; i += 5) {
      if (status[i] === 0 && !queue.includes(i)) {
        queue.push(i);
      }
    }

    // 3. All remaining frames sequentially
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (status[i] === 0 && !queue.includes(i)) {
        queue.push(i);
      }
    }

    while (activeLoadsRef.current < CONCURRENT_LOADS && queue.length > 0) {
      const nextIdx = queue.shift();
      if (nextIdx !== undefined) {
        loadFrame(nextIdx);
      }
    }
  }, [loadFrame]);

  // Render canvas at specific frame
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

  // 60 FPS RAF Lerp Loop for Buttery Smooth Background Scrubbing
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0005) {
        currentFrameRef.current += diff * LERP_FACTOR;
      } else {
        currentFrameRef.current = target;
      }

      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      renderCanvasAt(frameIdx);

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderCanvasAt]);

  // Track entire page scroll
  const updateTargetFromScroll = useCallback(() => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
    targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    pumpQueue();
  }, [pumpQueue]);

  useEffect(() => {
    const onScroll = () => updateTargetFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    updateTargetFromScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, [updateTargetFromScroll]);

  // Resize canvas for razor-sharp High-DPI Retina fidelity
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.round(window.innerWidth * dpr);
    const targetHeight = Math.round(window.innerHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastDrawnFrameRef.current = -1;
      lastDrawnImageRef.current = null;
      const currentIdx = Math.round(currentFrameRef.current);
      renderCanvasAt(currentIdx);
    }

    updateTargetFromScroll();
  }, [renderCanvasAt, updateTargetFromScroll]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  // Instant Priority Frame 1 Load on Mount
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
      id="scroll-background-animation-container"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* High-DPI Fullscreen Hardware-Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Cinema-grade subtle atmosphere scrim: Keeps footage vibrant while ensuring pure floating text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
};
