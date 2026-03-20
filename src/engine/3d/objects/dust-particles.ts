// src/engine/3d/objects/dust-particles.ts — Floating dust motes in light beams
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createDustParticles(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 4, 0];
  const count = 80;

  const positions = new Float32Array(count * 3);
  const velocities: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.015,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xffe8c0,
    size: 0.03,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  group.add(points);

  group.position.set(px, py, pz);

  function update(delta: number, _elapsed: number): void {
    const posArr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      posArr[i * 3] += v.x * delta * 10;
      posArr[i * 3 + 1] += v.y * delta * 10;
      posArr[i * 3 + 2] += v.z * delta * 10;

      // Gentle drift bounds
      if (posArr[i * 3] > 5 || posArr[i * 3] < -5) v.x *= -1;
      if (posArr[i * 3 + 1] > 7 || posArr[i * 3 + 1] < 0.5) v.y *= -1;
      if (posArr[i * 3 + 2] > 3 || posArr[i * 3 + 2] < -3) v.z *= -1;
    }
    geo.attributes.position.needsUpdate = true;
  }

  return { name: 'dust-particles', group, update };
}
