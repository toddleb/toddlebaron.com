import type { ThemeConfig } from "../theme-contract";
import { themeRegistry } from "../theme-contract";

export const sgiIrixTheme: ThemeConfig = {
  id: "sgi-irix",
  name: "SGI IRIX 6.5",
  dayOfWeek: 5, // Friday
  bootDuration: 5000,
  sounds: {
    boot: "/audio/sgi-boot.mp3",
    shutdown: "/audio/sgi-shutdown.mp3",
    windowOpen: "/audio/sgi-window-open.mp3",
    windowClose: "/audio/sgi-window-close.mp3",
    menuClick: "/audio/sgi-menu-click.mp3",
    iconSelect: "/audio/sgi-icon-select.mp3",
    error: "/audio/sgi-error.mp3",
    ding: "/audio/sgi-ding.mp3",
  },
  colors: {
    primary: "#6B3FA0",
    secondary: "#3A8A7A",
    background: "#465080",
    surface: "#E8E8E8",
    text: "#222222",
  },
};

themeRegistry[sgiIrixTheme.id] = sgiIrixTheme;
