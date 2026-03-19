// src/engine/seasonal.ts

export interface SeasonalOverride {
  cssClass?: string;
  particleEffect?: "snow";
  bootMessageOverride?: string;
}

export function getSeasonalOverride(): SeasonalOverride | null {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed

  // December (month 11)
  if (month === 11) {
    return {
      cssClass: "seasonal-winter",
      particleEffect: "snow",
      bootMessageOverride: "❄ Happy Holidays from T-NET BBS ❄",
    };
  }

  return null;
}
