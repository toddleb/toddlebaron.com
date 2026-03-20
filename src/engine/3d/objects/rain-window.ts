// src/engine/3d/objects/rain-window.ts — Window with rain streaks and lightning
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createRainWindow(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [5.5, 5.5, -2.9];

  // Window frame (dark charcoal, slightly weathered)
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.55,
    metalness: 0.35,
  });

  // Outer frame (thicker)
  const frameGeo = new THREE.BoxGeometry(3.0, 4.0, 0.18);
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.castShadow = true;
  group.add(frame);

  // Inner frame recess (dark depth)
  const recessGeo = new THREE.BoxGeometry(2.6, 3.6, 0.1);
  const recessMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.9 });
  const recess = new THREE.Mesh(recessGeo, recessMat);
  recess.position.set(0, 0, 0.05);
  group.add(recess);

  // Glass pane (rainy, semi-transparent)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x3a5570,
    roughness: 0.15,
    metalness: 0.0,
    transparent: true,
    opacity: 0.25,
    transmission: 0.7,
    thickness: 0.15,
    ior: 1.52,
    clearcoat: 0.3,
  });
  const glassGeo = new THREE.PlaneGeometry(2.5, 3.5);
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 0, 0.09);
  group.add(glass);

  // Cross bars (centered)
  const hBarGeo = new THREE.BoxGeometry(2.5, 0.1, 0.14);
  const hBar = new THREE.Mesh(hBarGeo, frameMat);
  hBar.position.set(0, 0, 0.09);
  group.add(hBar);

  const vBarGeo = new THREE.BoxGeometry(0.1, 3.5, 0.14);
  const vBar = new THREE.Mesh(vBarGeo, frameMat);
  vBar.position.set(0, 0, 0.09);
  group.add(vBar);

  // Window sill
  const sillGeo = new THREE.BoxGeometry(3.2, 0.08, 0.3);
  const sillMat = new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.7 });
  const sill = new THREE.Mesh(sillGeo, sillMat);
  sill.position.set(0, -2.05, 0.15);
  sill.castShadow = true;
  group.add(sill);

  // Light from outside (cool daylight)
  const windowLight = new THREE.RectAreaLight(0x7a9ab8, 2.5, 2.4, 3.4);
  windowLight.position.set(0, 0, 0.12);
  group.add(windowLight);

  // Rain drops — elongated streaks instead of spheres
  const drops: THREE.Mesh[] = [];
  const dropGeo = new THREE.CylinderGeometry(0.008, 0.004, 0.1, 4);
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0xaaddff,
    transparent: true,
    opacity: 0.4,
    roughness: 0.0,
    transmission: 0.9,
    thickness: 0.05,
  });

  for (let i = 0; i < 60; i++) {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 3.4,
      0.1 + Math.random() * 0.02
    );
    drop.userData.speed = 2.0 + Math.random() * 3;
    drop.userData.drift = (Math.random() - 0.5) * 0.3;
    drop.scale.y = 0.5 + Math.random() * 1.5;
    group.add(drop);
    drops.push(drop);
  }

  // Condensation drops (static, on glass surface)
  const condGeo = new THREE.SphereGeometry(0.01, 4, 4);
  const condMat = new THREE.MeshPhysicalMaterial({
    color: 0xccddee,
    transparent: true,
    opacity: 0.2,
    roughness: 0.0,
    transmission: 0.95,
  });
  for (let i = 0; i < 30; i++) {
    const cond = new THREE.Mesh(condGeo, condMat);
    cond.position.set(
      (Math.random() - 0.5) * 2.3,
      (Math.random() - 0.5) * 3.3,
      0.1
    );
    cond.scale.setScalar(0.5 + Math.random() * 2);
    group.add(cond);
  }

  // Lightning flash light (starts off, flashes occasionally)
  const lightning = new THREE.PointLight(0xeeeeff, 0, 15);
  lightning.position.set(0, 1, 0.5);
  group.add(lightning);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  let nextFlash = 3 + Math.random() * 8;
  let flashTimer = 0;
  let flashPhase = 0;

  function update(delta: number, elapsed: number): void {
    // Animate rain drops
    for (const drop of drops) {
      drop.position.y -= drop.userData.speed * delta;
      drop.position.x += drop.userData.drift * delta;
      if (drop.position.y < -1.7) {
        drop.position.y = 1.7;
        drop.position.x = (Math.random() - 0.5) * 2.4;
        drop.userData.drift = (Math.random() - 0.5) * 0.3;
      }
    }

    // Lightning flashes
    flashTimer += delta;
    if (flashTimer > nextFlash) {
      flashPhase = 0.3; // start flash
      flashTimer = 0;
      nextFlash = 5 + Math.random() * 12;
    }
    if (flashPhase > 0) {
      flashPhase -= delta * 3;
      // Double flash effect
      const intensity = flashPhase > 0.15
        ? Math.sin(flashPhase * 30) * 4
        : flashPhase * 10;
      lightning.intensity = Math.max(0, intensity);
    } else {
      lightning.intensity = 0;
    }
  }

  return { name: 'rain-window', group, update };
}
