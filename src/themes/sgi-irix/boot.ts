export interface BootCallbacks {
  onPhaseChange: (phase: "prom" | "logo" | "loading" | "done") => void;
  onTextLine: (text: string) => void;
  onProgress: (pct: number) => void;
}

export async function runBootSequence(cb: BootCallbacks, skipToDesktop = false): Promise<void> {
  if (skipToDesktop) {
    cb.onPhaseChange("done");
    return;
  }

  // Phase 1: PROM diagnostics (0-2s)
  cb.onPhaseChange("prom");
  const promLines = [
    "Running power-on diagnostics...",
    "",
    "System: SGI Indy",
    "Processor: MIPS R4400 @ 150MHz",
    "Memory: 128 MB",
    "",
    "Starting up the system...",
  ];
  for (const line of promLines) {
    cb.onTextLine(line);
    await sleep(200);
  }
  await sleep(400);

  // Phase 2: Logo (2-4s)
  cb.onPhaseChange("logo");
  await sleep(500);

  // Phase 3: Loading bar (4-5s)
  cb.onPhaseChange("loading");
  for (let i = 0; i <= 100; i += 5) {
    cb.onProgress(i);
    await sleep(50);
  }
  await sleep(300);

  // Done
  cb.onPhaseChange("done");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
