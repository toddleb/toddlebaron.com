import { themeRegistry } from "../theme-contract";
import type { ThemeConfig } from "../theme-contract";

export const nextstepTheme: ThemeConfig = {
  id: "nextstep",
  name: "NeXTSTEP Color",
  dayOfWeek: 1, // Monday
  bootDuration: 3500,
  sounds: {},
  colors: {
    primary: "#6aafee",
    secondary: "#6aee6a",
    background: "#1e1e22",
    surface: "#333338",
    text: "#e0e0e0",
  },
};

themeRegistry[nextstepTheme.id] = nextstepTheme;
