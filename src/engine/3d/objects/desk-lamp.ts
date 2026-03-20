// src/engine/3d/objects/desk-lamp.ts — Banker's lamp with green glass shade
import * as THREE from 'three';
import * as mat from '../materials';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createDeskLamp(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [-4.5, 1.0, 0];

  // Heavy weighted base (two-tier for realism)
  const baseLowerGeo = new THREE.CylinderGeometry(0.65, 0.72, 0.06, 32);
  const baseLower = new THREE.Mesh(baseLowerGeo, mat.brass);
  baseLower.castShadow = true;
  baseLower.receiveShadow = true;
  group.add(baseLower);

  const baseUpperGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.05, 32);
  const baseUpper = new THREE.Mesh(baseUpperGeo, mat.brass);
  baseUpper.position.set(0, 0.05, 0);
  group.add(baseUpper);

  // Felt pad on bottom
  const feltGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.01, 16);
  const feltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.98 });
  const felt = new THREE.Mesh(feltGeo, feltMat);
  felt.position.set(0, -0.035, 0);
  group.add(felt);

  // Stem (thicker brass tube with collar)
  const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.2, 12);
  const stem = new THREE.Mesh(stemGeo, mat.brass);
  stem.position.set(0, 2.2, 0);
  stem.castShadow = true;
  group.add(stem);

  // Collar where stem meets base
  const collarGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 12);
  const collar = new THREE.Mesh(collarGeo, mat.brass);
  collar.position.set(0, 0.15, 0);
  group.add(collar);

  // Collar where stem meets shade
  const topCollarGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.12, 12);
  const topCollar = new THREE.Mesh(topCollarGeo, mat.brass);
  topCollar.position.set(0, 4.3, 0);
  group.add(topCollar);

  // Shade (banker's green glass — proper cone taper via LatheGeometry)
  const shadeProfile = [
    new THREE.Vector2(0.12, 0),     // top narrow opening
    new THREE.Vector2(0.14, -0.02),  // top lip
    new THREE.Vector2(0.35, -0.15),  // mid curve
    new THREE.Vector2(0.75, -0.35),  // wide bottom outer
    new THREE.Vector2(0.9, -0.42),   // flared bottom lip
    new THREE.Vector2(0.88, -0.45),  // inner bottom lip
    new THREE.Vector2(0.7, -0.38),   // inner surface
    new THREE.Vector2(0.3, -0.18),   // inner mid
    new THREE.Vector2(0.1, -0.02),   // inner top
  ];
  const shadeGeo = new THREE.LatheGeometry(shadeProfile, 32);
  const shade = new THREE.Mesh(shadeGeo, mat.greenGlass);
  shade.position.set(0, 4.8, 0);
  shade.castShadow = true;
  group.add(shade);

  // Brass rim on shade bottom
  const rimGeo = new THREE.TorusGeometry(0.89, 0.025, 8, 32);
  const rim = new THREE.Mesh(rimGeo, mat.brass);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 4.35, 0);
  group.add(rim);

  // Pull chain (series of small links)
  const chainMat = new THREE.MeshStandardMaterial({ color: 0xb89040, metalness: 0.7, roughness: 0.35 });
  for (let i = 0; i < 8; i++) {
    const linkGeo = new THREE.TorusGeometry(0.02, 0.005, 4, 6);
    const link = new THREE.Mesh(linkGeo, chainMat);
    link.position.set(0.35, 4.0 - i * 0.08, 0);
    link.rotation.y = i % 2 === 0 ? 0 : Math.PI / 2;
    group.add(link);
  }

  // Chain pull ball
  const ballGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const ball = new THREE.Mesh(ballGeo, chainMat);
  ball.position.set(0.35, 3.32, 0);
  group.add(ball);

  // Lamp spotlight (warmer, focused)
  const light = new THREE.SpotLight(0xffe0a0, 3.0, 8, Math.PI / 5, 0.6, 1.5);
  light.position.set(0, 4.3, 0);
  light.target.position.set(0, 0, 0.5);
  light.castShadow = true;
  light.shadow.mapSize.set(512, 512);
  light.shadow.bias = -0.003;
  group.add(light);
  group.add(light.target);

  // Warm glow inside shade (upward bounce)
  const innerGlow = new THREE.PointLight(0xffe8b0, 0.5, 3, 2);
  innerGlow.position.set(0, 4.5, 0);
  group.add(innerGlow);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'desk-lamp', group };
}
