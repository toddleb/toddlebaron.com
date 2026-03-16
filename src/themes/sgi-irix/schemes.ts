export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  skyDark: string;
  skyLight: string;
  widget: string;
  widgetLight: string;
  widgetDark: string;
  surface: string;
  contentBg: string;
  text: string;
  textMuted: string;
  titleText: string;
}

export const schemes: ColorScheme[] = [
  {
    id: "indigo",
    name: "Indigo",
    primary: "#6B3FA0",
    secondary: "#3A8A7A",
    skyDark: "#465080",
    skyLight: "#8CA9D2",
    widget: "#C0C0C0",
    widgetLight: "#E0E0E0",
    widgetDark: "#888888",
    surface: "#E8E8E8",
    contentBg: "#F5F5F0",
    text: "#222222",
    textMuted: "#666666",
    titleText: "#ffffff",
  },
  {
    id: "desert",
    name: "Desert",
    primary: "#B8860B",
    secondary: "#8B4513",
    skyDark: "#8B7355",
    skyLight: "#D2B48C",
    widget: "#D4C4A0",
    widgetLight: "#E8DCC0",
    widgetDark: "#A09070",
    surface: "#F0E8D8",
    contentBg: "#FAF5EB",
    text: "#3E2723",
    textMuted: "#795548",
    titleText: "#ffffff",
  },
  {
    id: "ocean",
    name: "Ocean",
    primary: "#1565C0",
    secondary: "#00ACC1",
    skyDark: "#0D2137",
    skyLight: "#1A4A6E",
    widget: "#A0B8C8",
    widgetLight: "#C0D8E8",
    widgetDark: "#607888",
    surface: "#E0E8F0",
    contentBg: "#F0F5FA",
    text: "#1A237E",
    textMuted: "#546E7A",
    titleText: "#ffffff",
  },
  {
    id: "midnight",
    name: "Midnight",
    primary: "#311B92",
    secondary: "#1A237E",
    skyDark: "#0A0A1A",
    skyLight: "#1A1A3E",
    widget: "#808098",
    widgetLight: "#9898B0",
    widgetDark: "#505068",
    surface: "#D0D0D8",
    contentBg: "#E0E0E8",
    text: "#1A1A2E",
    textMuted: "#606078",
    titleText: "#E0E0F0",
  },
  {
    id: "rosewood",
    name: "Rosewood",
    primary: "#8B1A1A",
    secondary: "#6D3A3A",
    skyDark: "#3E1A1A",
    skyLight: "#5E2A2A",
    widget: "#C0A0A0",
    widgetLight: "#D8C0C0",
    widgetDark: "#907070",
    surface: "#F0E0E0",
    contentBg: "#FAF0F0",
    text: "#3E1A1A",
    textMuted: "#8B6060",
    titleText: "#ffffff",
  },
  {
    id: "slate",
    name: "Slate",
    primary: "#455A64",
    secondary: "#607D8B",
    skyDark: "#37474F",
    skyLight: "#546E7A",
    widget: "#B0BEC5",
    widgetLight: "#CFD8DC",
    widgetDark: "#78909C",
    surface: "#ECEFF1",
    contentBg: "#F5F7F8",
    text: "#263238",
    textMuted: "#607D8B",
    titleText: "#ffffff",
  },
];

export function getSchemeById(id: string): ColorScheme | undefined {
  return schemes.find((s) => s.id === id);
}
