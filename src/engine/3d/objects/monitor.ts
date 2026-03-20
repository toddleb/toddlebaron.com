// src/engine/3d/objects/monitor.ts — CRT Monitor (retro brushed-steel BBS hardware style)
import * as THREE from 'three';
import * as mat from '../materials';
import type { DeskObject, DeskObjectOptions } from '../types';

/** Render text to a canvas texture */
function makeTextSprite(
  text: string,
  opts: { fontSize?: number; color?: string; font?: string; width?: number; height?: number } = {}
): THREE.Mesh {
  const { fontSize = 28, color = '#d0ccc4', font = 'bold', width = 256, height = 48 } = opts;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);
  ctx.font = `${font} ${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const geo = new THREE.PlaneGeometry(width / 200, height / 200);
  const material = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
  return new THREE.Mesh(geo, material);
}

function roundedBoxGeometry(w: number, h: number, d: number, r: number, segs = 3): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  shape.moveTo(-hw - r, -hh);
  shape.lineTo(hw + r, -hh);
  shape.absarc(hw, -hh, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw + r, hh);
  shape.absarc(hw, hh, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw - r, hh + r);
  shape.absarc(-hw, hh, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw - r, -hh);
  shape.absarc(-hw, -hh, r, Math.PI, Math.PI * 1.5, false);
  return new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: segs }).translate(0, 0, -d / 2);
}

export function createMonitor(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 2.6, -1.8];

  // Monitor housing (rounded, brushed steel)
  const bodyGeo = roundedBoxGeometry(5.5, 3.8, 0.6, 0.15);
  const body = new THREE.Mesh(bodyGeo, mat.steel);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.set(0, 2.0, 0);
  group.add(body);

  // Screen bezel (dark inset)
  const bezelGeo = roundedBoxGeometry(5.0, 3.3, 0.08, 0.1);
  const bezel = new THREE.Mesh(bezelGeo, mat.screen);
  bezel.position.set(0, 2.05, 0.28);
  group.add(bezel);

  // CRT glass bulge
  const glassGeo = new THREE.SphereGeometry(8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0010, emissive: 0x180028, emissiveIntensity: 0.3,
    roughness: 0.02, clearcoat: 1.0, clearcoatRoughness: 0.03,
    transparent: true, opacity: 0.15,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.scale.set(0.31, 0.2, 0.02);
  glass.position.set(0, 2.05, 0.35);
  glass.rotation.x = Math.PI;
  group.add(glass);

  // Screen glow
  const glow = new THREE.PointLight(0x6b2fbe, 0.6, 4, 2);
  glow.position.set(0, 2.0, 1.5);
  group.add(glow);

  // Monitor chin (brushed steel)
  const chinGeo = roundedBoxGeometry(5.5, 0.4, 0.6, 0.08);
  const chin = new THREE.Mesh(chinGeo, mat.steel);
  chin.position.set(0, 0.0, 0);
  chin.castShadow = true;
  group.add(chin);

  // Vent slots on chin
  const ventMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  for (let i = 0; i < 8; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.01), ventMat);
    vent.position.set(-1.2 + i * 0.35, 0.08, 0.31);
    group.add(vent);
  }

  // ─── Brand label (rainbow gradient text like 2D version) ───
  const brandCanvas = document.createElement('canvas');
  brandCanvas.width = 256;
  brandCanvas.height = 32;
  const bCtx = brandCanvas.getContext('2d')!;
  bCtx.font = 'bold 20px "Courier New", monospace';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  // Rainbow gradient
  const grad = bCtx.createLinearGradient(40, 0, 216, 0);
  grad.addColorStop(0, '#61BB46');
  grad.addColorStop(0.2, '#FDB827');
  grad.addColorStop(0.4, '#F5821F');
  grad.addColorStop(0.6, '#E03A3E');
  grad.addColorStop(0.8, '#963D97');
  grad.addColorStop(1, '#009DDC');
  bCtx.fillStyle = grad;
  bCtx.fillText('T-NET', 128, 16);
  const brandTex = new THREE.CanvasTexture(brandCanvas);
  brandTex.minFilter = THREE.LinearFilter;
  const brandGeo = new THREE.PlaneGeometry(1.6, 0.2);
  const brandMat = new THREE.MeshBasicMaterial({ map: brandTex, transparent: true, depthWrite: false });
  const brand = new THREE.Mesh(brandGeo, brandMat);
  brand.position.set(-1.4, -0.05, 0.31);
  group.add(brand);

  // ─── Power LED (cyan, like original) ───
  const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const led = new THREE.Mesh(ledGeo, mat.ledCyan);
  led.position.set(2.2, 0.0, 0.31);
  group.add(led);

  // "POWER" label next to LED
  const powerLabel = makeTextSprite('POWER', { fontSize: 14, color: '#cccccc', width: 128, height: 24 });
  powerLabel.position.set(1.9, 0.0, 0.32);
  powerLabel.scale.set(0.5, 0.5, 1);
  group.add(powerLabel);

  // Brightness/contrast knobs
  const knobMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.6 });
  for (let i = 0; i < 2; i++) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8), knobMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(1.3 + i * 0.25, -0.08, 0.33);
    group.add(knob);
  }

  // Stand neck (tapered)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 0.5, 8), mat.steel);
  neck.position.set(0, -0.4, 0);
  neck.castShadow = true;
  group.add(neck);

  // Stand base (rounded)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.1, 16), mat.steel);
  base.position.set(0, -0.7, 0.2);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  return { name: 'monitor', group };
}
