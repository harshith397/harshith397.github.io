/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Planetary Skills Data & Gowtham Oleti Thematic Palettes
 * ─────────────────────────────────────────────────────────────────────────────
 * Easily experiment with different color combos by changing ACTIVE_PALETTE below!
 */

// ── PALETTE COMBO 1: "Gowtham Earthy Editorial" (Default) ────────────────────
// Natural, tactile tones inspired by Gowtham Oleti's case studies:
// Warm Amber, Terracotta, Sage/Matcha, Slate Navy, Celadon Jade & Plum.
export const PALETTE_EARTHY = {
  languages: {
    accent: "#d97706", // warm solar amber (user favorite!)
    glow: "rgba(217, 119, 6, 0.25)",
    border: "#fbbf24",
    bgLight: "#fffbeb",
  },
  frontend: {
    accent: "#0284c7", // clear sky cyan / royal blue
    glow: "rgba(2, 132, 199, 0.24)",
    border: "#7dd3fc",
    bgLight: "#f0f9ff",
  },
  backend: {
    accent: "#4d7c0f", // organic sage / matcha olive
    glow: "rgba(77, 124, 15, 0.24)",
    border: "#a3e635",
    bgLight: "#f7fee7",
  },
  databases: {
    accent: "#334155", // dusk slate / architectural navy
    glow: "rgba(51, 65, 85, 0.22)",
    border: "#94a3b8",
    bgLight: "#f8fafc",
  },
  devops: {
    accent: "#c2410c", // terracotta / warm burnt sienna
    glow: "rgba(194, 65, 12, 0.24)",
    border: "#fb923c",
    bgLight: "#fff7ed",
  },
  aiml: {
    accent: "#701a75", // vintage bordeaux / amethyst plum
    glow: "rgba(112, 26, 117, 0.22)",
    border: "#e879f9",
    bgLight: "#fdf4ff",
  },
  embedded: {
    accent: "#0f766e", // calm studio celadon / jade
    glow: "rgba(15, 118, 110, 0.22)",
    border: "#5eead4",
    bgLight: "#f0fdfa",
  },
};

// ── PALETTE COMBO 2: "Gowtham Studio Modern" ─────────────────────────────────
// Vibrant modern tech hues grounded in warm off-white surfaces.
export const PALETTE_STUDIO_MODERN = {
  languages: {
    accent: "#d97706", // warm amber
    glow: "rgba(217, 119, 6, 0.24)",
    border: "#fbbf24",
    bgLight: "#fffbeb",
  },
  frontend: {
    accent: "#0284c7", // vibrant sky cyan
    glow: "rgba(2, 132, 199, 0.24)",
    border: "#7dd3fc",
    bgLight: "#f0f9ff",
  },
  backend: {
    accent: "#059669", // emerald
    glow: "rgba(5, 150, 105, 0.24)",
    border: "#6ee7b7",
    bgLight: "#ecfdf5",
  },
  databases: {
    accent: "#4f46e5", // royal indigo
    glow: "rgba(79, 70, 229, 0.24)",
    border: "#a5b4fc",
    bgLight: "#eef2ff",
  },
  devops: {
    accent: "#ea580c", // sunset orange
    glow: "rgba(234, 88, 12, 0.24)",
    border: "#fdba74",
    bgLight: "#fff7ed",
  },
  aiml: {
    accent: "#7c3aed", // electric violet
    glow: "rgba(124, 58, 237, 0.24)",
    border: "#c4b5fd",
    bgLight: "#faf5ff",
  },
  embedded: {
    accent: "#0d9488", // teal
    glow: "rgba(13, 148, 136, 0.24)",
    border: "#5eead4",
    bgLight: "#f0fdfa",
  },
};

