import React, { useRef, useEffect, useCallback } from 'react';

const TOTAL_FRAMES = 300;
const MAX_CONCURRENT_LOADS = 12;
const LERP_FACTOR = 0.1; // Smooth inertial lerp for 60fps scrub
const STICKY_OFFSET = 84; // Matches sticky top-20 / top-24 (clear of navbar)

export const ArchitecturalAnimationContainer: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Frame cache and loading states
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadStatusRef = useRef<number[]>(new Array(TOTAL_FRAMES).fill(0)); // 0: unrequested, 1: loading, 2: loaded, 3: failed
  const activeLoadsRef = useRef<number>(0);
  const useFallbackPngRef = useRef<boolean>(false);

  // Scrub and animation refs
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

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
      if (prev >= 0 && images[prev] && status[prev] === 2) {
        return images[prev];
      }
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && images[next] && status[next] === 2) {
        return images[next];
      }
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
    if (activeLoadsRef.current >= MAX_CONCURRENT_LOADS) return;

    const currentIdx = Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1));
    const queue: number[] = [];
    const status = loadStatusRef.current;

    // 1. Proximity neighborhood around current frame (-20 to +35)
    for (let d = 0; d <= 35; d++) {
      const forward = currentIdx + d;
      const backward = currentIdx - d;
      if (forward < TOTAL_FRAMES && status[forward] === 0 && !queue.includes(forward)) {
        queue.push(forward);
      }
      if (backward >= 0 && status[backward] === 0 && !queue.includes(backward)) {
        queue.push(backward);
      }
    }

    // 2. Uniform sample stride across timeline
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

    while (activeLoadsRef.current < MAX_CONCURRENT_LOADS && queue.length > 0) {
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

  // 60 FPS RAF Lerp Loop for Buttery Smooth Scrubbing
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
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderCanvasAt]);

  // Track page scroll through the sticky track
  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = rect.height - windowH;

      if (totalScrollable <= 0) return;

      // When track reaches the sticky header offset, progress starts from 0 to 1
      const scrolledPast = STICKY_OFFSET - rect.top;
      const progress = scrolledPast / totalScrollable;
      const clamped = Math.max(0, Math.min(1, progress));

      targetProgressRef.current = clamped;
      pumpQueue();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pumpQueue]);

  // Direct Wheel scrubbing on container
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 0.5) {
      const delta = (e.deltaY / 2000);
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + delta));
      pumpQueue();
    }
  };

  // Touch swipe support for mobile / tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current !== null && e.touches.length === 1) {
      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const progressDelta = deltaY / 1200;
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + progressDelta));
      touchStartYRef.current = e.touches[0].clientY;
      pumpQueue();
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
  };

  // Resize canvas for sharp High-DPI Retina fidelity
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

  // Initialization: Instant Frame 1 Priority Load + Queue Kickoff
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

    // Also prime end frame
    loadFrame(TOTAL_FRAMES - 1);
  }, [drawImageCover, loadFrame, pumpQueue]);

  return (
    <div
      ref={trackRef}
      id="archmind-transformation-track"
      className="relative w-full min-h-[220vh] md:min-h-[250vh] mt-8 md:mt-12"
      aria-label="Scroll-driven architectural transformation"
    >
      {/* Sticky centered viewport container */}
      <div className="sticky top-20 md:top-24 w-full flex items-center justify-center z-10">
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          id="archmind-animation-container"
          data-animation-hook="scroll-based-architectural-transformation"
          className="relative w-full max-w-6xl mx-auto transition-all"
        >
          {/* Architectural presentation canvas container */}
          <div className="relative w-full aspect-[16/9] min-h-[360px] md:min-h-[500px] lg:min-h-[560px] bg-[#191B1A] rounded-2xl border border-[#E5E4DE] shadow-xl overflow-hidden flex items-center justify-center">
            
            {/* Hardware-Accelerated High-DPI Canvas: Pure scroll animation, no UI clutter */}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{
                imageRendering: 'auto',
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
              aria-label="Scroll-based architectural transformation from raw construction to dream home"
            />

            {/* Subtle architectural hairline border */}
            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl" />

          </div>
        </div>
      </div>
    </div>
  );
};
