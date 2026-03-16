export interface ConsoleEntry {
  date: string;
  time: string;
  message: string;
  type: "info" | "warn" | "success" | "system";
}

export const consoleEntries: ConsoleEntry[] = [
  { date: "03/15", time: "09:00", message: "IRIX 6.5 — toddlebaron.com workstation online", type: "system" },
  { date: "03/15", time: "08:45", message: "toddlebaron.com deployed to Cloudflare Pages", type: "success" },
  { date: "03/15", time: "08:30", message: "SGI visual enhancements spec approved", type: "success" },
  { date: "03/14", time: "22:30", message: "New post: Building an SGI Desktop in 2026", type: "info" },
  { date: "03/14", time: "16:45", message: "GitHub: pushed 3 commits to toddleb/toddlebaron.com", type: "info" },
  { date: "03/14", time: "14:20", message: "Boot sequence: full SGI Indy PROM simulation complete", type: "success" },
  { date: "03/13", time: "11:20", message: "Project PRIZYM: Sprint 5 complete", type: "info" },
  { date: "03/12", time: "09:15", message: "WARNING: Audio context requires user interaction to unlock", type: "warn" },
  { date: "03/12", time: "08:00", message: "System startup — all services nominal", type: "system" },
  { date: "03/11", time: "17:30", message: "Astro 6 migration complete — content collections updated", type: "success" },
];
