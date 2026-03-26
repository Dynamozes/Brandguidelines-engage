import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import LensWorld from './components/LensWorld';
import WorkSection from './components/WorkSection';
import AboutSection from './components/AboutSection';
import ImageReveal from './components/ImageReveal';

/* ── Contact section ── */
const ContactSection = () => (
  <section
    id="contact"
    style={{
      background: 'var(--bg-void)',
      padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 32,
    }}
  >
    <p
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
      }}
    >
      Let's Work Together
    </p>
    <h2
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(36px, 5vw, 72px)',
        fontWeight: 200,
        letterSpacing: '-0.04em',
        color: '#ffffff',
        lineHeight: 1.05,
        maxWidth: 700,
      }}
    >
      Ready to design something that matters?
    </h2>
    <p
      style={{
        fontSize: 15,
        color: 'rgba(255,255,255,0.35)',
        maxWidth: 480,
        lineHeight: 1.75,
      }}
    >
      We work with a small number of clients at a time to ensure the quality of thinking
      they deserve. Tell us what you're building.
    </p>
    <a
      href="mailto:hello@gravityengage.com"
      className="cta-button"
      style={{ fontSize: 12, marginTop: 8 }}
    >
      hello@gravityengage.com →
    </a>
  </section>
);

/* ── Footer ── */
const Footer = () => (
  <footer className="footer">
    <span className="footer-copy">© 2026 Gravity Engage Studio</span>
    <div className="footer-links">
      <a href="#work"    className="footer-link">Work</a>
      <a href="#about"   className="footer-link">About</a>
      <a href="#contact" className="footer-link">Contact</a>
    </div>
  </footer>
);

/* ── App ── */
const App = () => {
  const [activeLens,  setActiveLens]  = useState(null);
  const [hoveredLens, setHoveredLens] = useState(null);
  const scrollRef = useRef(0);

  /**
   * introPhase controls the opening sequence:
   *   'particles'     — particle wave plays (8 s)
   *   'image-reveal'  — ImageReveal canvas animation (self-timed ~8 s)
   *   'welcome'       — normal LensWorld UI
   */
  const [introPhase, setIntroPhase] = useState('particles');

  /* Track scroll progress */
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* After 8 s of particles, move to image-reveal */
  useEffect(() => {
    if (introPhase !== 'particles') return;
    const t = setTimeout(() => setIntroPhase('image-reveal'), 8000);
    return () => clearTimeout(t);
  }, [introPhase]);

  /* Automate the lens cycling — only once in 'welcome' phase */
  useEffect(() => {
    if (introPhase !== 'welcome') return;
    const lensKeys = [null, 'build', 'understand', 'industry'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % lensKeys.length;
      setHoveredLens(lensKeys[index]);
    }, 4000);
    return () => clearInterval(interval);
  }, [introPhase]);

  return (
    <div style={{ background: 'var(--bg-void)' }}>
      {/* Navbar hidden during intro */}
      {introPhase === 'welcome' && <Navbar activeLens={activeLens} />}

      {/* Image-reveal overlay — shown between particle loop and welcome */}
      {introPhase === 'image-reveal' && (
        <ImageReveal
          src="/landscape.png"
          onDone={() => setIntroPhase('welcome')}
        />
      )}

      <main>
        <LensWorld
          activeLens={activeLens}
          setActiveLens={setActiveLens}
          hoveredLens={hoveredLens}
          setHoveredLens={setHoveredLens}
          scrollRef={scrollRef}
          introPhase={introPhase}
        />
        {introPhase === 'welcome' && (
          <>
            <WorkSection />
            <AboutSection />
            <ContactSection />
          </>
        )}
      </main>

      {introPhase === 'welcome' && <Footer />}
    </div>
  );
};

export default App;
