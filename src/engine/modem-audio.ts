/**
 * Synthesized 14.4k modem handshake using Web Audio API.
 * No audio files needed — pure oscillator + noise generation.
 *
 * Sequence: dial tone → DTMF digits → ringback → CARRIER SCREECH → silence
 */

export async function playModemHandshake(externalCtx?: AudioContext): Promise<void> {
  const ctx = externalCtx || new AudioContext();
  // Resume if browser suspended due to autoplay policy
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return new Promise((resolve) => {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.15;
    master.connect(ctx.destination);

    // ─── 1. Dial tone (350 + 440 Hz) ───
    tone(ctx, master, 350, now, now + 0.4, 0.5);
    tone(ctx, master, 440, now, now + 0.4, 0.5);

    // ─── 2. DTMF dialing: 1-512-555-0142 ───
    const digits = "15125550142";
    const dtmfMap: Record<string, [number, number]> = {
      "1": [697, 1209], "2": [697, 1336], "3": [697, 1477],
      "4": [770, 1209], "5": [770, 1336], "6": [770, 1477],
      "7": [852, 1209], "8": [852, 1336], "9": [852, 1477],
      "0": [941, 1336], "*": [941, 1209], "#": [941, 1477],
    };
    let t = now + 0.5;
    for (const d of digits) {
      const [lo, hi] = dtmfMap[d] ?? [697, 1209];
      tone(ctx, master, lo, t, t + 0.08, 0.4);
      tone(ctx, master, hi, t, t + 0.08, 0.4);
      t += 0.12;
    }

    // ─── 3. Ringback (440 + 480 Hz, 2-second cadence × 2) ───
    const ringStart = t + 0.3;
    for (let r = 0; r < 2; r++) {
      const rs = ringStart + r * 1.2;
      tone(ctx, master, 440, rs, rs + 0.4, 0.3);
      tone(ctx, master, 480, rs, rs + 0.4, 0.3);
    }

    // ─── 4. THE SCREECH — modem handshake ───
    const screechStart = ringStart + 2.6;

    // Carrier answer tone (2100 Hz)
    const answer = ctx.createOscillator();
    answer.frequency.value = 2100;
    const answerGain = ctx.createGain();
    answerGain.gain.setValueAtTime(0.35, screechStart);
    answerGain.gain.linearRampToValueAtTime(0, screechStart + 0.6);
    answer.connect(answerGain).connect(master);
    answer.start(screechStart);
    answer.stop(screechStart + 0.6);

    // Frequency sweep (the iconic rising screech)
    const sweep = ctx.createOscillator();
    sweep.frequency.setValueAtTime(600, screechStart + 0.5);
    sweep.frequency.linearRampToValueAtTime(2400, screechStart + 1.2);
    sweep.frequency.setValueAtTime(1200, screechStart + 1.3);
    sweep.frequency.linearRampToValueAtTime(2100, screechStart + 1.8);
    sweep.frequency.linearRampToValueAtTime(1800, screechStart + 2.2);
    const sweepGain = ctx.createGain();
    sweepGain.gain.value = 0.25;
    sweep.connect(sweepGain).connect(master);
    sweep.start(screechStart + 0.5);
    sweep.stop(screechStart + 2.2);

    // Training noise burst (bandpassed white noise)
    const noiseDur = 1.5;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseDur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 3;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.12;
    noise.connect(bp).connect(noiseGain).connect(master);
    noise.start(screechStart + 0.8);
    noise.stop(screechStart + 0.8 + noiseDur);

    // V.32bis negotiation chirps
    const chirpStart = screechStart + 2.3;
    for (let c = 0; c < 6; c++) {
      const chirp = ctx.createOscillator();
      chirp.frequency.value = 1200 + (c % 2) * 600;
      const cGain = ctx.createGain();
      cGain.gain.value = 0.15;
      chirp.connect(cGain).connect(master);
      chirp.start(chirpStart + c * 0.08);
      chirp.stop(chirpStart + c * 0.08 + 0.04);
    }

    // Done — total duration ~5.5 seconds
    const totalDuration = screechStart + 3.0 - now;
    setTimeout(() => {
      if (!externalCtx) ctx.close();
      resolve();
    }, totalDuration * 1000);
  });
}

/** Disconnect tone (carrier drop) */
export async function playDisconnect(): Promise<void> {
  const ctx = new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.value = 0.1;
  gain.connect(ctx.destination);
  tone(ctx, gain, 400, now, now + 0.3, 1);
  tone(ctx, gain, 350, now + 0.05, now + 0.25, 1);
  setTimeout(() => ctx.close(), 500);
}

