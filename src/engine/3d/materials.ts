// src/engine/3d/materials.ts — PBR materials for 3D desk scene
import * as THREE from 'three';

const texLoader = new THREE.TextureLoader();

// ─── Textures ───
export const steelTex = texLoader.load('/brushed-steel.jpg');
steelTex.wrapS = steelTex.wrapT = THREE.RepeatWrapping;

export const steelNormalTex = texLoader.load('/brushed-steel-normal.jpg');
steelNormalTex.wrapS = steelNormalTex.wrapT = THREE.RepeatWrapping;

export const brickTex = texLoader.load('/wall-brick.jpg');
brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;

export const brickNormalTex = texLoader.load('/wall-brick-normal.jpg');
brickNormalTex.wrapS = brickNormalTex.wrapT = THREE.RepeatWrapping;

// ─── Materials (PBR) ───
export const steel = new THREE.MeshStandardMaterial({
  map: steelTex,
  normalMap: steelNormalTex,
  normalScale: new THREE.Vector2(1.0, 1.0),
  metalness: 0.85,
  roughness: 0.2,
  envMapIntensity: 1.5,
});

export const brick = new THREE.MeshStandardMaterial({
  map: brickTex,
  normalMap: brickNormalTex,
  normalScale: new THREE.Vector2(1.0, 1.0),
  roughness: 0.95,
  metalness: 0.0,
});

export const wall = new THREE.MeshStandardMaterial({
  color: 0x7a7688,
  roughness: 0.92,
  metalness: 0.0,
  bumpScale: 0.03,
});

// Procedural wood grain via canvas texture
function makeWoodTexture(width = 512, height = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  // Base color
  ctx.fillStyle = '#5a3d2e';
  ctx.fillRect(0, 0, width, height);
  // Grain lines
  for (let y = 0; y < height; y += 2) {
    const offset = Math.sin(y * 0.05) * 8 + Math.sin(y * 0.15) * 3;
    const brightness = 0.85 + Math.random() * 0.3;
    ctx.strokeStyle = `rgba(${Math.floor(120 * brightness)}, ${Math.floor(75 * brightness)}, ${Math.floor(52 * brightness)}, 0.4)`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < width; x += 20) {
      ctx.lineTo(x, y + offset + Math.sin(x * 0.02) * 2);
    }
    ctx.stroke();
  }
  // Knot spots
  for (let i = 0; i < 3; i++) {
    const kx = Math.random() * width;
    const ky = Math.random() * height;
    const grad = ctx.createRadialGradient(kx, ky, 0, kx, ky, 12 + Math.random() * 8);
    grad.addColorStop(0, 'rgba(60, 30, 15, 0.6)');
    grad.addColorStop(1, 'rgba(60, 30, 15, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(kx - 20, ky - 20, 40, 40);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const woodTex = makeWoodTexture();
woodTex.repeat.set(2, 1);

export const deskWood = new THREE.MeshStandardMaterial({
  map: woodTex,
  color: 0xffffff,
  roughness: 0.55,
  metalness: 0.02,
  envMapIntensity: 0.3,
});

const edgeWoodTex = makeWoodTexture(256, 64);
edgeWoodTex.repeat.set(4, 1);

export const deskEdge = new THREE.MeshStandardMaterial({
  map: edgeWoodTex,
  color: 0xffffff,
  roughness: 0.45,
  metalness: 0.02,
  envMapIntensity: 0.4,
});

export const screen = new THREE.MeshPhysicalMaterial({
  color: 0x0a0008,
  emissive: 0x1a0030,
  emissiveIntensity: 0.6,
  roughness: 0.02,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  reflectivity: 0.5,
});

export const dark = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  roughness: 0.55,
  metalness: 0.4,
});

export const greenGlass = new THREE.MeshPhysicalMaterial({
  color: 0x2a7a42,
  roughness: 0.15,
  metalness: 0.0,
  transparent: true,
  opacity: 0.75,
  transmission: 0.3,
  thickness: 0.5,
  ior: 1.5,
});

export const brass = new THREE.MeshStandardMaterial({
  color: 0xb8943e,
  roughness: 0.3,
  metalness: 0.8,
  envMapIntensity: 1.2,
});

export const pot = new THREE.MeshStandardMaterial({
  color: 0x9040c0,
  roughness: 0.55,
  metalness: 0.05,
});

export const ledGreen = new THREE.MeshStandardMaterial({
  color: 0x33cc33,
  emissive: 0x33cc33,
  emissiveIntensity: 1.2,
});

export const ledOrange = new THREE.MeshStandardMaterial({
  color: 0xdd8800,
  emissive: 0xdd8800,
  emissiveIntensity: 1.2,
});

export const ledCyan = new THREE.MeshStandardMaterial({
  color: 0x00ccdd,
  emissive: 0x00ccdd,
  emissiveIntensity: 1.5,
});

export const vinyl = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.2,
  metalness: 0.0,
});
