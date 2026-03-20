// src/engine/3d/objects/power-strip.ts — Power strip on the floor with plugged cables
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createPowerStrip(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [3, -0.22, -2.2];

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c4, roughness: 0.7, metalness: 0.05 });
  const plugMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.3 });

  // Strip body
  const bodyGeo = new THREE.BoxGeometry(2.0, 0.1, 0.35);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Outlet slots (6 outlets)
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 2; j++) {
      const slotGeo = new THREE.BoxGeometry(0.03, 0.04, 0.06);
      const slot = new THREE.Mesh(slotGeo, slotMat);
      slot.position.set(-0.75 + i * 0.3, 0.06, -0.04 + j * 0.08);
      group.add(slot);
    }
  }

  // Plugged-in adapters (2-3 chunky blocks)
  for (let i = 0; i < 3; i++) {
    const adapterGeo = new THREE.BoxGeometry(0.15, 0.12, 0.2);
    const adapter = new THREE.Mesh(adapterGeo, plugMat);
    adapter.position.set(-0.75 + i * 0.6, 0.1, 0);
    group.add(adapter);
  }

  // Power strip's own cord trailing away
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.0, 0, 0),
    new THREE.Vector3(1.4, 0.02, 0.1),
    new THREE.Vector3(1.8, 0, -0.3),
    new THREE.Vector3(2.5, 0.05, -0.5),
  ]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 12, 0.025, 6, false);
  const cordMat = new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.8 });
  const cord = new THREE.Mesh(cordGeo, cordMat);
  group.add(cord);

  // Switch (red rocker)
  const switchMat = new THREE.MeshStandardMaterial({
    color: 0xcc3333,
    emissive: 0x441111,
    emissiveIntensity: 0.3,
    roughness: 0.5,
  });
  const switchGeo = new THREE.BoxGeometry(0.12, 0.04, 0.08);
  const switchBtn = new THREE.Mesh(switchGeo, switchMat);
  switchBtn.position.set(0.85, 0.07, 0);
  group.add(switchBtn);

  // Power LED
  const ledGeo = new THREE.SphereGeometry(0.015, 6, 6);
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0xff4400,
    emissive: 0xff4400,
    emissiveIntensity: 1.0,
  });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(0.85, 0.06, 0.1);
  group.add(led);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'power-strip', group };
}
