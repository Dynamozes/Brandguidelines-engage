import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay },
});

const STATS = [
  { number: '12+', label: 'Years of practice' },
  { number: '80+', label: 'Projects delivered' },
  { number: '4',   label: 'Continents worked in' },
  { number: '∞',   label: 'Systems imagined' },
];

const AboutSection = () => (
  <section className="about-section" id="about">
    <div className="about-grid">
      {/* Left — text */}
      <div>
        <motion.p className="section-eyebrow" {...fadeUp(0)}>About Us</motion.p>
        <motion.h2
          className="section-title"
          style={{ marginBottom: 40 }}
          {...fadeUp(0.1)}
        >
          A studio that reasons<br />through design.
        </motion.h2>

        <motion.div className="about-body" {...fadeUp(0.2)}>
          <p>
            Gravity Engage is an innovation design studio working at the intersection of
            design, technology, and systems thinking. We partner with organisations that
            operate in complexity — where the problems are layered, the stakes are real,
            and conventional solutions fall short.
          </p>
          <p>
            Our practice spans service design, digital product design, spatial experiences,
            and strategic research. We don't just make things look good — we make them
            work in ways they never did before.
          </p>
          <p>
            Founded on the belief that design is a form of intelligence, we apply
            systems-level thinking to every brief — from a single dashboard to
            a civic infrastructure platform.
          </p>
        </motion.div>

        <motion.div style={{ marginTop: 40 }} {...fadeUp(0.3)}>
          <a href="#contact" className="cta-button">
            Start a conversation →
          </a>
        </motion.div>
      </div>

      {/* Right — stats grid */}
      <motion.div
        className="about-stats"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="about-stat"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
          >
            <div className="about-stat-number">{s.number}</div>
            <div className="about-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
