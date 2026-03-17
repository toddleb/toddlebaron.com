export interface ShelfItem {
  windowId: string;
  icon: string;
  label: string;
}

export interface DockItem {
  windowId: string;
  icon: string;
  label: string;
  easterEgg?: boolean;
}

export const shelfItems: ShelfItem[] = [
  { windowId: "about", icon: "🏠", label: "Home" },
  { windowId: "resume", icon: "📄", label: "Resume" },
  { windowId: "projects", icon: "📁", label: "Projects" },
  { windowId: "blog", icon: "📬", label: "Blog" },
  { windowId: "computing-history", icon: "🖥️", label: "Museum" },
  { windowId: "contact", icon: "💬", label: "Contact" },
];

export const dockItems: DockItem[] = [
  { windowId: "about", icon: "🖥️", label: "Workspace" },
  { windowId: "contact", icon: "🖳", label: "Terminal" },
  { windowId: "fractals", icon: "🌀", label: "Fractals", easterEgg: true },
  { windowId: "godzilla", icon: "🦎", label: "Godzilla", easterEgg: true },
  { windowId: "music", icon: "🎵", label: "Music", easterEgg: true },
];
