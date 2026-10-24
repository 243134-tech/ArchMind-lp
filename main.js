/**
 * ArchMind - High-Performance Scroll-Based Video Frame Animation
 *
 * Designed for 60fps+ silky-smooth rendering with:
 * - HTML5 Canvas hardware-accelerated 2D rendering
 * - Inertial lerp (linear interpolation) smoothing
 * - Asynchronous background off-thread image decoding (Image.decode)
 * - Dynamic scroll distance computation & multi-input scrubbing (wheel, touch, keys)
 * - Priority-based proximity frame preloading
 * - Zero-flicker nearest-frame fallback during fast scrubbing
 * - High-DPI / Retina responsive cover scaling
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 300;
  const TRACK_HEIGHT_PX = 6000;  // 6000px explicit scroll room (~20px per frame)
  const LERP_FACTOR = 0.08;       // Inertial damping factor for silky momentum
  const CONCURRENT_LOADS = 16;   // Fast parallel preloader
  const PREFERRED_EXT = 'webp';   // Modern lightweight WebP frames
  const FALLBACK_EXT = 'png';    // Original PNG frames fallback
  const WEBP_DIR = 'frames';
  const PNG_DIR = 'archmind_video_frames';

  // --- DOM Elements ---
  const canvas = document.getElementById('animation-canvas');
  const scrollTrack = document.getElementById('scroll-track');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

  // Apply track height
  if (scrollTrack) {
    scrollTrack.style.height = `${TRACK_HEIGHT_PX}px`;
    scrollTrack.style.minHeight = `${TRACK_HEIGHT_PX}px`;
  }

  // --- State ---
  const images = new Array(TOTAL_FRAMES).fill(null);
  const loadStatus = new Array(TOTAL_FRAMES).fill(0); // 0: unrequested, 1: loading, 2: loaded, 3: failed
  let activeLoads = 0;
  let useFallbackPng = false;

  let currentFrame = 0;
  let targetFrame = 0;
  let lastDrawnFrame = -1;
  let lastDrawnImage = null;
  let isTicking = false;

  // --- Format filename (frame_0001 to frame_0300) ---
  function getFramePath(index, fallback = false) {
    const num = String(index + 1).padStart(4, '0');
    if (fallback || useFallbackPng) {
      return `${PNG_DIR}/frame_${num}.${FALLBACK_EXT}`;
    }
    return `${WEBP_DIR}/frame_${num}.${PREFERRED_EXT}`;
  }

  // --- Canvas Sizing with Retina / High-DPI handling ---
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      lastDrawnFrame = -1;
      lastDrawnImage = null;
    }

    updateTargetFrame();
    requestTick();
  }

  // --- Draw Image with 'object-fit: cover' logic ---
  function drawFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    const imgAspect = iW / iH;
    const canvasAspect = cW / cH;

    let drawW, drawH, drawX, drawY;

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
  }

  // --- Find Nearest Loaded Frame to Prevent Any Blank Glitches ---
  function getNearestLoadedFrame(targetIdx) {
    if (images[targetIdx] && loadStatus[targetIdx] === 2) {
      return images[targetIdx];
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && images[prev] && loadStatus[prev] === 2) {
        return images[prev];
      }
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && images[next] && loadStatus[next] === 2) {
        return images[next];
      }
    }

    return null;
  }

  // --- Load a Single Frame with Off-Thread Decode ---
  function loadFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES || loadStatus[index] !== 0) {
      return Promise.resolve(images[index]);
    }

    loadStatus[index] = 1; // Loading
    activeLoads++;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(index);

      const onDecoded = () => {
        images[index] = img;
        loadStatus[index] = 2; // Loaded
        activeLoads--;
        pumpQueue();

        const currentIdx = Math.round(currentFrame);
        if (currentIdx === index || lastDrawnImage === null) {
          requestTick();
        }
        resolve(img);
      };

      const onError = () => {
        if (!useFallbackPng) {
          const fallbackImg = new Image();
          fallbackImg.src = getFramePath(index, true);
          fallbackImg.onload = () => {
            useFallbackPng = true;
            images[index] = fallbackImg;
            loadStatus[index] = 2;
            activeLoads--;
            pumpQueue();
            if (Math.round(currentFrame) === index || lastDrawnImage === null) {
              requestTick();
            }
            resolve(fallbackImg);
          };
          fallbackImg.onerror = () => {
            loadStatus[index] = 3;
            activeLoads--;
            pumpQueue();
            resolve(null);
          };
          return;
        }

        loadStatus[index] = 3; // Failed
        activeLoads--;
        pumpQueue();
        resolve(null);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode()
            .then(onDecoded)
            .catch(() => onDecoded());
        } else {
          onDecoded();
        }
      };

      img.onerror = onError;
    });
  }

  // --- Fast Queue Loader ---
  function pumpQueue() {
    if (activeLoads >= CONCURRENT_LOADS) return;

    const center = Math.round(currentFrame);
    const queue = [];

    // 1. Neighborhood around current position (-20 to +40)
    for (let d = 0; d <= 40; d++) {
      const forward = center + d;
      const backward = center - d;
      if (forward < TOTAL_FRAMES && loadStatus[forward] === 0 && !queue.includes(forward)) {
        queue.push(forward);
      }
      if (backward >= 0 && loadStatus[backward] === 0 && !queue.includes(backward)) {
        queue.push(backward);
      }
    }

    // 2. Uniform sample stride across sequence
    for (let i = 0; i < TOTAL_FRAMES; i += 5) {
      if (loadStatus[i] === 0 && !queue.includes(i)) {
        queue.push(i);
      }
    }

    // 3. All remaining frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (loadStatus[i] === 0 && !queue.includes(i)) {
        queue.push(i);
      }
    }

    while (activeLoads < CONCURRENT_LOADS && queue.length > 0) {
      const nextIndex = queue.shift();
      loadFrame(nextIndex);
    }
  }

  // --- Scroll Tracking & Progress Computation ---
  function updateTargetFrame() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
    targetFrame = progress * (TOTAL_FRAMES - 1);
  }

  function onScroll() {
    updateTargetFrame();
    pumpQueue();
    requestTick();
  }

  // --- Animation & Render Loop ---
  function renderLoop() {
    const diff = targetFrame - currentFrame;

    if (Math.abs(diff) > 0.0005) {
      currentFrame += diff * LERP_FACTOR;
    } else {
      currentFrame = targetFrame;
    }

    const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
    const img = getNearestLoadedFrame(frameIdx);

    if (img && (frameIdx !== lastDrawnFrame || img !== lastDrawnImage)) {
      drawFrame(img);
      lastDrawnFrame = frameIdx;
      lastDrawnImage = img;
    }

    if (Math.abs(targetFrame - currentFrame) > 0.0005) {
      requestAnimationFrame(renderLoop);
    } else {
      isTicking = false;
    }
  }

  function requestTick() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderLoop);
    }
  }

  // --- Mouse Wheel Support (smooth scroll helper if native scroll is sluggish) ---
  window.addEventListener('wheel', (e) => {
    // Ensure updates occur on wheel ticks
    updateTargetFrame();
    pumpQueue();
    requestTick();
  }, { passive: true });

  // --- Touch Support for Mobile / Tablets / Touchscreens ---
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    updateTargetFrame();
    pumpQueue();
    requestTick();
  }, { passive: true });

  // --- Keyboard scrubbing support ---
  window.addEventListener('keydown', (e) => {
    const scrollAmount = window.innerHeight * 0.15;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'PageDown' || e.key === ' ') {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
    } else if (e.key === 'PageUp') {
      window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
    } else if (e.key === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });

  // --- Event Listeners ---
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 50);
  }, { passive: true });

  // --- Initialization ---
  function init() {
    resizeCanvas();

    // Priority load frame 0 and render immediately
    loadFrame(0).then((firstImg) => {
      if (firstImg) {
        drawFrame(firstImg);
        lastDrawnFrame = 0;
        lastDrawnImage = firstImg;
      }
      pumpQueue();
    });

    // Also prime final frame
    loadFrame(TOTAL_FRAMES - 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
