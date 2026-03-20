// src/engine/3d/objects/keyboard.ts — Classic beige mechanical keyboard
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createKeyboard(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 1.05, 1.2];

  const beigeMat = new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.7, metalness: 0.05 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x888078, roughness: 0.6, metalness: 0.1 });
  const keyMat = new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.55, metalness: 0.05 });
  const keyDarkMat = new THREE.MeshStandardMaterial({ color: 0x666058, roughness: 0.5, metalness: 0.1 });

  // Keyboard case
  const caseGeo = new THREE.BoxGeometry(3.8, 0.12, 1.4);
  const kbCase = new THREE.Mesh(caseGeo, beigeMat);
  kbCase.castShadow = true;
  kbCase.receiveShadow = true;
  group.add(kbCase);

  // Slightly raised back (keyboard angle)
  const backGeo = new THREE.BoxGeometry(3.8, 0.08, 0.3);
  const back = new THREE.Mesh(backGeo, beigeMat);
  back.position.set(0, 0.04, -0.55);
  group.add(back);

  // Key rows (simplified grid of small boxes)
  const keyGeo = new THREE.BoxGeometry(0.14, 0.05, 0.14);
  const spaceGeo = new THREE.BoxGeometry(1.2, 0.05, 0.14);

  // Main key block (5 rows x ~15 keys)
  for (let row = 0; row < 5; row++) {
    const keysInRow = row === 4 ? 10 : 14;
    const rowOffset = row === 4 ? 0.1 : 0;
    for (let col = 0; col < keysInRow; col++) {
      const key = new THREE.Mesh(keyGeo, row === 0 ? keyDarkMat : keyMat);
      key.position.set(
        -1.5 + col * 0.2 + rowOffset,
        0.09,
        -0.4 + row * 0.22
      );
      group.add(key);
    }
  }

  // Space bar
  const space = new THREE.Mesh(spaceGeo, keyMat);
  space.position.set(0, 0.09, 0.5);
  group.add(space);

  // Status LEDs (Num/Caps/Scroll)
  const statusMat = new THREE.MeshStandardMaterial({
    color: 0x33cc33,
    emissive: 0x33cc33,
    emissiveIntensity: 0.6,
  });
  for (let i = 0; i < 3; i++) {
    const statusGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const statusLed = new THREE.Mesh(statusGeo, i === 0 ? statusMat : statusMat.clone());
    statusLed.position.set(1.3 + i * 0.12, 0.08, -0.55);
    if (i > 0) (statusLed.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
    group.add(statusLed);
  }

  // Cable coming from back
  const cableMat = new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.8 });
  const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6);
  const cable = new THREE.Mesh(cableGeo, cableMat);
  cable.rotation.x = Math.PI / 2;
  cable.position.set(0, 0, -1.1);
  group.add(cable);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'keyboard', group };
}
