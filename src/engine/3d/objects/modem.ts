// src/engine/3d/objects/modem.ts — US Robotics modem (retro brushed-steel BBS style)
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

export function createModem(opts: DeskObjectOptions = {}): DeskObject {
  const group = new THREE.Group();
  const [px, py, pz] = opts.position ?? [0, 0.95, -0.8];

  // Modem body (brushed steel)
  const bodyGeo = new THREE.BoxGeometry(5.2, 0.35, 2.5);
  const body = new THREE.Mesh(bodyGeo, mat.steel);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Top case edge bevel
  const topEdge = new THREE.Mesh(
    new THREE.BoxGeometry(5.22, 0.02, 2.52),
    new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.7, metalness: 0.3 })
  );
  topEdge.position.set(0, 0.18, 0);
  group.add(topEdge);

  // Front panel (slightly lighter)
  const panelMat = new THREE.MeshStandardMaterial({ color: 0xc8c0b8, roughness: 0.75, metalness: 0.05 });
  const panel = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.28, 0.03), panelMat);
  panel.position.set(0, -0.02, 1.27);
  group.add(panel);

  // ─── "US ROBOTICS" brand label ───
  const logo = makeLabel('US ROBOTICS', 256, 28, 16, '#d0ccc4');
  logo.position.set(-1.8, 0.08, 1.29);
  logo.scale.set(0.55, 0.55, 1);
  group.add(logo);

  // Model text
  const model = makeLabel('Sportster 2,400,000 FAX', 384, 24, 12, '#b0aaa0');
  model.position.set(-1.8, 0.0, 1.29);
  model.scale.set(0.45, 0.45, 1);
  group.add(model);

  // ─── LED label background strip ───
  const labelStrip = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.1, 0.01),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95 })
  );
  labelStrip.position.set(0.3, 0.0, 1.285);
  group.add(labelStrip);

  // ─── LEDs with text labels: MR TR SD RD CD OH AA HS ───
  const ledLabels = ['MR', 'TR', 'SD', 'RD', 'CD', 'OH', 'AA', 'HS'];
  const leds: THREE.Mesh[] = [];
  const ledGeo = new THREE.SphereGeometry(0.03, 8, 8);

  for (let i = 0; i < 8; i++) {
    const isOH = i === 5;
    const led = new THREE.Mesh(ledGeo, isOH ? mat.ledOrange.clone() : mat.ledGreen.clone());
    const lx = -0.9 + i * 0.35;
    led.position.set(lx, 0.06, 1.29);
    group.add(led);
    leds.push(led);

    // LED text label underneath
    const label = makeLabel(ledLabels[i], 64, 20, 12, '#c0bab0');
    label.position.set(lx, -0.04, 1.29);
    label.scale.set(0.3, 0.3, 1);
    group.add(label);
  }

  // ─── Speed readout (right side) ───
  const speed = makeLabel('STANDBY', 160, 28, 14, '#c0bab0');
  speed.position.set(2.0, 0.0, 1.29);
  speed.scale.set(0.5, 0.5, 1);
  group.add(speed);

  // DIP switches (rear)
  const dipMat = new THREE.MeshStandardMaterial({ color: 0x2244cc, roughness: 0.6, metalness: 0.2 });
  const dipBlock = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.15), dipMat);
  dipBlock.position.set(1.5, 0.0, -1.26);
  group.add(dipBlock);

  // Phone jack ports (rear)
  const jackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
  for (let i = 0; i < 2; i++) {
    const jack = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.08), jackMat);
    jack.position.set(-1.5 + i * 0.5, -0.05, -1.27);
    group.add(jack);
  }

  // Rubber feet
  const footMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 });
  for (const [fx, fz] of [[-2, -1], [2, -1], [-2, 1], [2, 1]] as [number, number][]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 8), footMat);
    foot.position.set(fx, -0.2, fz);
    group.add(foot);
  }

  group.position.set(px, py, pz);
  if (opts.scale) group.scale.setScalar(opts.scale);

  // LED blink patterns (like original: SD/RD alternate, OH pulses)
  function update(_delta: number, elapsed: number): void {
    const sdLed = leds[2];
    const rdLed = leds[3];
    if (sdLed && rdLed) {
      (sdLed.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(elapsed * 6) > 0 ? 1.2 : 0.1;
      (rdLed.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(elapsed * 6 + 1.5) > 0 ? 1.2 : 0.1;
    }
    const ohLed = leds[5];
    if (ohLed) {
      (ohLed.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(elapsed * 0.8) > 0.3 ? 1.0 : 0.3;
    }
  }

  return { name: 'modem', group, update };
}
