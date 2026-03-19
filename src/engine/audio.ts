let muted = true;
let audioContext: AudioContext | null = null;
const audioCache: Map<string, AudioBuffer> = new Map();

export function initAudio(): void {
  const unlock = () => {
    muted = false;
    document.removeEventListener("click", unlock);
    document.removeEventListener("keydown", unlock);
  };
  document.addEventListener("click", unlock);
  document.addEventListener("keydown", unlock);
}

export function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function playSound(url: string): Promise<void> {
  if (muted) return;
  try {
    const ctx = getContext();
    let buffer = audioCache.get(url);
    if (!buffer) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      buffer = await ctx.decodeAudioData(arrayBuffer);
      audioCache.set(url, buffer);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Audio playback is non-critical
  }
}

export function toggleMute(): boolean {
  muted = !muted;
  document.dispatchEvent(new CustomEvent("audio:mute-changed", { detail: { muted } }));
  return muted;
}

export function isMuted(): boolean {
  return muted;
}
