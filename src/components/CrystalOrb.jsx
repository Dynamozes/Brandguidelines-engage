import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ORB_SIZE = 340;

const COLOR_MAP = {
  build:      '59, 130, 246',
  understand: '217, 70, 239',
  industry:   '16, 185, 129',
};

const GLOW_MAP = {
  build:      '#3B82F6',
  understand: '#D946EF',
  industry:   '#10B981',
};

// Placeholder video for cinematic interface interaction
const VIDEO_SRC = "https://assets.mixkit.io/videos/preview/mixkit-holographic-projection-of-a-planet-9121-large.mp4";

const CrystalOrb = ({ lens }) => {
  const canvasRef = useRef();
  const videoRef  = useRef();
  const animRef   = useRef();
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  const rgb = COLOR_MAP[lens];
  const glow = GLOW_MAP[lens];

  useEffect(() => {
    const video = document.createElement('video');
    video.src = VIDEO_SRC;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.play().then(() => setIsVideoReady(true));
    videoRef.current = video;

    return () => {
      video.pause();
      video.src = "";
      video.load();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const start = Date.now();

    const draw = () => {
      const t = (Date.now() - start) / 1000;
      
      ctx.clearRect(0, 0, ORB_SIZE, ORB_SIZE);
      const cx = ORB_SIZE / 2, cy = ORB_SIZE / 2, r = ORB_SIZE / 2;

      // 1. Draw refracted video
      if (videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2);
        ctx.clip();
        
        // Refraction effect (slight zoom and barrel distortion simulation via drawImage)
        const v = videoRef.current;
        const aspect = v.videoWidth / v.videoHeight;
        let vw = ORB_SIZE, vh = ORB_SIZE;
        if (aspect > 1) vh = vw / aspect; else vw = vh * aspect;
        
        ctx.drawImage(v, cx - vw/1.2, cy - vh/1.2, vw * 1.6, vh * 1.6);
        ctx.restore();
      }

      // 2. HUD Layers
      // Concentric rings
      const ringRadii = [0.42, 0.70, 0.83, 0.94];
      ringRadii.forEach((rr, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${0.1 + i * 0.05})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Rotating scanner
      const sweepAngle = t * 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r * 0.92, sweepAngle, sweepAngle + 0.5);
      ctx.closePath();
      const sweep = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.92);
      sweep.addColorStop(0, `rgba(${rgb}, 0.2)`);
      sweep.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = sweep;
      ctx.fill();

      // Data nodes
      for(let i=0; i<5; i++) {
        const angle = t * 0.5 + (i * Math.PI * 2 / 5);
        const dist = r * 0.6;
        const nx = cx + Math.cos(angle) * dist;
        const ny = cy + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(nx, ny, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.8)`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = `rgba(${rgb}, 0.1)`;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [rgb, isVideoReady]);

  return (
    <div className="orb-container">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'relative' }}
      >
        <div
          className="crystal-orb"
          style={{
            boxShadow: `0 0 100px ${glow}55, inset 0 0 60px rgba(255,255,255,0.15)`,
            border: `1px solid rgba(${rgb}, 0.4)`,
            background: `radial-gradient(circle, rgba(${rgb}, 0.1) 0%, transparent 80%)`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={ORB_SIZE}
            height={ORB_SIZE}
            className="orb-canvas"
            style={{ filter: `drop-shadow(0 0 20px rgba(${rgb}, 0.3))` }}
          />
          <div className="orb-glass-top" />
          <div className="orb-specular" />
          <div className="orb-rim" style={{ border: `1px solid rgba(${rgb}, 0.5)`, boxShadow: `0 0 25px rgba(${rgb}, 0.2)` }} />
        </div>
      </motion.div>
    </div>
  );
};

export default CrystalOrb;