/** WOPR computer voice — uses Web Speech API with robotic settings */
export function speakWOPR(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.8;
    utter.pitch = 0.6;
    utter.volume = 0.8;
    // Try to find a robotic/male voice
    const voices = speechSynthesis.getVoices();
    const robot = voices.find(v => /daniel|alex|fred|zarvox|samantha/i.test(v.name))
      || voices.find(v => v.lang.startsWith("en"))
      || voices[0];
    if (robot) utter.voice = robot;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    speechSynthesis.speak(utter);
  });
}

/**
 * THX Deep Note — 30-voice synthesis converging to D major chord.
 * Uses just intonation (base D = 150Hz), sawtooth waves with detuning,
 * low-pass filter sweep, and stereo panning for full stereo width.
 */
export async function playTHXDeepNote(externalCtx?: AudioContext): Promise<void> {
  const ctx = externalCtx || new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  const now = ctx.currentTime;

  // Master output with compressor for loudness without clipping
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;

  const master = ctx.createGain();
  master.gain.value = 0.12;

  // Low-pass filter sweep — opens up as chord resolves
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.Q.value = 0.7;

  master.connect(lpf).connect(compressor).connect(ctx.destination);

  const dur = 5;
  const rampStart = 0.6;
  const rampEnd = rampStart + 2.8;

  // Filter: start dark, sweep open, then close at fade
  lpf.frequency.setValueAtTime(300, now);
  lpf.frequency.linearRampToValueAtTime(8000, now + rampEnd);
  lpf.frequency.setValueAtTime(8000, now + dur - 0.8);
  lpf.frequency.linearRampToValueAtTime(1500, now + dur);

  // Master volume envelope: fade in → sustain → fade out
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.12, now + rampStart);
  master.gain.setValueAtTime(0.12, now + dur - 1.0);
  master.gain.linearRampToValueAtTime(0, now + dur);

  // 30 voices distributed across D major chord (just intonation, base = 150Hz)
  // [targetFreq, voiceCount]
  const voices: [number, number][] = [
    [37.5, 2],    // D1  (150/4)
    [75, 2],      // D2  (150/2)
    [112.5, 2],   // A2  (150×3/4)
    [150, 2],     // D3  (base)
    [225, 2],     // A3  (150×3/2)
    [300, 2],     // D4  (150×2)
    [450, 2],     // A4  (150×3)
    [600, 2],     // D5  (150×4)
    [900, 2],     // A5  (150×6)
    [1200, 2],    // D6  (150×8)
    [1500, 6],    // F#6 (150×10) — top note gets more voices for shimmer
  ];

  let voiceIndex = 0;
  const totalVoices = voices.reduce((sum, [, n]) => sum + n, 0);

  for (const [targetFreq, count] of voices) {
    for (let v = 0; v < count; v++) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";

      // Start in a tight cluster around 200-400Hz (the "swarm")
      const startFreq = 200 + Math.random() * 200;
      osc.frequency.setValueAtTime(startFreq, now);

      // Wiggle randomly during ramp for organic feel
      const wiggleFreq = startFreq + (Math.random() - 0.5) * 80;
      osc.frequency.setValueAtTime(wiggleFreq, now + rampStart * 0.5);
      osc.frequency.linearRampToValueAtTime(
        targetFreq,
        now + rampStart + 1.8 + Math.random() * 1.0,
      );

      // Slight detuning between voices for richness (±8 cents)
      osc.detune.value = (Math.random() - 0.5) * 16;

      // Per-voice gain (lower frequencies get more, high gets less)
      const voiceGain = ctx.createGain();
      const baseVol = targetFreq < 200 ? 0.07 : targetFreq < 600 ? 0.05 : 0.035;
      voiceGain.gain.setValueAtTime(0, now);
      voiceGain.gain.linearRampToValueAtTime(baseVol, now + rampStart + 0.5);
      voiceGain.gain.setValueAtTime(baseVol, now + dur - 1.0);
      voiceGain.gain.linearRampToValueAtTime(0, now + dur);

      // Stereo panning — spread voices across the stereo field
      const panner = ctx.createStereoPanner();
      panner.pan.value = ((voiceIndex / totalVoices) * 2 - 1) * 0.8 + (Math.random() - 0.5) * 0.3;

      osc.connect(voiceGain).connect(panner).connect(master);
      osc.start(now);
      osc.stop(now + dur + 0.1);
      voiceIndex++;
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => { if (!externalCtx) ctx.close(); resolve(); }, dur * 1000 + 300);
  });
}

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  start: number,
  stop: number,
  vol: number,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.value = vol;
  osc.connect(gain).connect(dest);
  osc.start(start);
  osc.stop(stop);
}
