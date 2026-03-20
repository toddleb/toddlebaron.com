// src/engine/3d/objects/room.ts — Room environment (walls, desk, floor)
import * as THREE from 'three';
import * as mat from '../materials';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createRoom(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();

  // ─── Upper Wall (gray-violet wallpaper) ───
  const wallGeo = new THREE.PlaneGeometry(18, 6);
  const wallMesh = new THREE.Mesh(wallGeo, mat.wall);
  wallMesh.position.set(0, 6.0, -3);
  wallMesh.receiveShadow = true;
  group.add(wallMesh);

  // Shelf divider (thin strip between upper and lower wall)
  const dividerGeo = new THREE.BoxGeometry(18, 0.08, 0.12);
  const dividerMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.6 });
  const divider = new THREE.Mesh(dividerGeo, dividerMat);
  divider.position.set(0, 3.0, -2.95);
  divider.castShadow = true;
  group.add(divider);

  // ─── Lower Wall (painted brick) ───
  const brickGeo = new THREE.PlaneGeometry(18, 4);
  const brickMesh = new THREE.Mesh(brickGeo, mat.brick);
  brickMesh.position.set(0, 1.5, -3);
  brickMesh.receiveShadow = true;
  group.add(brickMesh);

  // ─── Desk Surface ───
  const deskGeo = new THREE.BoxGeometry(14, 0.22, 4.5);
  const deskMesh = new THREE.Mesh(deskGeo, mat.deskWood);
  deskMesh.position.set(0, 0.9, -0.25);
  deskMesh.receiveShadow = true;
  deskMesh.castShadow = true;
  group.add(deskMesh);

  // Desk front edge (rounded bullnose)
  const edgeGeo = new THREE.BoxGeometry(14, 0.28, 0.2);
  const edgeMesh = new THREE.Mesh(edgeGeo, mat.deskEdge);
  edgeMesh.position.set(0, 0.87, 1.55);
  edgeMesh.castShadow = true;
  group.add(edgeMesh);

  // ─── Floor ───
  const floorGeo = new THREE.PlaneGeometry(18, 10);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x3a2a1a,
    roughness: 0.8,
    metalness: 0.0,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -0.5, 2);
  floor.receiveShadow = true;
  group.add(floor);

  // ─── Ceiling (soft warm light bounce) ───
  const ceilGeo = new THREE.PlaneGeometry(18, 10);
  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e8,
    roughness: 0.9,
    metalness: 0.0,
  });
  const ceil = new THREE.Mesh(ceilGeo, ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, 9, 2);
  group.add(ceil);

  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'room', group };
}
