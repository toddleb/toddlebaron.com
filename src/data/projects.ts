export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  techStack: string[];
  status: "live" | "active" | "archived" | "prototype";
  url?: string;
}

export const categories = ["Enterprise", "Creative", "Military", "Open Source"] as const;

export const projects: Project[] = [
  {
    id: "aicr",
    name: "AICR Platform",
    category: "Enterprise",
    description: "Enterprise governance platform for AI-assisted development. Policy enforcement, usage metering, audit trails, and multi-tenant governance.",
    techStack: ["Next.js", "TypeScript", "Go", "PostgreSQL", "gRPC"],
    status: "live",
    url: "https://app.aicoderally.com",
  },
  {
    id: "prizym",
    name: "Prizym ICM",
    category: "Enterprise",
    description: "Incentive compensation management platform. Plan modeling, calculation engine, dispute resolution.",
    techStack: ["Next.js", "TypeScript", "Go", "PostgreSQL"],
    status: "active",
  },
  {
    id: "bhg",
    name: "Blue Horizons Group",
    category: "Enterprise",
    description: "SPM consulting channel partner. SPARCC suite deployment for sales performance management.",
    techStack: ["Next.js", "TypeScript", "Prisma"],
    status: "active",
  },
  {
    id: "ispm",
    name: "ISPM Consulting",
    category: "Enterprise",
    description: "Custom SPM consulting platform. 30+ years of enterprise consulting distilled into software.",
    techStack: ["Next.js", "TypeScript"],
    status: "live",
  },
  {
    id: "minethegap",
    name: "MineTheGap",
    category: "Creative",
    description: "Fractal art exploration and rendering. Mathematical beauty at infinite zoom.",
    techStack: ["TypeScript", "WebGL", "Canvas"],
    status: "active",
  },
  {
    id: "toddlebaron",
    name: "toddlebaron.com",
    category: "Creative",
    description: "This website. Three themed eras: BBS terminal, SGI IRIX desktop, NeXTSTEP Color.",
    techStack: ["Astro", "TypeScript", "CSS"],
    status: "live",
    url: "https://toddlebaron.com",
  },
  {
    id: "navy",
    name: "U.S. Navy Service",
    category: "Military",
    description: "Naval service record and contributions. Foundation for systems thinking and leadership.",
    techStack: [],
    status: "archived",
  },
  {
    id: "usaf-ai",
    name: "USAF AI Programs",
    category: "Military",
    description: "Air Force artificial intelligence initiatives and advisory work.",
    techStack: ["AI/ML", "Policy"],
    status: "archived",
  },
  {
    id: "stratcom",
    name: "STRATCOM",
    category: "Military",
    description: "Strategic Command consulting and support operations.",
    techStack: ["Systems Engineering"],
    status: "archived",
  },
  {
    id: "astro-themes",
    name: "Astro Theme Engine",
    category: "Open Source",
    description: "Multi-theme engine for Astro sites with day-of-week rotation and cookie overrides.",
    techStack: ["Astro", "TypeScript"],
    status: "active",
  },
];
