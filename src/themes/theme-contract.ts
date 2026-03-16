export interface ThemeConfig {
  id: string;
  name: string;
  dayOfWeek: number; // 0=Sun ... 6=Sat
  bootDuration: number; // ms
  sounds: {
    boot?: string;
    shutdown?: string;
    windowOpen?: string;
    windowClose?: string;
    click?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
}

export const themeRegistry: Record<string, ThemeConfig> = {};

export function getThemeForDay(day: number): ThemeConfig | undefined {
  return Object.values(themeRegistry).find((t) => t.dayOfWeek === day);
}

export function getThemeById(id: string): ThemeConfig | undefined {
  return themeRegistry[id];
}
