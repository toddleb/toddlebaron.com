export interface FMFile {
  id: string;
  label: string;
  icon: string;
  description: string;
  date?: string;
  size?: string;
  url?: string;
}

export interface FMFolder {
  id: string;
  label: string;
  icon?: string;
  children?: FMFolder[];
  files?: FMFile[];
}

export const filesystem: FMFolder = {
  id: "root",
  label: "/home/todd",
  children: [
    {
      id: "development",
      label: "Development",
      icon: "📂",
      children: [
        {
          id: "web",
          label: "Web",
          icon: "📂",
          files: [
            { id: "toddlebaron", label: "toddlebaron.com", icon: "🌐", description: "Personal website — SGI IRIX desktop simulation", date: "2026-03-15", size: "Astro 6" },
            { id: "aicr", label: "AICR Platform", icon: "🏢", description: "Enterprise AI governance platform", date: "2026-03-15", size: "Next.js 16", url: "https://app.aicoderally.com" },
          ],
        },
        {
          id: "ai",
          label: "AI",
          icon: "📂",
          files: [
            { id: "prizym", label: "Prizym ICM", icon: "💎", description: "Incentive compensation management engine", date: "2026-03-14", size: "Go + TS" },
            { id: "agents", label: "Agent Systems", icon: "🤖", description: "Autonomous AI agent orchestration", date: "2026-03-10", size: "Claude SDK" },
          ],
        },
        {
          id: "opensource",
          label: "Open Source",
          icon: "📂",
          files: [
            { id: "contrib1", label: "Contributions", icon: "🔀", description: "Open source contributions and patches", date: "2026-02", size: "Various" },
          ],
        },
      ],
    },
    {
      id: "writing",
      label: "Writing",
      icon: "📂",
      children: [
        {
          id: "blog",
          label: "Blog",
          icon: "📂",
          files: [
            { id: "sgi-post", label: "Building an SGI Desktop", icon: "📝", description: "How I recreated the Indigo Magic desktop in a browser", date: "2026-03-15" },
          ],
        },
      ],
    },
    {
      id: "career",
      label: "Career",
      icon: "📂",
      files: [
        { id: "resume", label: "Resume.pdf", icon: "📄", description: "Current resume and work history", date: "2026-03" },
        { id: "linkedin", label: "LinkedIn", icon: "💼", description: "Professional profile", url: "https://linkedin.com/in/toddlebaron" },
      ],
    },
  ],
};
