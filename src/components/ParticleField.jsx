import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 3200;

/* ── 1. BUILD: Perfect Rotating Cube ── */
function buildCubeTargets() {
  const arr = new Float32Array(COUNT * 3);
  const side = 14;
  const step = 0.72;
  let idx = 0;
  for (let x = 0; x < side; x++) {
    for (let y = 0; y < side; y++) {
      for (let z = 0; z < side; z++) {
        if (idx >= COUNT) break;
        arr[idx * 3] = (x - side / 2) * step;
        arr[idx * 3 + 1] = (y - side / 2) * step;
        arr[idx * 3 + 2] = (z - side / 2) * step;
        idx++;
      }
    }
  }
  while (idx < COUNT) {
    arr[idx * 3] = (Math.random() - 0.5) * 10; arr[idx * 3 + 1] = (Math.random() - 0.5) * 10; arr[idx * 3 + 2] = (Math.random() - 0.5) * 10;
    idx++;
  }
  return arr;
}

/* ── 2. UNDERSTAND: Pulsing Sphere ── */
function buildSphereTargets() {
  const arr = new Float32Array(COUNT * 3);
  const R = 7.0;
  for (let i = 0; i < COUNT; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    arr[i * 3] = R * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = R * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = R * Math.cos(phi);
  }
  return arr;
}

