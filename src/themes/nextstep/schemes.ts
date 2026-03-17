export interface NXColorScheme {
  id: string;
  name: string;
  accentBlue: string;
  accentGreen: string;
  accentAmber: string;
  accentRed: string;
  chromeMid: string;
  desktopBg: string;
}

export const defaultScheme: NXColorScheme = {
  id: "default",
  name: "NeXTSTEP Color",
  accentBlue: "#6aafee",
  accentGreen: "#6aee6a",
  accentAmber: "#ccaa44",
  accentRed: "#cc4444",
  chromeMid: "#3a3a40",
  desktopBg: "#1e1e22",
};

export const nxSchemes: NXColorScheme[] = [defaultScheme];

export function getSchemeById(id: string): NXColorScheme | undefined {
  return nxSchemes.find((s) => s.id === id);
}
