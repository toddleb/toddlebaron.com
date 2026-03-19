// src/engine/weather.ts
import { getContext, isMuted } from "./audio";

let rainSource: AudioBufferSourceNode | null = null;
let rainGain: GainNode | null = null;
let dripTimeout: ReturnType<typeof setTimeout> | null = null;
let activeRainVol = 0.015;

export function startRain(intensity: "heavy" | "drizzle"): void {
  if (rainSource) return; // already running
  try {
    const ctx = getContext();
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    rainSource = ctx.createBufferSource();
    rainSource.buffer = buf;
    rainSource.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3000;
    bp.Q.value = 1;
    rainGain = ctx.createGain();
    activeRainVol = intensity === "heavy" ? 0.015 : 0.008;
    rainGain.gain.value = isMuted() ? 0 : activeRainVol;
    rainSource.connect(bp).connect(rainGain).connect(ctx.destination);
    rainSource.start();
    scheduleDrip();
  } catch {
    // Audio non-critical
  }

  document.addEventListener("audio:mute-changed", handleMuteChange);
}

function handleMuteChange(): void {
  if (rainGain) {
    rainGain.gain.value = isMuted() ? 0 : activeRainVol;
  }
}

function scheduleDrip(): void {
  const delay = 2000 + Math.random() * 6000;
  dripTimeout = setTimeout(() => {
    if (!isMuted()) {
      try {
        const ctx = getContext();
        const bufSize = Math.ceil(ctx.sampleRate * 0.01);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 5000 + Math.random() * 3000;
        bp.Q.value = 3;
        const g = ctx.createGain();
        g.gain.value = 0.02;
        src.connect(bp).connect(g).connect(ctx.destination);
        src.start();
        src.stop(ctx.currentTime + 0.01);
      } catch { /* non-critical */ }
    }
    scheduleDrip();
  }, delay);
}

export function stopRain(): void {
  if (rainSource) {
    try { rainSource.stop(); rainSource.disconnect(); } catch {}
    rainSource = null;
  }
  if (rainGain) {
    try { rainGain.disconnect(); } catch {}
    rainGain = null;
  }
  if (dripTimeout) {
    clearTimeout(dripTimeout);
    dripTimeout = null;
  }
  document.removeEventListener("audio:mute-changed", handleMuteChange);
}

export function playThunder(): void {
  if (isMuted()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 100;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch { /* non-critical */ }
}