// ── PALETTE COMBO 3: "Gowtham Warm Minimalist / Golden Amber" ────────────────
// Variations centered around Gowtham's signature yellow/amber & warm neutral craft.
export const PALETTE_WARM_MINIMALIST = {
  languages: {
    accent: "#d97706",
    glow: "rgba(217, 119, 6, 0.26)",
    border: "#fbbf24",
    bgLight: "#fffbeb",
  },
  frontend: {
    accent: "#ca8a04",
    glow: "rgba(202, 138, 4, 0.24)",
    border: "#fde047",
    bgLight: "#fefce8",
  },
  backend: {
    accent: "#b45309",
    glow: "rgba(180, 83, 9, 0.22)",
    border: "#fcd34d",
    bgLight: "#fffdf5",
  },
  databases: {
    accent: "#78350f",
    glow: "rgba(120, 53, 15, 0.20)",
    border: "#f59e0b",
    bgLight: "#fffbeb",
  },
  devops: {
    accent: "#ea580c",
    glow: "rgba(234, 88, 12, 0.24)",
    border: "#fdba74",
    bgLight: "#fff7ed",
  },
  aiml: {
    accent: "#92400e",
    glow: "rgba(146, 64, 14, 0.22)",
    border: "#fde68a",
    bgLight: "#fffbeb",
  },
  embedded: {
    accent: "#a16207",
    glow: "rgba(161, 98, 7, 0.22)",
    border: "#fef08a",
    bgLight: "#fefce8",
  },
};

// 👉 CHOOSE YOUR ACTIVE PALETTE HERE:
// Options: PALETTE_EARTHY | PALETTE_STUDIO_MODERN | PALETTE_WARM_MINIMALIST
export const CURRENT_THEME = PALETTE_EARTHY;

export const PLANETARY_SKILLS_DATA = [
  {
    id: "languages",
    name: "Languages",
    shortName: "Languages",
    theme: CURRENT_THEME.languages,
    skills: [
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "TypeScript", icon: "SiTypescript", color: "#3178C6" },
      { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E" },
      { name: "Java", icon: "SiJava", color: "#E76F00" },
      { name: "C", icon: "SiC", color: "#283593" },
      { name: "GoLang", icon: "SiGo", color: "#00ADD8" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    shortName: "Frontend",
    theme: CURRENT_THEME.frontend,
    skills: [
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "React Native + Expo", icon: "SiExpo", color: "#000020" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    shortName: "Backend",
    theme: CURRENT_THEME.backend,
    skills: [
      { name: "FastAPI", icon: "SiFastapi", color: "#009688" },
      { name: "Express", icon: "SiExpress", color: "#000000" },
      
    ],
  },
  {
    id: "databases",
    name: "Databases",
    shortName: "Databases",
    theme: CURRENT_THEME.databases,
    skills: [
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#0064a5" },
      { name: "Redis", icon: "SiRedis", color: "#DC382D" },
      { name: "Chroma DB", icon: "SiChroma", color: "#FF6446" },
      { name: "SQLite", icon: "SiSqlite", color: "#003B57" },
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    shortName: "DevOps",
    theme: CURRENT_THEME.devops,
    skills: [
      { name: "Docker", icon: "SiDocker", color: "#2496ED" },
      { name: "Git", icon: "SiGit", color: "#F05032" },
      { name: "GitHub Actions", icon: "SiGithubactions", color: "#2088FF" },
    ],
  },
  {
    id: "aiml",
    name: "AI & ML",
    shortName: "AI & ML",
    theme: CURRENT_THEME.aiml,
    skills: [
      { name: "PyTorch", icon: "SiPytorch", color: "#EE4C2C" },
      { name: "Ollama", icon: "SiOllama", color: "#111111" },
      { name: "Hugging Face", icon: "SiHuggingface", color: "#FFD21E" },
    ],
  },
  {
    id: "embedded",
    name: "Embedded & IoT",
    shortName: "Embedded",
    theme: CURRENT_THEME.embedded,
    skills: [
      { name: "MQTT", icon: "SiMqtt", color: "#660066" },
      { name: "Arduino", icon: "SiArduino", color: "#00979D" },
      { name: "Raspberry Pi 3", icon: "SiRaspberrypi", color: "#C51A4A" },
    ],
  },
];

export default PLANETARY_SKILLS_DATA;
