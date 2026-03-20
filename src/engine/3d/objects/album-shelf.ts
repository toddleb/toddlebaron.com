// src/engine/3d/objects/album-shelf.ts — Wall shelf with CD jewel cases
import * as THREE from 'three';
import * as mat from '../materials';
import type { DeskObject, DeskObjectOptions } from '../types';

const ALBUMS = [
  '/albums/chicago.jpg',
  '/albums/papa-roach.jpg',
  '/albums/silversun-pickups.jpeg',
  '/albums/linkin-park.jpg',
  '/albums/shinedown.jpg',
  '/albums/halestorm.png',
  '/albums/evanescence.png',
  '/albums/godsmack.png',
  '/albums/fair-to-midland.jpg',
  '/albums/breaking-benjamin.jpg',
];

// Seeded pseudo-random for deterministic slight tilts
function seededRandom(seed: number): number {
  return ((Math.sin(seed * 127.1) * 43758.5453) % 1 + 1) % 1;
}

export function createAlbumShelf(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 5.8, -2.85];
  const texLoader = new THREE.TextureLoader();

  // Shelf board (thicker, with edge detail)
  const shelfGeo = new THREE.BoxGeometry(10, 0.12, 0.55);
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.6, metalness: 0.02 });
  const shelf = new THREE.Mesh(shelfGeo, shelfMat);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  group.add(shelf);

  // Shelf front lip (thin raised strip)
  const lipGeo = new THREE.BoxGeometry(10, 0.04, 0.06);
  const lip = new THREE.Mesh(lipGeo, shelfMat);
  lip.position.set(0, 0.08, 0.25);
  group.add(lip);

  // L-bracket supports
  const bracketMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.6 });
  for (const bx of [-3.5, 3.5]) {
    const armGeo = new THREE.BoxGeometry(0.06, 0.04, 0.4);
    const arm = new THREE.Mesh(armGeo, bracketMat);
    arm.position.set(bx, -0.08, 0.05);
    group.add(arm);
    const legGeo = new THREE.BoxGeometry(0.06, 0.35, 0.04);
    const leg = new THREE.Mesh(legGeo, bracketMat);
    leg.position.set(bx, -0.25, -0.15);
    group.add(leg);
  }

  // Jewel case material (translucent plastic)
  const caseMat = new THREE.MeshPhysicalMaterial({
    color: 0xd8d8d8,
    roughness: 0.15,
    metalness: 0.0,
    transparent: true,
    opacity: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
  });

  // Album jewel cases (3D boxes with cover art on front)
  const albumSize = 0.85;
  const caseDepth = 0.08;
  const spacing = 0.95;
  const startX = -((ALBUMS.length - 1) * spacing) / 2;

  for (let i = 0; i < ALBUMS.length; i++) {
    const caseGroup = new THREE.Group();
    const cx = startX + i * spacing;

    // Jewel case body (thin box)
    const jewelGeo = new THREE.BoxGeometry(albumSize, albumSize, caseDepth);
    const jewel = new THREE.Mesh(jewelGeo, caseMat);
    jewel.castShadow = true;
    caseGroup.add(jewel);

    // Front cover art
    const coverTex = texLoader.load(ALBUMS[i]);
    const coverMat = new THREE.MeshStandardMaterial({
      map: coverTex,
      roughness: 0.4,
      metalness: 0.0,
    });
    const coverGeo = new THREE.PlaneGeometry(albumSize - 0.02, albumSize - 0.02);
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.set(0, 0, caseDepth / 2 + 0.001);
    caseGroup.add(cover);

    // Spine (dark strip on left edge)
    const spineGeo = new THREE.BoxGeometry(0.02, albumSize, caseDepth + 0.005);
    const spine = new THREE.Mesh(spineGeo, mat.vinyl);
    spine.position.set(-albumSize / 2 + 0.01, 0, 0);
    caseGroup.add(spine);

    // CD disc visible through back (subtle circle)
    const discGeo = new THREE.RingGeometry(0.08, 0.25, 16);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0xccccdd,
      roughness: 0.05,
      metalness: 0.8,
      side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.set(0.05, -0.05, -caseDepth / 2 - 0.001);
    caseGroup.add(disc);

    // Position: standing on shelf, leaning back slightly
    // Each case has a slight random lean for natural look
    const leanBack = -0.12 - seededRandom(i * 3) * 0.08;
    const tiltSide = (seededRandom(i * 7) - 0.5) * 0.06;

    caseGroup.position.set(cx, albumSize / 2 + 0.08, 0.05);
    caseGroup.rotation.x = leanBack;
    caseGroup.rotation.z = tiltSide;

    group.add(caseGroup);
  }

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'album-shelf', group };
}
