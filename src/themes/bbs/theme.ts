import type { ThemeConfig } from "../theme-contract";
import { themeRegistry } from "../theme-contract";

export const bbsTheme: ThemeConfig = {
  id: "bbs",
  name: "BBS / ANSI Art",
  dayOfWeek: 3, // Wednesday
  bootDuration: 4000,
  sounds: {
    boot: "/audio/modem-connect.mp3",
    shutdown: "/audio/modem-disconnect.mp3",
    click: "/audio/key-click.mp3",
  },
  colors: {
    primary: "#00AAAA",
    secondary: "#AA00AA",
    background: "#000000",
    surface: "#111111",
    text: "#AAAAAA",
  },
};

themeRegistry[bbsTheme.id] = bbsTheme;
