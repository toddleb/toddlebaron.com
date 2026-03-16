import { themeRegistry, getThemeForDay, getThemeById } from "../themes/theme-contract";
import type { ThemeConfig } from "../themes/theme-contract";

const COOKIE_KEY = "toddlebaron-era";
const VISITED_KEY = "toddlebaron-visited";

export function getCurrentTheme(): ThemeConfig {
  const override = getCookie(COOKIE_KEY);
  if (override) {
    const theme = getThemeById(override);
    if (theme) return theme;
  }

  const day = new Date().getDay();
  const dayTheme = getThemeForDay(day);
  if (dayTheme) return dayTheme;

  return themeRegistry["sgi-irix"]!;
}

export function setThemeOverride(id: string): void {
  setCookie(COOKIE_KEY, id, 30);
}

export function clearThemeOverride(): void {
  deleteCookie(COOKIE_KEY);
}

export function isFirstVisit(): boolean {
  return !getCookie(VISITED_KEY);
}

export function markVisited(): void {
  setCookie(VISITED_KEY, "1", 365);
}

export function shouldPlayFullBoot(): boolean {
  return isFirstVisit();
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
