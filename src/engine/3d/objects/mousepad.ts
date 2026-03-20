// src/engine/3d/objects/mousepad.ts — Dark mousepad with stitched edge
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createMousepad(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [3.2, 1.02, 1.3];

  // Pad surface (soft rubber)
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    roughness: 0.92,
    metalness: 0.0,
  });
  const padGeo = new THREE.BoxGeometry(1.8, 0.02, 1.4);
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.receiveShadow = true;
  group.add(pad);

  // Stitched edge (thin bright border)
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.8 });
  // Front edge
  group.add(makeEdge(1.8, 0.04, 0.02, 0, 0.01, 0.69, edgeMat));
  // Back edge
  group.add(makeEdge(1.8, 0.04, 0.02, 0, 0.01, -0.69, edgeMat));
  // Left edge
  group.add(makeEdge(0.02, 0.04, 1.38, -0.89, 0.01, 0, edgeMat));
  // Right edge
  group.add(makeEdge(0.02, 0.04, 1.38, 0.89, 0.01, 0, edgeMat));

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'mousepad', group };
}

function makeEdge(
  w: number, h: number, d: number,
  x: number, y: number, z: number,
  mat: THREE.Material
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  return mesh;
}
