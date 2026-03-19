// src/engine/ambient.ts
import { getContext, isMuted } from "./audio";

type Era = "bbs" | "sgi" | "nextstep";

let activeNodes: AudioNode[] = [];
let activeGains: GainNode[] = [];
let targetGains: number[] = []; // stores original target gain per node for mute/unmute

function createHum(freq: number, gain: number): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(isMuted() ? 0 : gain, ctx.currentTime + 2);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  activeNodes.push(osc);
  activeGains.push(g);
  targetGains.push(gain);
}

function createFilteredNoise(centerFreq: number, q: number, gain: number): void {
  const ctx = getContext();
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = centerFreq;
  bp.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(isMuted() ? 0 : gain, ctx.currentTime + 2);
  source.connect(bp).connect(g).connect(ctx.destination);
  source.start();
  activeNodes.push(source);
  activeGains.push(g);
  targetGains.push(gain);
}

function onMuteChanged(): void {
  for (let i = 0; i < activeGains.length; i++) {
    try {
      const ctx = getContext();
      const g = activeGains[i];
      const target = isMuted() ? 0 : targetGains[i];
      g.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.3);
    } catch {
      // Audio node may have been garbage collected
    }
  }
}

// Register mute listener once at module load
if (typeof document !== "undefined") {
  document.addEventListener("audio:mute-changed", onMuteChanged);
}

export function startAmbient(era: Era): void {
  stopAmbient(); // clean up any prior ambient (e.g. BBS reboot)
  try {
    switch (era) {
      case "bbs":
        // CRT hum: 60Hz + 120Hz harmonic
        createHum(60, 0.02);
        createHum(120, 0.01);
        break;
      case "sgi":
        // Workstation fan: filtered white noise
        createFilteredNoise(400, 2, 0.015);
        break;
      case "nextstep":
        // Lab equipment: filtered white noise
        createFilteredNoise(600, 3, 0.008);
        break;
    }
  } catch {
    // Audio is non-critical
  }
}

export function stopAmbient(): void {
  for (const node of activeNodes) {
    try {
      if (node instanceof OscillatorNode) node.stop();
      if (node instanceof AudioBufferSourceNode) node.stop();
      node.disconnect();
    } catch {
      // Already stopped
    }
  }
  activeNodes = [];
  activeGains = [];
  targetGains = [];
}

// Safety net for page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", stopAmbient);
}
