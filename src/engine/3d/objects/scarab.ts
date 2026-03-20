// src/engine/3d/objects/scarab.ts — Animated scarab beetle with iridescent shell
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createScarab(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [5.5, 0.92, 1.0];

  // Iridescent shell material (shifts hue in update)
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a4a6a,
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    iridescence: 1.0,
    iridescenceIOR: 1.8,
    iridescenceThicknessRange: [200, 600],
    envMapIntensity: 2.0,
  });

  // Thorax (main body — elongated dome)
  const thoraxGeo = new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  thoraxGeo.scale(1, 0.55, 1.4);
  const thorax = new THREE.Mesh(thoraxGeo, shellMat);
  thorax.castShadow = true;
  group.add(thorax);

  // Wing seam (dark line down center of shell)
  const seamGeo = new THREE.BoxGeometry(0.003, 0.02, 0.28);
  const seamMat = new THREE.MeshStandardMaterial({ color: 0x050a10, roughness: 0.9 });
  const seam = new THREE.Mesh(seamGeo, seamMat);
  seam.position.set(0, 0.06, -0.02);
  group.add(seam);

  // Pronotum (shield piece between head and wings)
  const pronotumGeo = new THREE.SphereGeometry(0.08, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
  pronotumGeo.scale(1.1, 0.5, 0.8);
  const pronotum = new THREE.Mesh(pronotumGeo, shellMat);
  pronotum.position.set(0, 0.01, 0.12);
  group.add(pronotum);

  // Head (smaller, darker)
  const headMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1520,
    roughness: 0.2,
    metalness: 0.7,
    clearcoat: 0.8,
  });
  const headGeo = new THREE.SphereGeometry(0.05, 12, 10);
  headGeo.scale(1, 0.7, 1);
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, -0.01, 0.18);
  head.castShadow = true;
  group.add(head);

  // Mandibles
  const mandibleMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.4, metalness: 0.6 });
  for (const side of [-1, 1]) {
    const mandGeo = new THREE.CylinderGeometry(0.006, 0.003, 0.06, 4);
    const mand = new THREE.Mesh(mandGeo, mandibleMat);
    mand.position.set(side * 0.025, -0.02, 0.22);
    mand.rotation.x = -Math.PI / 3;
    mand.rotation.z = side * 0.3;
    group.add(mand);
  }

  // Antennae (curved, segmented)
  for (const side of [-1, 1]) {
    const antCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(side * 0.03, 0.01, 0.2),
      new THREE.Vector3(side * 0.08, 0.04, 0.24),
      new THREE.Vector3(side * 0.1, 0.02, 0.28),
    );
    const antGeo = new THREE.TubeGeometry(antCurve, 8, 0.004, 4, false);
    const ant = new THREE.Mesh(antGeo, mandibleMat);
    group.add(ant);
    // Club tip
    const clubGeo = new THREE.SphereGeometry(0.008, 6, 6);
    const club = new THREE.Mesh(clubGeo, mandibleMat);
    club.position.set(side * 0.1, 0.02, 0.28);
    group.add(club);
  }

  // Legs (6, jointed with thigh + shin segments)
  const legMat = new THREE.MeshStandardMaterial({ color: 0x0a1520, roughness: 0.4, metalness: 0.5 });
  const legPairs: [number, number][] = [[-0.08, 0.1], [-0.02, 0], [0.04, -0.1]];
  const legs: THREE.Group[] = [];

  for (const [lz, angle] of legPairs) {
    for (const side of [-1, 1]) {
      const legGroup = new THREE.Group();
      legGroup.position.set(side * 0.1, -0.02, lz);

      // Coxa (thigh)
      const coxaGeo = new THREE.CylinderGeometry(0.008, 0.006, 0.08, 4);
      const coxa = new THREE.Mesh(coxaGeo, legMat);
      coxa.rotation.z = side * 0.9;
      coxa.rotation.y = angle * 0.5;
      coxa.position.set(side * 0.03, -0.02, 0);
      legGroup.add(coxa);

      // Tibia (shin)
      const tibiaGeo = new THREE.CylinderGeometry(0.005, 0.004, 0.07, 4);
      const tibia = new THREE.Mesh(tibiaGeo, legMat);
      tibia.rotation.z = side * 0.3;
      tibia.position.set(side * 0.07, -0.05, 0);
      legGroup.add(tibia);

      // Tarsus (foot tip)
      const tarGeo = new THREE.SphereGeometry(0.005, 4, 4);
      const tar = new THREE.Mesh(tarGeo, legMat);
      tar.position.set(side * 0.09, -0.07, 0);
      legGroup.add(tar);

      group.add(legGroup);
      legs.push(legGroup);
    }
  }

  // Eyes (tiny glossy spheres)
  const eyeMat = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.0,
    metalness: 1.0,
    clearcoat: 1.0,
  });
  for (const side of [-1, 1]) {
    const eyeGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(side * 0.03, 0.01, 0.2);
    group.add(eye);
  }

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale ?? 1);

  // Crawl animation with leg movement
  let crawlX = px;
  const crawlSpeed = 0.08;
  const crawlRange = 2;
  let direction = 1;

  function update(delta: number, elapsed: number): void {
    crawlX += crawlSpeed * delta * direction;
    if (crawlX > px + crawlRange || crawlX < px - crawlRange) {
      direction *= -1;
      group.rotation.y = direction > 0 ? 0 : Math.PI;
    }
    group.position.x = crawlX;
    // Subtle bobbing
    group.position.y = py + Math.sin(elapsed * 3) * 0.004;

    // Leg walking cycle
    for (let i = 0; i < legs.length; i++) {
      const phase = (i % 2 === 0) ? 0 : Math.PI;
      const legAngle = Math.sin(elapsed * 8 + phase + i * 0.8) * 0.15;
      legs[i].rotation.x = legAngle;
    }

    // Iridescence color shift based on camera angle (simulated)
    const hueShift = Math.sin(elapsed * 0.5) * 0.15 + 0.5;
    shellMat.color.setHSL(hueShift * 0.2 + 0.5, 0.6, 0.25);
  }

  return { name: 'scarab', group, update };
}
