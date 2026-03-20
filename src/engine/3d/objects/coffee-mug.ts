// src/engine/3d/objects/coffee-mug.ts — Ceramic coffee mug with handle
import * as THREE from 'three';
import type { DeskObject, DeskObjectOptions } from '../types';

export function createCoffeeMug(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [-3.5, 1.25, 0.8];

  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0xe8e0d4,
    roughness: 0.4,
    metalness: 0.02,
  });

  // Mug body (lathe profile)
  const mugProfile = [
    new THREE.Vector2(0, -0.2),       // bottom center
    new THREE.Vector2(0.15, -0.2),     // bottom edge
    new THREE.Vector2(0.16, -0.18),    // bottom bevel
    new THREE.Vector2(0.17, 0.0),      // lower body
    new THREE.Vector2(0.18, 0.15),     // upper body (slight taper out)
    new THREE.Vector2(0.19, 0.2),      // rim flare
    new THREE.Vector2(0.185, 0.22),    // rim top
    new THREE.Vector2(0.16, 0.22),     // inner rim
    new THREE.Vector2(0.15, 0.18),     // inner wall start
    new THREE.Vector2(0.14, -0.05),    // inner wall
    new THREE.Vector2(0.0, -0.05),     // inner bottom
  ];
  const mugGeo = new THREE.LatheGeometry(mugProfile, 24);
  const mug = new THREE.Mesh(mugGeo, ceramicMat);
  mug.castShadow = true;
  group.add(mug);

  // Handle (torus arc)
  const handleCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.18, 0.12, 0),
    new THREE.Vector3(0.32, 0.12, 0),
    new THREE.Vector3(0.32, -0.12, 0),
    new THREE.Vector3(0.18, -0.12, 0),
  );
  const handleGeo = new THREE.TubeGeometry(handleCurve, 12, 0.02, 6, false);
  const handle = new THREE.Mesh(handleGeo, ceramicMat);
  handle.castShadow = true;
  group.add(handle);

  // Coffee inside (dark liquid surface)
  const coffeeMat = new THREE.MeshStandardMaterial({
    color: 0x2a1808,
    roughness: 0.1,
    metalness: 0.0,
  });
  const coffeeGeo = new THREE.CircleGeometry(0.145, 16);
  const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.set(0, 0.18, 0);
  group.add(coffee);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'coffee-mug', group };
}
