import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Box, Zap, Globe, MousePointer2, Aperture } from 'lucide-react';
import ParticleField from './ParticleField';
import CrystalOrb from './CrystalOrb';

const LENS_DATA = {
  build: {
    number: '01', label: 'Build', rgb: '59,130,246',
    headline: "Design systems built for scale.",
    subtext: "End-to-end design capabilities across product, brand, and experience.",
    categories: [
      { title: "Product", items: ["UI/UX Design", "Interaction Design", "Design Systems", "Prototyping"] },
      { title: "Brand", items: ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Communication Design"] },
      { title: "Motion", items: ["Motion Design", "Micro-interactions", "Product Animation", "Explainer Videos"] },
      { title: "Strategy", items: ["UX Strategy", "Product Thinking", "User Research", "Information Architecture"] }
    ],
    cta: "Start a project"
  },
  understand: {
    number: '02', label: 'Understand', rgb: '217,70,239',
    headline: "Structured thinking. Measurable outcomes.",
    subtext: "Our approach combines research, systems thinking, and iterative design.",
    categories: [
      { title: "Content", items: ["Case Studies", "Product Redesigns", "Platform Experiences", "Brand Transformations", "System Implementations"] },
      { title: "Thinking", items: ["Design Frameworks", "Decision Models", "Experience Principles", "System Mapping"] },
      { title: "Process", items: ["Discovery", "Definition", "Design", "Validation", "Delivery"] }
    ],
    cta: "View work"
  },
  industry: {
    number: '03', label: 'Industry', rgb: '16,185,129',
    headline: "Context-driven design.",
    subtext: "We work across sectors with tailored design approaches.",
    categories: [
      { title: "Industries", items: ["Healthcare", "Fintech", "SaaS", "E-commerce", "Startups", "Enterprise", "Education", "Mobility"] }
    ],
    cta: "Discuss your use case"
  },
};

const LENSES = Object.entries(LENS_DATA).map(([id, d]) => ({ id, ...d }));

/* ── Top glassmorphic organic shape ─────── */
const LensShape = ({ lens, hovered, active, onHover, onLeave, onClick }) => {
  const isActive  = active  === lens.id;
  const isHovered = hovered === lens.id;
  const isDimmed  = (active || hovered) && !isActive && !isHovered;
  const lit       = isActive || isHovered;

  return (
    <motion.div
      className={`lens-shape lens-shape--${lens.id}${isDimmed ? ' lens-shape--dimmed' : ''}${isActive ? ' lens-shape--active' : ''}`}
      style={{
        '--label-rgb': lens.rgb,
        borderColor: lit
          ? `rgba(${lens.rgb}, 0.55)`
          : 'rgba(255,255,255,0.06)',
        boxShadow: lit
          ? `0 0 50px rgba(${lens.rgb},0.22), inset 0 0 20px rgba(${lens.rgb},0.1)`
          : '0 8px 32px rgba(0,0,0,0.18)',
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => onHover(lens.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(lens.id)}
    >
      <div className="lens-shape-content">
        <span className="lens-shape-number">{lens.number}</span>
        <span
          className="lens-shape-label"
          style={{ color: lit ? `#fff` : 'rgba(255,255,255,0.55)' }}
        >
          {lens.label}
        </span>
      </div>
      <div className={`lens-active-indicator ${lit ? 'lit' : ''}`} style={{ background: `rgb(${lens.rgb})` }} />
    </motion.div>
  );
};

/* ── Negative space info blocks ───────────── */
const NegativeSpaceInfo = ({ lens }) => {
  const d = LENS_DATA[lens];
  if (!d) return null;

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
  const item    = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25,0.46,0.45,0.94] } } };

  return (
    <div className="lens-info-overlay">
      <motion.div
        className="lens-info-grid"
        variants={stagger} initial="hidden" animate="visible"
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        {/* TOP: Headline and Subtext */}
        <div className="lens-info-header">
          <motion.h2 className="lens-info-headline" variants={item}>{d.headline}</motion.h2>
          <motion.p className="lens-info-subtext" variants={item}>{d.subtext}</motion.p>
        </div>

        {/* BOTTOM: Split Categories */}
        <div className="lens-info-categories">
          {d.categories.map((cat, idx) => (
            <motion.div key={cat.title} className="lens-info-cat" variants={item}>
              <h4 className="cat-title" style={{ color: `rgba(${d.rgb}, 0.6)` }}>{cat.title}</h4>
              <ul className="cat-list">
                {cat.items.map(li => <li key={li}>{li}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div className="lens-info-footer" variants={item}>
          <a href="#contact" className="lens-cta" style={{ borderColor: `rgba(${d.rgb}, 0.35)`, background: `rgba(${d.rgb}, 0.05)` }}>
            {d.cta} →
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ── Main LensWorld ───────────────────────── */
const LensWorld = ({ activeLens, setActiveLens, hoveredLens, setHoveredLens, scrollRef, introPhase }) => {
  const isIntro = introPhase === 'particles' || introPhase === 'image-reveal';
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const sectionRef = useRef();

  const bgState = activeLens || hoveredLens || 'idle';

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleHover = (id) => { if (!activeLens) setHoveredLens(id); };
  const handleLeave = ()  => { if (!activeLens) setHoveredLens(null); };
  const handleClick = (id) => {
    setActiveLens(prev => (prev === id ? null : id));
    setHoveredLens(null);
  };

  const glowRGB = activeLens
    ? LENS_DATA[activeLens]?.rgb
    : hoveredLens
      ? LENS_DATA[hoveredLens]?.rgb
      : '100,110,255';

  return (
    <section
      ref={sectionRef}
      className="lens-world"
      id="home"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background layers — hidden during particle intro ── */}
      {!isIntro && [
        { key: 'idle',       src: '/bg2@2x-100.jpg', filter: 'brightness(0.52)' },
        { key: 'build',      src: '/bg1@2x-100.jpg', filter: 'brightness(0.52) hue-rotate(0deg)' },
        { key: 'understand', src: '/bg2@2x-100.jpg', filter: 'brightness(0.60) hue-rotate(25deg)' },
        { key: 'industry',   src: '/bg1@2x-100.jpg', filter: 'brightness(0.52) hue-rotate(115deg)' },
      ].map(({ key, src, filter }) => (
        <div
          key={key}
          className="lens-bg-layer"
          style={{
            opacity: bgState === key ? 1 : 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter,
          }}
        />
      ))}

      {/* ── Arc glow overlay ── */}
      <div className="hero-arc-glow" />
      <div className="hero-arc-ring" />

      {/* ── Cursor glow ── */}
      <div
        className="cursor-glow"
        style={{
          left: cursorPos.x,
          top:  cursorPos.y,
          background: `radial-gradient(circle, rgba(${glowRGB},0.12) 0%, transparent 70%)`,
        }}
      />

      {/* ── Three.js Canvas ── */}
      <div className="lens-canvas">
        <Canvas
          camera={{ position: [0, 0, 22], fov: 38 }}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ParticleField
            activeLens={activeLens || hoveredLens}
            scrollRef={scrollRef}
          />
        </Canvas>
      </div>

      {/* ── IDLE & HOVERED: central prompt — hidden during particle intro ── */}
      {!isIntro && (
        <AnimatePresence mode="wait">
          {!activeLens && (
            <motion.div
              key={hoveredLens === null ? 'welcome' : 'full'}
              className="central-prompt"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="prompt-eyebrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                <img src="/logo.png" alt="Gravity Engage Logo" className="prompt-logo" />
                Gravity Engage Studio
              </motion.div>
              <motion.h1
                className="prompt-headline"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {hoveredLens === null ? (
                  <>Welcome to Engage</>
                ) : (
                  <>
                    We bridge the friction between<br />
                    <span className="accent-text">complex human needs</span> and<br />
                    high-fidelity technology
                  </>
                )}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── ACTIVE: Crystal orb — hidden during intro ── */}
      {!isIntro && (
        <AnimatePresence mode="wait">
          {activeLens && <CrystalOrb key={activeLens} lens={activeLens} />}
        </AnimatePresence>
      )}

      {/* ── ACTIVE: Negative space info — hidden during intro ── */}
      {!isIntro && (
        <AnimatePresence mode="wait">
          {activeLens && (
            <NegativeSpaceInfo key={activeLens} lens={activeLens} />
          )}
        </AnimatePresence>
      )}

    </section>
  );
};

export default LensWorld;
