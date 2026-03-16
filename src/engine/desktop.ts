import { openWindow, bringToFront } from "./wm";
import { playSound } from "./audio";

let selectedIconId: string | null = null;

const GRID_W = 80;
const GRID_H = 90;
const DRAG_THRESHOLD = 5;

interface DragState {
  icon: HTMLElement;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
}

let dragState: DragState | null = null;
let ghostEl: HTMLElement | null = null;

function getIconPositions(): Record<string, { col: number; row: number }> {
  try {
    const raw = localStorage.getItem("sgi-icon-positions");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveIconPositions(): void {
  const positions: Record<string, { col: number; row: number }> = {};
  document.querySelectorAll<HTMLElement>(".sgi-icon").forEach((icon) => {
    const id = icon.dataset.windowId;
    if (!id) return;
    const left = parseInt(icon.style.left) || 0;
    const top = parseInt(icon.style.top) || 0;
    positions[id] = { col: Math.round(left / GRID_W), row: Math.round(top / GRID_H) };
  });
  localStorage.setItem("sgi-icon-positions", JSON.stringify(positions));
}

function snapToGrid(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.max(0, Math.round(x / GRID_W) * GRID_W),
    y: Math.max(0, Math.round(y / GRID_H) * GRID_H),
  };
}

export function initDesktopIcons(): void {
  const icons = document.querySelectorAll<HTMLElement>(".sgi-icon");
  const saved = getIconPositions();

  // Restore or assign default positions
  let defaultRow = 0;
  icons.forEach((icon) => {
    const windowId = icon.dataset.windowId;
    if (!windowId) return;

    if (saved[windowId]) {
      icon.style.left = (saved[windowId].col * GRID_W) + "px";
      icon.style.top = (saved[windowId].row * GRID_H) + "px";
    } else {
      icon.style.left = "0px";
      icon.style.top = (defaultRow * GRID_H) + "px";
      defaultRow++;
    }

    // Mousedown: start potential drag
    icon.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.stopPropagation();

      const rect = icon.getBoundingClientRect();
      const containerRect = icon.parentElement!.getBoundingClientRect();

      dragState = {
        icon,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: e.clientX - rect.left + containerRect.left,
        offsetY: e.clientY - rect.top + containerRect.top,
        isDragging: false,
      };

      document.addEventListener("mousemove", onIconDragMove);
      document.addEventListener("mouseup", onIconDragEnd);
    });

    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (dragState?.isDragging) return;
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

function onIconDragMove(e: MouseEvent): void {
  if (!dragState) return;

  const dx = e.clientX - dragState.startX;
  const dy = e.clientY - dragState.startY;

  if (!dragState.isDragging) {
    if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
    dragState.isDragging = true;
    dragState.icon.classList.add("dragging");
  }

  const containerRect = dragState.icon.parentElement!.getBoundingClientRect();
  const newX = e.clientX - dragState.offsetX;
  const newY = e.clientY - dragState.offsetY;

  dragState.icon.style.left = newX + "px";
  dragState.icon.style.top = newY + "px";

  // Show ghost at snap position
  const snapped = snapToGrid(newX, newY);
  if (!ghostEl) {
    ghostEl = document.createElement("div");
    ghostEl.className = "sgi-icon-ghost";
    dragState.icon.parentElement!.appendChild(ghostEl);
  }
  ghostEl.style.left = snapped.x + "px";
  ghostEl.style.top = snapped.y + "px";
}

function onIconDragEnd(): void {
  document.removeEventListener("mousemove", onIconDragMove);
  document.removeEventListener("mouseup", onIconDragEnd);

  if (ghostEl) {
    ghostEl.remove();
    ghostEl = null;
  }

  if (dragState?.isDragging) {
    const left = parseInt(dragState.icon.style.left) || 0;
    const top = parseInt(dragState.icon.style.top) || 0;
    const snapped = snapToGrid(left, top);
    dragState.icon.style.left = snapped.x + "px";
    dragState.icon.style.top = snapped.y + "px";
    dragState.icon.classList.remove("dragging");
    saveIconPositions();
  }

  dragState = null;
}

function selectIcon(id: string): void {
  deselectAll();
  selectedIconId = id;
  const icon = document.querySelector<HTMLElement>(`.sgi-icon[data-window-id="${id}"]`);
  if (icon) {
    icon.classList.add("selected");
    playSound("/audio/sgi-icon-select.mp3");
  }
}

function deselectAll(): void {
  selectedIconId = null;
  document.querySelectorAll(".sgi-icon").forEach((icon) => {
    icon.classList.remove("selected");
  });
}
