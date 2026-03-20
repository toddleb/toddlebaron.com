// src/engine/3d/objects/pen-cup.ts — Pen/pencil holder with pens
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createPenCup(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [-4.0, 1.25, -0.5];

  // Cup body (dark metal cylinder)
  const cupMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.4,
    metalness: 0.6,
  });

  const cupProfile = [
    new THREE.Vector2(0, -0.2),
    new THREE.Vector2(0.12, -0.2),
    new THREE.Vector2(0.13, -0.18),
    new THREE.Vector2(0.12, 0.2),
    new THREE.Vector2(0.13, 0.22),
    new THREE.Vector2(0.13, 0.23),
    new THREE.Vector2(0.11, 0.23),
    new THREE.Vector2(0.1, 0.18),
    new THREE.Vector2(0.1, -0.15),
    new THREE.Vector2(0, -0.15),
  ];
  const cupGeo = new THREE.LatheGeometry(cupProfile, 16);
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cup.castShadow = true;
  group.add(cup);

  // Pens and pencils (sticking out at angles)
  const items = [
    { color: 0x1a1a8a, angle: 0.12, rot: 0.3 },    // blue pen
    { color: 0xcc2222, angle: -0.08, rot: -0.5 },   // red pen
    { color: 0xddc040, angle: 0.05, rot: 1.2 },     // yellow pencil
    { color: 0x1a1a1a, angle: -0.15, rot: 2.0 },    // black pen
  ];

  for (const item of items) {
    const penMat = new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.5, metalness: 0.2 });
    const penGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6);
    const pen = new THREE.Mesh(penGeo, penMat);
    pen.position.set(Math.sin(item.rot) * 0.04, 0.3, Math.cos(item.rot) * 0.04);
    pen.rotation.x = item.angle;
    pen.rotation.z = item.angle * 0.5;
    group.add(pen);

    // Pen tip/clip
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.3 });
    const tipGeo = new THREE.ConeGeometry(0.015, 0.04, 6);
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.copy(pen.position);
    tip.position.y += 0.27;
    tip.rotation.copy(pen.rotation);
    group.add(tip);
  }

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'pen-cup', group };
}
