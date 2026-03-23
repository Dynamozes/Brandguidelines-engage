import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = ({ count = 2000, mode = 'chaos' }) => {
  const mesh = useRef();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 10;
      const size = Math.random() * 0.05 + 0.01;
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
      temp.push({ x, y, z, size, velocity, originalPos: new THREE.Vector3(x, y, z) });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mouse.current.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2
    );

    particles.forEach((p, i) => {
      let { x, y, z, velocity, originalPos } = p;

      // Chaos motion
      x += velocity.x + Math.sin(time + i) * 0.005;
      y += velocity.y + Math.cos(time + i) * 0.005;
      
      // Gravitational attraction to mouse
      if (mode === 'attract') {
        const dx = mouse.current.x - x;
        const dy = mouse.current.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 5) {
          x += dx * 0.02;
          y += dy * 0.02;
        }
      }

      // System formation (structured mode)
      if (mode === 'system') {
        const targetX = Math.round(originalPos.x / 2) * 2;
        const targetY = Math.round(originalPos.y / 2) * 2;
        x += (targetX - x) * 0.05;
        y += (targetY - y) * 0.05;
      }

      p.x = x;
      p.y = y;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={2} transparent opacity={0.6} />
    </instancedMesh>
  );
};

export default ParticleSystem;
