interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  contentUrl?: string;
}

let windows: Map<string, WindowState> = new Map();
let topZ = 100;
let activeWindowId: string | null = null;

let dragState: {
  windowId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
} | null = null;

let resizeState: {
  windowId: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
} | null = null;

export function registerWindow(id: string, title: string, opts?: Partial<WindowState>): void {
  const win: WindowState = {
    id,
    title,
    x: opts?.x ?? 100 + windows.size * 30,
    y: opts?.y ?? 60 + windows.size * 30,
    width: opts?.width ?? 500,
    height: opts?.height ?? 400,
    zIndex: ++topZ,
    minimized: false,
    maximized: false,
    contentUrl: opts?.contentUrl,
  };
  windows.set(id, win);
}

export function openWindow(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  win.minimized = false;
  bringToFront(id);
  applyWindowPosition(id);
  const el = getWindowEl(id);
  if (el) {
    el.style.display = "flex";
    el.classList.add("opening");
    setTimeout(() => el.classList.remove("opening"), 200);
  }
  document.dispatchEvent(new CustomEvent("wm:window-opened", { detail: { id } }));
}

export function closeWindow(id: string): void {
  const el = getWindowEl(id);
  if (el) el.style.display = "none";
  if (activeWindowId === id) activeWindowId = null;
  document.dispatchEvent(new CustomEvent("wm:window-closed", { detail: { id } }));
}

export function minimizeWindow(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  win.minimized = true;
  const el = getWindowEl(id);
  if (el) el.style.display = "none";
  if (activeWindowId === id) activeWindowId = null;
  document.dispatchEvent(new CustomEvent("wm:window-minimized", { detail: { id } }));
}

export function maximizeWindow(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  if (win.maximized) {
    win.maximized = false;
    applyWindowPosition(id);
  } else {
    win.maximized = true;
    const el = getWindowEl(id);
    if (el) {
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.width = "100vw";
      el.style.height = "calc(100vh - 32px)";
    }
  }
}

export function bringToFront(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  win.zIndex = ++topZ;
  activeWindowId = id;
  const el = getWindowEl(id);
  if (el) el.style.zIndex = String(win.zIndex);
  document.querySelectorAll("[data-window-id]").forEach((w) => {
    w.classList.toggle("active", w.getAttribute("data-window-id") === id);
  });
}

export function startDrag(id: string, e: MouseEvent): void {
  const win = windows.get(id);
  if (!win || win.maximized) return;
  bringToFront(id);
  dragState = {
    windowId: id,
    startX: win.x,
    startY: win.y,
    offsetX: e.clientX - win.x,
    offsetY: e.clientY - win.y,
  };
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);
}

function onDragMove(e: MouseEvent): void {
  if (!dragState) return;
  const win = windows.get(dragState.windowId);
  if (!win) return;
  win.x = e.clientX - dragState.offsetX;
  win.y = Math.max(0, e.clientY - dragState.offsetY);
  applyWindowPosition(dragState.windowId);
}

function onDragEnd(): void {
  dragState = null;
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
}

export function startResize(id: string, e: MouseEvent): void {
  const win = windows.get(id);
  if (!win || win.maximized) return;
  e.preventDefault();
  e.stopPropagation();
  bringToFront(id);
  resizeState = {
    windowId: id,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: win.width,
    startHeight: win.height,
  };
  document.addEventListener("mousemove", onResizeMove);
  document.addEventListener("mouseup", onResizeEnd);
}

function onResizeMove(e: MouseEvent): void {
  if (!resizeState) return;
  const win = windows.get(resizeState.windowId);
  if (!win) return;
  win.width = Math.max(300, resizeState.startWidth + (e.clientX - resizeState.startX));
  win.height = Math.max(200, resizeState.startHeight + (e.clientY - resizeState.startY));
  applyWindowPosition(resizeState.windowId);
}

function onResizeEnd(): void {
  resizeState = null;
  document.removeEventListener("mousemove", onResizeMove);
  document.removeEventListener("mouseup", onResizeEnd);
}

function applyWindowPosition(id: string): void {
  const win = windows.get(id);
  if (!win) return;
  const el = getWindowEl(id);
  if (!el) return;
  el.style.left = `${win.x}px`;
  el.style.top = `${win.y}px`;
  el.style.width = `${win.width}px`;
  el.style.height = `${win.height}px`;
  el.style.zIndex = String(win.zIndex);
}

function getWindowEl(id: string): HTMLElement | null {
  return document.querySelector(`[data-window-id="${id}"]`);
}

export function getWindows(): Map<string, WindowState> {
  return windows;
}

export function getActiveWindowId(): string | null {
  return activeWindowId;
}

export function initKeyboardNav(): void {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeWindowId) {
      closeWindow(activeWindowId);
    }
  });
}
