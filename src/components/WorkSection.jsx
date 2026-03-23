import React from 'react';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    id: 1,
    title: 'Nexus Health',
    tag: 'Healthcare · UI/UX',
    desc: 'A digital command centre for emergency response teams across public hospitals.',
    gradient: 'linear-gradient(135deg, #0f1a2e 0%, #1a2d4a 40%, #0a1628 100%)',
    accent: '#3B82F6',
  },
  {
    id: 2,
    title: 'Arcadia',
    tag: 'Civic · Systems Design',
    desc: "Urban digital-twin platform for monitoring Mumbai's water infrastructure in real time.",
    gradient: 'linear-gradient(135deg, #0a1f1a 0%, #103024 45%, #071510 100%)',
    accent: '#10B981',
  },
  {
    id: 3,
    title: 'Meridian',
    tag: 'Finance · Product Design',
    desc: 'End-to-end system design for a next-generation wealth management platform.',
    gradient: 'linear-gradient(135deg, #1a0f2e 0%, #2c1a4a 45%, #110a20 100%)',
    accent: '#D946EF',
  },
  {
    id: 4,
    title: 'Flux',
    tag: 'Research · Strategy',
    desc: 'A framework for designing adaptive learning environments in under-resourced schools.',
    gradient: 'linear-gradient(135deg, #1a1500 0%, #2e2400 45%, #0f0c00 100%)',
    accent: '#F59E0B',
  },
  {
    id: 5,
    title: 'Grid',
    tag: 'Spatial · Exhibition',
    desc: 'Immersive exhibition design for emerging technologies at SXSW 2025.',
    gradient: 'linear-gradient(135deg, #001a1a 0%, #00302c 45%, #001010 100%)',
    accent: '#06B6D4',
  },
  {
    id: 6,
    title: 'Kite',
    tag: 'Culture · Brand Systems',
    desc: 'Brand identity and digital design system for an award-winning arts district.',
    gradient: 'linear-gradient(135deg, #1a000f 0%, #2e0018 45%, #0f0009 100%)',
    accent: '#F43F5E',
  },
];

const WorkCard = ({ project, index }) => (
  <motion.div
    className="work-card"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.08 }}
  >
    <div
      className="work-card-bg"
      style={{ background: project.gradient, position: 'absolute', inset: 0 }}
    >
      {/* Subtle geometric accent */}
      <div style={{
        position: 'absolute',
        right: 24,
        top: 24,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${project.accent}22 0%, transparent 70%)`,
        transition: 'transform 0.8s ease',
      }} />
      <div style={{
        position: 'absolute',
        right: 40,
        top: 40,
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: `1px solid ${project.accent}33`,
      }} />
    </div>

    <div className="work-card-overlay" />

    <div className="work-card-content">
      <div className="work-card-tag" style={{ color: project.accent }}>
        {project.tag}
      </div>
      <h3 className="work-card-title">{project.title}</h3>
      <p className="work-card-desc">{project.desc}</p>
    </div>
  </motion.div>
);

const WorkSection = () => (
  <section className="work-section" id="work">
    <div className="section-header">
      <motion.p
        className="section-eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Selected Work
      </motion.p>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      >
        Built at the edge<br />of what's possible.
      </motion.h2>
    </div>

    <div className="work-grid">
      {PROJECTS.map((p, i) => (
        <WorkCard key={p.id} project={p} index={i} />
      ))}
    </div>
  </section>
);

export default WorkSection;
