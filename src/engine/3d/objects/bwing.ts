// src/engine/3d/objects/bwing.ts — B-wing starfighter model on display stand (3D geometry)
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createBwing(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [4.5, 6.2, -2.8];

  const hullMat = new THREE.MeshStandardMaterial({ color: 0x808888, roughness: 0.45, metalness: 0.5 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.5, metalness: 0.4 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.5, metalness: 0.3 });
  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x4488cc,
    emissive: 0x224466,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.6,
  });

  const ship = new THREE.Group();

  // Main cockpit pod (elongated capsule)
  const cockpitGeo = new THREE.CapsuleGeometry(0.06, 0.3, 6, 12);
  const cockpit = new THREE.Mesh(cockpitGeo, hullMat);
  cockpit.rotation.z = Math.PI / 2;
  cockpit.castShadow = true;
  ship.add(cockpit);

  // Cockpit canopy (small glass dome)
  const canopyMat = new THREE.MeshPhysicalMaterial({
    color: 0x88aacc,
    roughness: 0.05,
    metalness: 0.0,
    transparent: true,
    opacity: 0.5,
    clearcoat: 1.0,
  });
  const canopyGeo = new THREE.SphereGeometry(0.05, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0.12, 0.04, 0);
  canopy.rotation.z = -Math.PI / 4;
  ship.add(canopy);

  // Main wing blade (long flat slab, the iconic vertical wing)
  const wingGeo = new THREE.BoxGeometry(0.02, 0.7, 0.08);
  const wing = new THREE.Mesh(wingGeo, hullMat);
  wing.position.set(0, 0.3, 0);
  wing.castShadow = true;
  ship.add(wing);

  // Wing tip engine pods (top and bottom of the long wing)
  for (const yOff of [0.65, -0.05]) {
    const podGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.1, 8);
    const pod = new THREE.Mesh(podGeo, darkMat);
    pod.position.set(0, yOff, 0);
    pod.rotation.x = Math.PI / 2;
    ship.add(pod);

    // Engine glow
    const glowGeo = new THREE.CircleGeometry(0.025, 8);
    const glow = new THREE.Mesh(glowGeo, engineMat);
    glow.position.set(0, yOff, -0.05);
    ship.add(glow);
  }

  // Cross-foils (secondary wings, shorter horizontal)
  for (const side of [-1, 1]) {
    const foilGeo = new THREE.BoxGeometry(0.25, 0.015, 0.04);
    const foil = new THREE.Mesh(foilGeo, hullMat);
    foil.position.set(side * 0.13, 0.35, 0);
    ship.add(foil);
  }

  // Weapon cannon (thin barrel at cockpit front)
  const barrelGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
  const barrel = new THREE.Mesh(barrelGeo, darkMat);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0.22, 0, 0);
  ship.add(barrel);

  // Red accent stripe along wing
  const stripeGeo = new THREE.BoxGeometry(0.005, 0.5, 0.025);
  const stripe = new THREE.Mesh(stripeGeo, redMat);
  stripe.position.set(0.012, 0.3, 0);
  ship.add(stripe);

  // Tilt the ship slightly for dynamic display pose
  ship.rotation.set(0.15, 0.3, -0.1);
  ship.position.set(0, 0.15, 0);
  group.add(ship);

  // Display stand base (clear acrylic look)
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });
  const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.05, 16);
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(0, -0.6, 0);
  base.castShadow = true;
  group.add(base);

  // Stand rod (thin metal)
  const rodMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.7 });
  const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.6, 6);
  const rod = new THREE.Mesh(rodGeo, rodMat);
  rod.position.set(0, -0.28, 0);
  group.add(rod);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'bwing', group };
}
