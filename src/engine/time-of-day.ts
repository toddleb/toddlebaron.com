// src/engine/time-of-day.ts

export type TimePeriod = "dawn" | "morning" | "afternoon" | "evening" | "night";

export function getTimePeriodAt(date: Date): TimePeriod {
  const h = date.getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

export function getTimePeriod(): TimePeriod {
  return getTimePeriodAt(new Date());
}

export function onPeriodChange(callback: (period: TimePeriod) => void): () => void {
  let current = getTimePeriod();
  const interval = setInterval(() => {
    const next = getTimePeriod();
    if (next !== current) {
      current = next;
      callback(next);
    }
  }, 60_000);
  return () => clearInterval(interval);
}

export function initTimeOfDay(): void {
  const period = getTimePeriod();
  document.body.dataset.time = period;
  onPeriodChange((p) => {
    document.body.dataset.time = p;
  });
}
