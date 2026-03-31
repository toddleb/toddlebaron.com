// src/engine/3d/objects/computer.ts — Desktop computer unit (retro brushed-steel BBS style)
import * as THREE from 'three';
import * as mat from '../materials';
import type { DeskObject, DeskObjectOptions } from '../types';

function makeLabel(text: string, w = 256, h = 32, fontSize = 18, color = '#d0ccc4'): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.font = `bold ${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const geo = new THREE.PlaneGeometry(w / 200, h / 200);
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
}

export function createComputer(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 1.3, -0.8];

  // Computer body (brushed steel)
  const bodyGeo = new THREE.BoxGeometry(5.2, 0.8, 2.5);
  const body = new THREE.Mesh(bodyGeo, mat.steel);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Front bezel (lighter panel like original)
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0xd0ccc4, roughness: 0.7, metalness: 0.1 });
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(5.18, 0.78, 0.04), bezelMat);
  bezel.position.set(0, 0, 1.27);
  group.add(bezel);

  // Floppy drive bay
  const slotMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  const floppy = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.05), slotMat);
  floppy.position.set(-1.2, 0.2, 1.29);
  group.add(floppy);

  // Eject button
  const eject = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.04), bezelMat);
  eject.position.set(-0.2, 0.2, 1.3);
  group.add(eject);

  // LED ticker screen (recessed dark background)
  const ledRecess = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.3, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.95 })
  );
  ledRecess.position.set(0, 0.0, 1.27);
  group.add(ledRecess);

  const ledGeo = new THREE.PlaneGeometry(3.4, 0.22);
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x001a1a, emissive: 0x00ccdd, emissiveIntensity: 0.8,
  });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(0, 0.0, 1.3);
  group.add(led);

  // Power LED (cyan)
  const power = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mat.ledCyan);
  power.position.set(2.2, -0.2, 1.3);
  group.add(power);

  // HDD LED (orange, gentle pulse)
  const hddLed = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), mat.ledOrange.clone());
  hddLed.position.set(2.2, -0.05, 1.3);
  group.add(hddLed);

  // Power button
  const btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12),
    new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.5 })
  );
  btn.rotation.x = Math.PI / 2;
  btn.position.set(2.2, 0.15, 1.3);
  group.add(btn);

  // ─── Labels (like original 2D: brand, port labels) ───
  // Brand label
  const brandLabel = makeLabel('T-NET SYSTEMS', 320, 32, 16, '#555555');
  brandLabel.position.set(-1.5, -0.2, 1.32);
  brandLabel.scale.set(0.7, 0.7, 1);
  group.add(brandLabel);

  // Port labels: COM1, COM2, LPT1
  const portLabels = ['COM1', 'COM2', 'LPT1'];
  for (let i = 0; i < portLabels.length; i++) {
    const pl = makeLabel(portLabels[i], 96, 24, 12, '#666666');
    pl.position.set(-2.0 + i * 0.5, -0.28, 1.32);
    pl.scale.set(0.4, 0.4, 1);
    group.add(pl);

    // Port slots
    const port = new THREE.Mesh(
      new THREE.BoxGeometry(i === 2 ? 0.4 : 0.2, 0.1, 0.04),
      mat.dark
    );
    port.position.set(-2.0 + i * 0.5, -0.15, 1.29);
    group.add(port);
  }

  // Side ventilation grille
  const ventMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 });
  for (let i = 0; i < 6; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 1.8), ventMat);
    vent.position.set(2.61, -0.1 + i * 0.1, 0);
    group.add(vent);
  }

  // Rubber feet
  const footMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 });
  for (const [fx, fz] of [[-2, -1], [2, -1], [-2, 1], [2, 1]] as [number, number][]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 8), footMat);
    foot.position.set(fx, -0.42, fz);
    group.add(foot);
  }

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  // HDD LED: gentle sine pulse, no random flicker
  function update(_delta: number, elapsed: number): void {
    const base = Math.sin(elapsed * 2) * 0.3 + 0.4;
    const burst = Math.sin(elapsed * 7) > 0.8 ? 0.8 : 0;
    (hddLed.material as THREE.MeshStandardMaterial).emissiveIntensity = base + burst;
  }

  return { name: 'computer', group, update };
}
