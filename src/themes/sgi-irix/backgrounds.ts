export interface DesktopBackground {
  id: string;
  name: string;
  css: string;
}

export const backgrounds: DesktopBackground[] = [
  {
    id: "sky",
    name: "Sky Gradient",
    css: "var(--sgi-sky-gradient)",
  },
  {
    id: "granite",
    name: "Granite",
    css: `repeating-conic-gradient(#808080 0% 25%, #909090 0% 50%) 0/4px 4px`,
  },
  {
    id: "deep-space",
    name: "Deep Space",
    css: `radial-gradient(1px 1px at 20% 30%, #fff, transparent),
          radial-gradient(1px 1px at 40% 70%, #fff, transparent),
          radial-gradient(1px 1px at 60% 20%, #fff, transparent),
          radial-gradient(1px 1px at 80% 50%, #fff, transparent),
          radial-gradient(1px 1px at 10% 80%, #ddd, transparent),
          radial-gradient(1px 1px at 70% 90%, #ddd, transparent),
          radial-gradient(1px 1px at 50% 10%, #ddd, transparent),
          radial-gradient(1px 1px at 90% 40%, #ddd, transparent),
          linear-gradient(180deg, #050510 0%, #0A0A2E 50%, #0D1020 100%)`,
  },
  {
    id: "abstract",
    name: "Abstract SGI",
    css: "linear-gradient(135deg, #6B3FA0 0%, #E040A0 40%, #FF8040 100%)",
  },
  {
    id: "circuit",
    name: "Circuit Board",
    css: `repeating-linear-gradient(0deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),
          linear-gradient(180deg, #0a1a0a, #0d2d0d)`,
  },
  {
    id: "mountain",
    name: "Mountain",
    css: `linear-gradient(170deg, transparent 60%, #2a1a3a 60%, #3a2a4a 70%, transparent 70%),
          linear-gradient(175deg, transparent 55%, #1a2a1a 55%, #2a3a2a 65%, transparent 65%),
          linear-gradient(168deg, transparent 50%, #3a2a1a 50%, #4a3a2a 58%, transparent 58%),
          linear-gradient(180deg, #1a1030 0%, #2a2050 30%, #4a3060 60%, #3a2040 100%)`,
  },
];

export function getBackgroundById(id: string): DesktopBackground | undefined {
  return backgrounds.find((b) => b.id === id);
}
