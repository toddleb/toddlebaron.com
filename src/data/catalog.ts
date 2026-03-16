export interface CatalogItem {
  icon: string;
  label: string;
  description: string;
  url?: string;
  tags?: string[];
}

export interface CatalogCategory {
  id: string;
  label: string;
  items: CatalogItem[];
}

export const catalog: CatalogCategory[] = [
  {
    id: "development",
    label: "Development",
    items: [
      { icon: "🌐", label: "Web Development", description: "Full-stack web applications with React, Next.js, Astro, and TypeScript", tags: ["React", "Next.js", "TypeScript"] },
      { icon: "📱", label: "Mobile", description: "Cross-platform mobile development", tags: ["React Native", "Swift"] },
      { icon: "🔧", label: "CLI Tools", description: "Command-line tools and developer utilities", tags: ["Node.js", "Go"] },
      { icon: "🗄️", label: "Databases", description: "PostgreSQL, Redis, vector databases, and data modeling", tags: ["PostgreSQL", "Prisma", "pgvector"] },
    ],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    items: [
      { icon: "🤖", label: "AI Agents", description: "Autonomous AI agent systems and orchestration platforms", tags: ["Claude", "GPT", "Agent SDK"] },
      { icon: "🧠", label: "RAG Systems", description: "Retrieval-augmented generation with vector search", tags: ["Embeddings", "pgvector", "Pinecone"] },
      { icon: "📊", label: "ML Pipelines", description: "Model training, evaluation, and deployment workflows", tags: ["Python", "TensorFlow"] },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    items: [
      { icon: "☁️", label: "Cloud & DevOps", description: "Cloud infrastructure, CI/CD pipelines, and deployment automation", tags: ["Vercel", "Cloudflare", "GitHub Actions"] },
      { icon: "🐳", label: "Containers", description: "Docker, Kubernetes, and container orchestration", tags: ["Docker", "K8s"] },
      { icon: "🔐", label: "Security", description: "Authentication, authorization, and security auditing", tags: ["OAuth", "RBAC"] },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { icon: "⚡", label: "Turborepo", description: "Monorepo build orchestration and caching", tags: ["Turborepo", "pnpm"] },
      { icon: "📝", label: "Documentation", description: "Technical writing, API docs, and knowledge bases", tags: ["MDX", "Astro"] },
      { icon: "🎨", label: "Design Systems", description: "Component libraries, theming, and UI frameworks", tags: ["Tailwind", "Radix UI"] },
    ],
  },
];