/* ── 3. INDUSTRY: Solar System ── */
function buildSolarTargets() {
  const arr = new Float32Array(COUNT * 3);
  const bodies = [
    { n: 900, r: 2.2, d: 0, s: 0 },
    { n: 500, r: 0.7, d: 6.0, s: 1.0 },
    { n: 600, r: 0.9, d: 10.0, s: 0.65 },
    { n: 600, r: 1.1, d: 14.0, s: 0.4 },
    { n: 600, r: 0.6, d: 17.5, s: 0.22 }
  ];
  let idx = 0;
  bodies.forEach((b) => {
    for (let i = 0; i < b.n; i++) {
      if (idx >= COUNT) break;
      const phi = Math.acos(1 - 2 * (i + 0.5) / b.n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr[idx * 3] = b.r * Math.sin(phi) * Math.cos(theta);
      arr[idx * 3 + 1] = b.r * Math.sin(phi) * Math.sin(theta);
      arr[idx * 3 + 2] = b.r * Math.cos(phi);
      idx++;
    }
  });
  return arr;
}

const LENS_COLORS = {
  build: [0.23, 0.51, 0.96],
  understand: [0.85, 0.27, 0.94],
  industry: [0.06, 0.73, 0.51],
};
const DEFAULT_COLOR = [0.65, 0.68, 0.95];

const ParticleField = ({ activeLens, scrollRef }) => {
  const { viewport } = useThree();
  const pointsRef = useRef();

  const posArr = useMemo(() => new Float32Array(COUNT * 3), []);
  const colArr = useMemo(() => new Float32Array(COUNT * 3), []);
  const waveArr = useMemo(() => new Float32Array(COUNT * 3), []);
  const velArr = useMemo(() => new Float32Array(COUNT * 3), []);
  const phaseArr = useMemo(() => new Float32Array(COUNT), []);

  const targets = useMemo(() => ({
    build: buildCubeTargets(),
    understand: buildSphereTargets(),
    industry: buildSolarTargets()
  }), []);

  useEffect(() => {
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      // Stable wave base below center
      const x = (t * 2 - 1) * 26;
      const y = Math.sin(t * Math.PI * 1.8) * 4.5 - 2.5; // Offset lower
      waveArr[i * 3] = x; waveArr[i * 3 + 1] = y; waveArr[i * 3 + 2] = (Math.random() - 0.5) * 12;
      posArr[i * 3] = waveArr[i * 3]; posArr[i * 3 + 1] = waveArr[i * 3 + 1]; posArr[i * 3 + 2] = waveArr[i * 3 + 2];
      colArr[i * 3] = DEFAULT_COLOR[0]; colArr[i * 3 + 1] = DEFAULT_COLOR[1]; colArr[i * 3 + 2] = DEFAULT_COLOR[2];
      phaseArr[i] = Math.random() * Math.PI * 2;
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime(), { mouse } = state, scroll = scrollRef?.current ?? 0;
    const mx = (mouse.x * viewport.width) / 2, my = (mouse.y * viewport.height) / 2;
    const targetColor = activeLens ? LENS_COLORS[activeLens] : DEFAULT_COLOR;
    const lerp = activeLens ? 0.05 : 0.018;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3, ph = phaseArr[i];
      let px = posArr[i3], py = posArr[i3 + 1], pz = posArr[i3 + 2], tx, ty, tz;

      if (activeLens === 'build') {
        const sx = targets.build[i3], sy = targets.build[i3 + 1], sz = targets.build[i3 + 2];
        const rotY = t * 0.45;
        const rotX = Math.PI * 0.2; // ~35deg X for isometric feel

        // Microwave rotation (Isometric Projection Approximation)
        let rx = sx * Math.cos(rotY) - sz * Math.sin(rotY);
        let rz = sx * Math.sin(rotY) + sz * Math.cos(rotY);
        let ry = sy;

        // Apply X tilt
        tx = rx;
        ty = ry * Math.cos(rotX) - rz * Math.sin(rotX);
        tz = ry * Math.sin(rotX) + rz * Math.cos(rotX);

      } else if (activeLens === 'understand') {
        const sx = targets.understand[i3], sy = targets.understand[i3 + 1], sz = targets.understand[i3 + 2];
        const dist = Math.sqrt(sx * sx + sy * sy + sz * sz);
        const wave = Math.sin(dist * 0.85 - t * 4.2) * 0.55;
        tx = (sx + sx / dist * wave); ty = (sy + sy / dist * wave); tz = (sz + sz / dist * wave);
      } else if (activeLens === 'industry') {
        const sx = targets.industry[i3], sy = targets.industry[i3 + 1], sz = targets.industry[i3 + 2];
        let bodyIdx = 0;
        if (i < 900) bodyIdx = 0; else if (i < 1400) bodyIdx = 1; else if (i < 2000) bodyIdx = 2; else if (i < 2600) bodyIdx = 3; else bodyIdx = 4;
        const b = [{ d: 0, s: 0 }, { d: 6.5, s: 1.1 }, { d: 10.5, s: 0.7 }, { d: 15, s: 0.45 }, { d: 19.5, s: 0.25 }][bodyIdx];
        const rot = t * b.s;
        tx = Math.cos(rot) * b.d + sx; ty = sy; tz = Math.sin(rot) * b.d + sz;
      } else {
        // IDLE: Wave lower with cursor flux
        tx = waveArr[i3] + Math.sin(t * 0.5 + ph) * 1.0;
        ty = waveArr[i3 + 1] + Math.cos(t * 0.6 + ph) * 1.0;
        tz = waveArr[i3 + 2] + Math.sin(t * 0.4 + ph) * 1.0;
      }

      // Apply cursor influence to all states
      const dx = mx - tx, dy = my - ty;
      const distSq = dx * dx + dy * dy;
      if (distSq < 130) { // Large influence area
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / 11.5) * 0.75; // Strong visible attraction
        tx += dx * force;
        ty += dy * force;
      }

      px += (tx - px) * lerp; py += (ty - py) * lerp; pz += (tz - pz) * lerp;
      if (scroll > 0) { velArr[i3 + 1] -= scroll * 0.065; py += velArr[i3 + 1]; } else { velArr[i3 + 1] *= 0.88; }
      posArr[i3] = px; posArr[i3 + 2] = pz; posArr[i3 + 1] = py;
      colArr[i3] += (targetColor[0] - colArr[i3]) * 0.04; colArr[i3 + 1] += (targetColor[1] - colArr[i3 + 1]) * 0.04; colArr[i3 + 2] += (targetColor[2] - colArr[i3 + 2]) * 0.04;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={posArr} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colArr} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

export default ParticleField;
