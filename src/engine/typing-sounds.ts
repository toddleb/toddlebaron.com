// src/engine/typing-sounds.ts
import { getContext, isMuted } from "./audio";

type Era = "bbs" | "sgi" | "nextstep";

function playClick(freq: number, duration: number, volume: number): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = freq * (0.85 + Math.random() * 0.3); // ±15% pitch
    const g = ctx.createGain();
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(g).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000 + 0.01);
  } catch {
    // Audio non-critical
  }
}

export function playNoiseBurst(centerFreq: number, duration: number, volume: number): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const bufSize = Math.ceil(ctx.sampleRate * (duration / 1000 + 0.01));
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = centerFreq;
    bp.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    source.connect(bp).connect(g).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + duration / 1000 + 0.01);
  } catch {
    // Audio non-critical
  }
}

const profiles: Record<Era, () => void> = {
  bbs: () => {
    // IBM Model M — two-phase: click + thock
    playClick(4000, 2, 0.08);
    setTimeout(() => playClick(2500, 1.5, 0.04), 30 + Math.random() * 5);
  },
  sgi: () => {
    // SGI Granite — soft membrane thump
    playClick(1500, 1.5, 0.04);
  },
  nextstep: () => {
    // Cherry MX — crisp click
    playClick(3500, 1.5, 0.06);
  },
};

export function initTypingSounds(era: Era): void {
  // For BBS, this should only be called after boot:complete (caller's responsibility)
  // This ensures typing sounds don't fire during boot sequence
  const handler = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      // Only for SGI/NX input elements
      if (era !== "bbs") profiles[era]();
      return;
    }
    // BBS: document-level, printable keys only (only fires when BBS main content visible)
    if (era === "bbs" && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      profiles[era]();
    }
  };
  document.addEventListener("keydown", handler);
}

// ─── UI Interaction Sounds ───

export function playMenuBeep(): void {
  playClick(1000, 15, 0.06);
}

export function playHDDChatter(): void {
  if (isMuted()) return;
  // Rapid noise bursts simulating HDD seek
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playNoiseBurst(3000, 10, 0.03), i * 40);
  }
}

export function playSoftClick(): void {
  playClick(800, 3, 0.04);
}

export function playThud(): void {
  playClick(200, 8, 0.05);
}

export function playShelfClick(): void {
  playClick(1200, 2, 0.05);
}

export function playSwoosh(rising: boolean): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const bufSize = Math.ceil(ctx.sampleRate * 0.1);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(rising ? 400 : 2000, ctx.currentTime);
    bp.frequency.linearRampToValueAtTime(rising ? 2000 : 400, ctx.currentTime + 0.08);
    bp.Q.value = 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    source.connect(bp).connect(g).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.1);
  } catch {
    // Audio non-critical
  }
}

export function playSpringBounce(): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Audio non-critical
  }
}
