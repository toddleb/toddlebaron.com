export interface Skill {
  label: string;
  value: number; // 0-100
  color: string;
}

export const skills: Skill[] = [
  { label: "TypeScript", value: 95, color: "#3178C6" },
  { label: "React", value: 90, color: "#61DAFB" },
  { label: "Next.js", value: 88, color: "#000000" },
  { label: "Go", value: 75, color: "#00ADD8" },
  { label: "Python", value: 80, color: "#3776AB" },
  { label: "PostgreSQL", value: 85, color: "#4169E1" },
  { label: "DevOps", value: 78, color: "#FF6C37" },
  { label: "AI/ML", value: 82, color: "#6B3FA0" },
];
