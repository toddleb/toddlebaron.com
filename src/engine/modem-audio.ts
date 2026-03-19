/**
 * Synthesized 14.4k modem handshake using Web Audio API.
 * No audio files needed — pure oscillator + noise generation.
 *
 * Sequence: dial tone → DTMF digits → ringback → CARRIER SCREECH → silence
 */

export async function playModemHandshake(): Promise<void> {
  const ctx = new AudioContext();
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
      ctx.close();
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
    utter.rate = 0.75;
    utter.pitch = 0.3;
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

/** THX Deep Note — synthesized with oscillators converging to a chord */
export async function playTHXDeepNote(): Promise<void> {
  const ctx = new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.08;
  master.connect(ctx.destination);

  // THX deep note: ~30 oscillators start at random low frequencies
  // and converge to a D major chord over ~3 seconds
  const targets = [
    36.71, 73.42, 146.83, 293.66, 587.33,  // D
    46.25, 92.50, 185.00, 369.99, 739.99,   // F#
    55.00, 110.0, 220.00, 440.00, 880.00,   // A
  ];
  const dur = 4;
  const rampStart = 0.8;

  for (const target of targets) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    // Start at random frequency between 30-80 Hz
    const startFreq = 30 + Math.random() * 50;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.linearRampToValueAtTime(target, now + rampStart + 1.5 + Math.random() * 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + rampStart);
    gain.gain.setValueAtTime(0.06, now + dur - 1);
    gain.gain.linearRampToValueAtTime(0, now + dur);

    // Add slight detuning for richness
    osc.detune.value = (Math.random() - 0.5) * 20;

    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + dur);
  }

  // Add a low-pass filter sweep for warmth
  const lfo = ctx.createBiquadFilter();
  lfo.type = "lowpass";
  lfo.frequency.setValueAtTime(200, now);
  lfo.frequency.linearRampToValueAtTime(2000, now + dur * 0.7);
  master.disconnect();
  master.connect(lfo).connect(ctx.destination);

  return new Promise((resolve) => {
    setTimeout(() => { ctx.close(); resolve(); }, dur * 1000 + 200);
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
