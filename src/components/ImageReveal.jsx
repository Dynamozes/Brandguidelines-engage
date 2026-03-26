import React, { useEffect, useRef } from 'react';

/**
 * ImageReveal
 * -----------
 * Canvas-based particle animation that:
 *   Phase 1 — particles scatter → converge to form the image   (~2.5 s)
 *   Phase 2 — image holds sharp                                (~3 s)
 *   Phase 3 — particles explode / disintegrate outward         (~2.5 s)
 *
 * Props
 *   src        — image URL
 *   onDone     — called when the full animation finishes
 */
const ImageReveal = ({ src, onDone }) => {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ running: true });

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext('2d');
    const state   = stateRef.current;
    state.running = true;

    // ── Sizing ──────────────────────────────────────────
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    // ── Load + sample image ─────────────────────────────
    const img = new Image();
    img.onload = () => {
      if (!state.running) return;

      // Draw image centred, fitting inside the viewport
      const scale   = Math.min((W * 0.75) / img.width, (H * 0.75) / img.height);
      const imgW    = img.width  * scale;
      const imgH    = img.height * scale;
      const imgX    = (W - imgW) / 2;
      const imgY    = (H - imgH) / 2;

      // Sample pixels from the image
      const offscreen = document.createElement('canvas');
      offscreen.width  = Math.round(imgW);
      offscreen.height = Math.round(imgH);
      const oc = offscreen.getContext('2d', { willReadFrequently: true });
      oc.drawImage(img, 0, 0, offscreen.width, offscreen.height);

      const STEP   = 6;          // pixels between sampled points
      const pixels = [];
      for (let py = STEP / 2; py < offscreen.height; py += STEP) {
        for (let px = STEP / 2; px < offscreen.width; px += STEP) {
          const d = oc.getImageData(px, py, 1, 1).data;
          if (d[3] < 30) continue; // skip transparent
          pixels.push({
            tx: imgX + px,           // target x on canvas
            ty: imgY + py,           // target y on canvas
            r: d[0], g: d[1], b: d[2],
          });
        }
      }

      const COUNT = Math.min(pixels.length, 18000);
      const sample = pixels.sort(() => Math.random() - 0.5).slice(0, COUNT);

      // ── Build particle array ─────────────────────────
      const particles = sample.map(p => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        tx: p.tx,
        ty: p.ty,
        r: p.r, g: p.g, b: p.b,
        // scatter-offset for disintegration
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        size: Math.random() * 1.8 + 0.6,
      }));

      // ── Timing ──────────────────────────────────────
      // Phase 0: gather      0 → 2500 ms
      // Phase 1: hold     2500 → 5500 ms
      // Phase 2: scatter  5500 → 8000 ms
      const T_GATHER  = 2500;
      const T_HOLD    = 5500;
      const T_SCATTER = 8000;

      let startTs = null;
      let raf;

      const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const render = (ts) => {
        if (!state.running) return;
        if (!startTs) startTs = ts;
        const elapsed = ts - startTs;

        ctx.clearRect(0, 0, W, H);

        if (elapsed < T_GATHER) {
          // ── Gather phase ──
          const prog = ease(Math.min(elapsed / T_GATHER, 1));
          particles.forEach(p => {
            p.x += (p.tx - p.x) * (0.04 + prog * 0.06);
            p.y += (p.ty - p.y) * (0.04 + prog * 0.06);
            const alpha = 0.3 + prog * 0.7;
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (elapsed < T_HOLD) {
          // ── Hold phase — draw crisp image + faint particles ──
          const holdProg = (elapsed - T_GATHER) / (T_HOLD - T_GATHER);

          // Draw real image fading in
          ctx.globalAlpha = Math.min(holdProg * 2, 1);
          ctx.drawImage(img, imgX, imgY, imgW, imgH);
          ctx.globalAlpha = 1;

          // Particle overlay fades out as actual image fades in
          const pAlpha = Math.max(1 - holdProg * 2, 0);
          if (pAlpha > 0) {
            particles.forEach(p => {
              ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${pAlpha})`;
              ctx.beginPath();
              ctx.arc(p.tx, p.ty, p.size, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        } else if (elapsed < T_SCATTER) {
          // ── Scatter phase ──
          const prog = Math.min((elapsed - T_HOLD) / (T_SCATTER - T_HOLD), 1);
          const easedProg = ease(prog);

          // Real image fades out
          ctx.globalAlpha = Math.max(1 - easedProg * 1.5, 0);
          ctx.drawImage(img, imgX, imgY, imgW, imgH);
          ctx.globalAlpha = 1;

          // Particles scatter
          particles.forEach(p => {
            const sx = p.tx + p.vx * easedProg * 60;
            const sy = p.ty + p.vy * easedProg * 60;
            const alpha = Math.max(1 - easedProg * 1.2, 0);
            if (alpha <= 0) return;
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, p.size * (1 + easedProg * 0.5), 0, Math.PI * 2);
            ctx.fill();
          });
        } else {
          // Done
          ctx.clearRect(0, 0, W, H);
          state.running = false;
          onDone && onDone();
          return;
        }

        raf = requestAnimationFrame(render);
      };

      raf = requestAnimationFrame(render);

      state.cancel = () => {
        state.running = false;
        cancelAnimationFrame(raf);
      };
    };
    img.src = src;

    return () => {
      state.running = false;
      state.cancel && state.cancel();
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#050507',
        display: 'block',
      }}
    />
  );
};

export default ImageReveal;
