// src/engine/3d/objects/mouse.ts — Classic ball mouse with cord
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createMouse(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [3, 1.05, 1.5];

  const beigeMat = new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.6, metalness: 0.05 });
  const btnMat = new THREE.MeshStandardMaterial({ color: 0xc0b8a8, roughness: 0.5, metalness: 0.08 });

  // Mouse body (egg-shaped via scaled sphere)
  const bodyGeo = new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const body = new THREE.Mesh(bodyGeo, beigeMat);
  body.scale.set(1, 0.5, 1.3);
  body.rotation.x = -0.1;
  body.castShadow = true;
  group.add(body);

  // Flat bottom
  const bottomGeo = new THREE.CircleGeometry(0.25, 16);
  const bottomMat = new THREE.MeshStandardMaterial({ color: 0x888880, roughness: 0.9 });
  const bottom = new THREE.Mesh(bottomGeo, bottomMat);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.set(0, -0.01, 0);
  bottom.scale.set(1, 1.3, 1);
  group.add(bottom);

  // Button divider line
  const dividerGeo = new THREE.BoxGeometry(0.005, 0.02, 0.2);
  const dividerMat = new THREE.MeshStandardMaterial({ color: 0x888078, roughness: 0.7 });
  const divider = new THREE.Mesh(dividerGeo, dividerMat);
  divider.position.set(0, 0.11, -0.08);
  group.add(divider);

  // Mouse cord
  const cableMat = new THREE.MeshStandardMaterial({ color: 0xc0b8a8, roughness: 0.8 });
  // Curved cord using a tube
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0.05, -0.3),
    new THREE.Vector3(0, 0.02, -0.8),
    new THREE.Vector3(-0.3, 0.01, -1.2),
    new THREE.Vector3(-0.2, 0.01, -1.8),
  );
  const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.02, 6, false);
  const cord = new THREE.Mesh(tubeGeo, cableMat);
  cord.castShadow = true;
  group.add(cord);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'mouse', group };
}
