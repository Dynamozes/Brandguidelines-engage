import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LENS_DATA = {
  build: {
    label: 'Lens 01',
    name: 'Build',
    intent: "You're here to make something real.",
    descriptor: 'We design and build — UI/UX systems, digital products, immersive prototypes, and spatial experiences that function in the world.',
    tags: ['UI / UX Design', 'Product Design', 'Spatial Experiences', 'Rapid Prototyping', 'Design Systems'],
    color: 'var(--lens-build)',
    rgb: '59, 130, 246',
  },
  understand: {
    label: 'Lens 02',
    name: 'Understand',
    intent: "You're here to think differently.",
    descriptor: 'Design, for us, is a reasoning tool. We build frameworks, map systems, and conduct research that makes complexity navigable.',
    tags: ['Design Research', 'Systems Thinking', 'Workshops', 'Strategic Foresight', 'Frameworks'],
    color: 'var(--lens-understand)',
    rgb: '217, 70, 239',
  },
  industry: {
    label: 'Lens 03',
    name: 'Industry',
    intent: 'Context matters. You already know that.',
    descriptor: "We've worked with major clients across healthcare, civic infrastructure, education, and culture — designing where the stakes are highest.",
    tags: ['Healthcare', 'Civic & Government', 'Finance', 'Education', 'Culture & Media'],
    color: 'var(--lens-industry)',
    rgb: '16, 185, 129',
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const LensContent = ({ lens }) => {
  const data = LENS_DATA[lens];
  if (!data) return null;

  return (
    <motion.div
      key={lens}
      className="lens-content"
      variants={stagger}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 20, transition: { duration: 0.4 } }}
    >
      {/* Eyebrow */}
      <motion.span
        variants={fadeUp}
        style={{
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: `rgba(${data.rgb}, 0.7)`,
          fontFamily: 'var(--font-display)',
        }}
      >
        {data.label}
      </motion.span>

      {/* Intent headline */}
      <motion.h2 className="lens-intent" variants={fadeUp}>
        {data.intent}
      </motion.h2>

      {/* Descriptor */}
      <motion.p className="lens-descriptor" variants={fadeUp}>
        {data.descriptor}
      </motion.p>

      {/* Service / sector tags */}
      <motion.div className="lens-tags" variants={fadeUp}>
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="lens-tag"
            style={{
              borderColor: `rgba(${data.rgb}, 0.22)`,
              color: `rgba(${data.rgb}, 0.85)`,
            }}
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div className="scroll-hint" variants={fadeUp}>
        <div className="scroll-hint-line" />
        Scroll to explore
      </motion.div>
    </motion.div>
  );
};

export default LensContent;
export { LENS_DATA };
