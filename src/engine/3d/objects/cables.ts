// src/engine/3d/objects/cables.ts — Desk cables (power, serial, phone line)
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

function makeCable(
  points: THREE.Vector3[],
  color: number,
  radius = 0.025
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 20, radius, 6, false);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function createCables(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 0, 0];

  // Monitor power cable (from back of monitor, droops down to desk, trails off right)
  group.add(makeCable([
    new THREE.Vector3(0, 2.6, -2.1),      // monitor back
    new THREE.Vector3(0.3, 2.2, -2.3),    // droop
    new THREE.Vector3(0.8, 1.1, -2.4),    // desk level
    new THREE.Vector3(2.5, 1.05, -2.3),   // along desk
    new THREE.Vector3(4.5, 1.0, -2.5),    // toward wall
  ], 0x1a1a1a, 0.03));

  // Serial cable (computer to modem — short)
  group.add(makeCable([
    new THREE.Vector3(-1.5, 1.35, -1.8),   // computer back
    new THREE.Vector3(-1.8, 1.2, -1.9),    // slight sag
    new THREE.Vector3(-1.5, 0.98, -1.8),   // modem back
  ], 0xc8c0b0, 0.02));

  // Phone line (from modem to wall — thin)
  group.add(makeCable([
    new THREE.Vector3(1.5, 0.95, -1.8),    // modem back
    new THREE.Vector3(2.0, 0.9, -2.2),     // sag
    new THREE.Vector3(3.0, 0.95, -2.6),    // along wall
    new THREE.Vector3(4.0, 1.5, -2.9),     // up wall
    new THREE.Vector3(4.5, 2.5, -2.95),    // wall plate
  ], 0xc8c0a0, 0.012));

  group.position.set(px, py, pz);
  return { name: 'cables', group };
}
