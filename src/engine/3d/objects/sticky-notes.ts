// src/engine/3d/objects/sticky-notes.ts — Pad of sticky notes with a loose one
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createStickyNotes(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [-2.5, 1.05, 1.0];

  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xffee70,
    roughness: 0.85,
    metalness: 0.0,
  });
  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xffaacc,
    roughness: 0.85,
    metalness: 0.0,
  });

  // Sticky note pad (stack)
  const padGeo = new THREE.BoxGeometry(0.5, 0.06, 0.5);
  const pad = new THREE.Mesh(padGeo, yellowMat);
  pad.castShadow = true;
  pad.receiveShadow = true;
  group.add(pad);

  // Loose note (slightly rotated, peeling)
  const noteGeo = new THREE.PlaneGeometry(0.48, 0.48);
  const looseNote = new THREE.Mesh(noteGeo, pinkMat);
  looseNote.position.set(0.3, 0.035, 0.2);
  looseNote.rotation.x = -Math.PI / 2;
  looseNote.rotation.z = 0.25;
  looseNote.castShadow = true;
  group.add(looseNote);

  // Pen marks on the loose note (tiny dark lines)
  const inkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  for (let i = 0; i < 4; i++) {
    const lineGeo = new THREE.BoxGeometry(0.25 - i * 0.04, 0.001, 0.008);
    const line = new THREE.Mesh(lineGeo, inkMat);
    line.position.set(0.3 - 0.02, 0.036, 0.1 + i * 0.06);
    line.rotation.y = 0.25;
    group.add(line);
  }

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'sticky-notes', group };
}
