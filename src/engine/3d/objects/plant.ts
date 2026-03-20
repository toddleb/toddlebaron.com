// src/engine/3d/objects/plant.ts — Potted succulent (textured plane)
import * as THREE from 'three';
import * as mat from '../materials';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createPlant(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [-4, 2.2, 0.5];

  const texLoader = new THREE.TextureLoader();
  const tex = texLoader.load('/plant.png');

  // Use a plane instead of Sprite so it doesn't billboard weirdly
  const planeGeo = new THREE.PlaneGeometry(1.6, 2.0);
  const planeMat = new THREE.MeshStandardMaterial({
    map: tex,
    transparent: true,
    alphaTest: 0.1,
    side: THREE.DoubleSide,
    roughness: 0.8,
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.castShadow = true;
  group.add(plane);

  // Small terracotta pot base (3D geometry for grounding)
  const potGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.25, 12);
  const potMesh = new THREE.Mesh(potGeo, mat.pot);
  potMesh.position.set(0, -0.85, 0.05);
  potMesh.castShadow = true;
  group.add(potMesh);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'plant', group };
}
