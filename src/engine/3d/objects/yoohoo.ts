// src/engine/3d/objects/yoohoo.ts — Yoo-hoo chocolate drink bottle
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createYoohoo(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [4, 1.4, 0.3];

  // Bottle body — dark brown glass, wider at bottom, narrower at top
  const bodyGeo = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0, -0.4),      // bottom center
      new THREE.Vector2(0.13, -0.4),    // bottom edge
      new THREE.Vector2(0.14, -0.38),   // bottom corner
      new THREE.Vector2(0.14, 0.0),     // body straight
      new THREE.Vector2(0.13, 0.05),    // shoulder start
      new THREE.Vector2(0.09, 0.15),    // neck taper
      new THREE.Vector2(0.07, 0.25),    // neck
      new THREE.Vector2(0.07, 0.35),    // neck top
      new THREE.Vector2(0.08, 0.36),    // lip flare
      new THREE.Vector2(0.08, 0.38),    // lip top
      new THREE.Vector2(0.06, 0.38),    // inner lip
    ],
    24
  );
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x3a2010,
    roughness: 0.15,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  group.add(body);

  // Yellow label (the signature Yoo-hoo yellow)
  const labelGeo = new THREE.CylinderGeometry(0.145, 0.145, 0.32, 24, 1, true);
  const labelMat = new THREE.MeshStandardMaterial({
    color: 0xFFCC00,
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.set(0, -0.15, 0);
  group.add(label);

  // Cap (yellow twist-off)
  const capGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.08, 12);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xFFCC00,
    roughness: 0.3,
    metalness: 0.4,
  });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.set(0, 0.42, 0);
  group.add(cap);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'yoohoo', group };
}
