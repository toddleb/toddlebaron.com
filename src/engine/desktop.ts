import { openWindow, bringToFront } from "./wm";

let selectedIconId: string | null = null;

export function initDesktopIcons(): void {
  document.querySelectorAll<HTMLElement>(".sgi-icon").forEach((icon) => {
    const windowId = icon.dataset.windowId;
    if (!windowId) return;

    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      selectIcon(windowId);
    });

    icon.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      openWindow(windowId);
    });
  });

  document.querySelector(".sgi-desktop")?.addEventListener("click", () => {
    deselectAll();
  });
}

function selectIcon(id: string): void {
  deselectAll();
  selectedIconId = id;
  const icon = document.querySelector<HTMLElement>(`.sgi-icon[data-window-id="${id}"]`);
  if (icon) icon.classList.add("selected");
}

function deselectAll(): void {
  selectedIconId = null;
  document.querySelectorAll(".sgi-icon").forEach((icon) => {
    icon.classList.remove("selected");
  });
}
