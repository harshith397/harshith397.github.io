import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiReact,
  SiFastapi,
  SiDocker,
  SiPostgresql,
  SiRedis,
  SiMongodb,
  SiTailwindcss,
  SiFlask,
  SiNodedotjs,
  SiTypescript,
  SiLangchain,
  SiHuggingface,
  SiMqtt,
  SiArduino,
  SiGit,
  SiLinux,
  SiGithubactions,
  SiSqlite,
  SiPython,
  SiVite,
  SiRaspberrypi,
  SiJavascript,
  SiExpress,
  SiMilvus,
  SiPytorch,
  SiExpo,
} from "@icons-pack/react-simple-icons";
import { Layers, Sparkles, Code2, Cpu } from "lucide-react";
import "../styles/planetarySkills.css";

// ── Official Chroma DB Vector Icon ─────────────────────────────────────────
const SiChroma = ({ size = 20, className = "", style, ...props }) => (
  <svg
    viewBox="17.36 -11.81 221.29 141.62"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  >
    <g transform="matrix(0.86440678,0,0,0.86440678,17.355932,-11.812063)">
      <ellipse fill="#ffde2d" cx="170.66679" cy="81.919838" rx="85.333206" ry="81.919838" />
      <ellipse fill="#327eff" cx="85.333206" cy="81.919838" rx="85.333206" ry="81.919838" />
      <path
        d="m 170.66679,81.919964 c 0,45.243426 -38.20536,81.919196 -85.333713,81.919196 V 81.919964 Z M 85.333205,81.919836 C 85.333205,36.676791 123.53819,8.9599821e-5 170.66679,8.9599821e-5 V 81.919836 Z"
        fill="#ff6446"
      />
    </g>
  </svg>
);

// ── Simple Icon Registry ───────────────────────────────────────────────────
const TECH_ICON_MAP = {
  React: { icon: SiReact, color: "#61DAFB" },
  "React Native": { icon: SiReact, color: "#61DAFB" },
  Expo: { icon: SiExpo, color: "#000020" },
  "React Native + Expo": { icon: SiExpo, color: "#000020" },
  FastAPI: { icon: SiFastapi, color: "#009688" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  Redis: { icon: SiRedis, color: "#DC382D" },
  "Chroma DB": { icon: SiChroma, color: "#FF6446" },
  Chroma: { icon: SiChroma, color: "#FF6446" },
  ChromaDB: { icon: SiChroma, color: "#FF6446" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Flask: { icon: SiFlask, color: "#18181b" },
  "Node.js": { icon: SiNodedotjs, color: "#339933" },
  Express: { icon: SiExpress, color: "#000000" },
  "Express.js": { icon: SiExpress, color: "#000000" },
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  JS: { icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  LangChain: { icon: SiLangchain, color: "#1C3C3C" },
  "Hugging Face": { icon: SiHuggingface, color: "#FFD21E" },
  PyTorch: { icon: SiPytorch, color: "#EE4C2C" },
  Milvus: { icon: SiMilvus, color: "#00A1EA" },
  "Milvus (Vector DB)": { icon: SiMilvus, color: "#00A1EA" },
  MQTT: { icon: SiMqtt, color: "#660066" },
  Arduino: { icon: SiArduino, color: "#00979D" },
  "Raspberry Pi": { icon: SiRaspberrypi, color: "#C51A4A" },
  "Raspberry Pi 3": { icon: SiRaspberrypi, color: "#C51A4A" },
  Git: { icon: SiGit, color: "#F05032" },
  Linux: { icon: SiLinux, color: "#FCC624" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088FF" },
  SQLite: { icon: SiSqlite, color: "#003B57" },
  Python: { icon: SiPython, color: "#3776AB" },
  Vite: { icon: SiVite, color: "#646CFF" },
  "Groq API": { icon: Sparkles, color: "#F59E0B" },
};

/**
 * 2D Planetary / Orbital Tech Stack Globe for Project Page
 * Architecture:
 * - Single Central Globe representing the project stack (no category row)
 * - Equidistant circular orbital satellite ring for each technology
 * - Trigonometric coordinate distribution (θ = 2π * i / N - π/2)
 * - Themed dashed celestial orbit and gravitational connecting beams
 */
const ProjectTechGlobe = ({
  techStack = [],
  projectTitle = "Project",
  projectTag = "Completed",
}) => {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTinyScreen = windowWidth < 380;
  const isMobile = windowWidth < 640;

  // Curated theme based on project status
  const theme = useMemo(() => {
    if (projectTag === "Completed") {
      return {
        accent: "#059669",
        border: "#6ee7b7",
        bgLight: "#ecfdf5",
        glow: "rgba(5, 150, 105, 0.22)",
      };
    }
    if (projectTag === "Discontinued") {
      return {
        accent: "#6366f1",
        border: "#a5b4fc",
        bgLight: "#eef2ff",
        glow: "rgba(99, 102, 241, 0.22)",
      };
    }
    return {
      accent: "#d97706",
      border: "#fbbf24",
      bgLight: "#fffbeb",
      glow: "rgba(217, 119, 6, 0.22)",
    };
  }, [projectTag]);

  // Dynamic Responsive Orbit Radius
  const orbitRadius = useMemo(() => {
    if (isTinyScreen) return 110;
    if (isMobile) return 126;
    return 164;
  }, [isTinyScreen, isMobile]);

  // Trigonometric distribution of tech badges around central globe
  const orbitalBadges = useMemo(() => {
    if (!techStack || techStack.length === 0) return [];
    const total = techStack.length;

    return techStack.map((name, index) => {
      const match = TECH_ICON_MAP[name];
      const Icon = match?.icon || Code2;
      const color = match?.color || "#18181b";

      const angle = (2 * Math.PI * index) / total - Math.PI / 2;
      const x = Math.round(orbitRadius * Math.cos(angle));
      const y = Math.round(orbitRadius * Math.sin(angle));

      return {
        name,
        Icon,
        color,
        index,
        x,
        y,
        angle,
      };
    });
  }, [techStack, orbitRadius]);

  const satelliteVariants = {
    initial: {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.2,
    },
    animate: (custom) => ({
      x: custom.x,
      y: custom.y,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 24,
        delay: custom.index * 0.05,
      },
    }),
  };

  return (
    <div
      className="w-full flex justify-center items-center py-4 select-none"
      style={{
        "--globe-border-color": theme.border,
        "--globe-bg-light": theme.bgLight,
        "--globe-glow": theme.glow,
      }}
    >
      <div
        className="planetary-stage-zone"
        style={{
          height: isTinyScreen ? "350px" : isMobile ? "390px" : "450px",
          maxWidth: isTinyScreen ? "320px" : isMobile ? "360px" : "500px",
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* 
            ── ORBITAL TRACK & GRAVITATIONAL CONNECTING BEAMS ──
            Pure dotted/dashed themed orbital trajectory without underlying solid track
          */}
          <svg
            className="planetary-orbit-track"
            viewBox="-250 -250 500 500"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Themed dashed orbital ring */}
            <circle
              cx="0"
              cy="0"
              r={orbitRadius}
              fill="none"
              stroke={theme.accent}
              strokeWidth="1.75"
              strokeDasharray="6 6"
              opacity="0.75"
            />

            {/* Inner concentric subtle guide ring */}
            <circle
              cx="0"
              cy="0"
              r={isTinyScreen ? 56 : isMobile ? 66 : 84}
              fill="none"
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Gravitational Connecting Beams from Central Globe to Active Tech Badges */}
            {orbitalBadges.map((badge) => {
              const isHovered = hoveredTech === badge.name;
              return (
                <line
                  key={`ray-${badge.name}`}
                  x1="0"
                  y1="0"
                  x2={badge.x}
                  y2={badge.y}
                  stroke={isHovered ? badge.color : "rgba(0, 0, 0, 0.12)"}
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  strokeDasharray={isHovered ? "none" : "3 4"}
                  opacity={isHovered ? 0.9 : 0.6}
                  style={{
                    transition:
                      "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease",
                  }}
                />
              );
            })}
          </svg>

          {/* 
          {/* 
            ── SINGLE ACTIVE CENTRAL GLOBE (APPLE HIG SPECULAR MATERIAL) ──
            Dedicated 2D specular glass globe representing project stack
          */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 24,
              duration: 0.35,
            }}
            style={{
              background: `radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.78) 55%, ${theme.bgLight} 100%)`,
              boxShadow: `inset 0 2px 4px 0 rgba(255, 255, 255, 0.98), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.035), 0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 6px 18px -4px rgba(0, 0, 0, 0.04), 0 0 34px ${theme.glow}`,
            }}
            className={`planetary-central-globe ${
              isTinyScreen
                ? "w-[110px] h-[110px] p-2"
                : isMobile
                ? "w-[124px] h-[124px] p-3"
                : "w-[144px] h-[144px] p-4"
            }`}
          >
            {/* Outer atmospheric decorative orbit ring */}
            <div
              className="planetary-globe-pulse-ring"
              style={{ borderColor: theme.border }}
            />

            {/* Native SF Symbol Vector Icon */}
            <div
              className="transition-transform duration-300 flex items-center justify-center mb-1"
              style={{
                color: theme.accent,
              }}
            >
              <Layers
                size={isTinyScreen ? 20 : isMobile ? 24 : 26}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Globe Title & Count — Apple HIG Typography */}
            <span
              className={`font-semibold text-zinc-900 leading-tight tracking-tight text-center select-none ${
                isTinyScreen ? "text-xs" : isMobile ? "text-[13px]" : "text-sm"
              }`}
              style={{ letterSpacing: "-0.2px" }}
            >
              Tech Stack
            </span>
            <span className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {techStack.length} {techStack.length === 1 ? "Technology" : "Technologies"}
            </span>
          </motion.div>

          {/* 
            ── SATELLITE TECH BADGES ──
            Equidistant orbital ring displaying brand icons and tech names
          */}
          <div className="absolute inset-0 pointer-events-none">
            {orbitalBadges.map((badge) => {
              const { Icon } = badge;
              const isHovered = hoveredTech === badge.name;

              return (
                <motion.div
                  key={badge.name}
                  custom={badge}
                  variants={satelliteVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    pointerEvents: "auto",
                  }}
                  className="origin-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onMouseEnter={() => setHoveredTech(badge.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                    style={{
                      borderColor: isHovered
                        ? badge.color
                        : "rgba(0, 0, 0, 0.12)",
                      borderWidth: "1.5px",
                      boxShadow: isHovered
                        ? `0 12px 28px ${badge.color}28, 0 3px 8px rgba(0, 0, 0, 0.06)`
                        : "0 3px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
                    }}
                    className={`planetary-satellite-badge -translate-x-1/2 -translate-y-1/2 ${
                      isTinyScreen
                        ? "px-2 py-1 gap-1.5 text-[11px]"
                        : isMobile
                        ? "px-2.5 py-1 gap-2 text-xs"
                        : "px-3.5 py-1.5 gap-2.5 text-sm"
                    }`}
                  >
                    {/* Brand Icon Chip */}
                    <div
                      className={`planetary-skill-icon-chip ${
                        isTinyScreen
                          ? "w-5 h-5"
                          : isMobile
                          ? "w-6 h-6"
                          : "w-7 h-7"
                      }`}
                      style={{
                        backgroundColor: `${badge.color}15`,
                        border: `1px solid ${badge.color}35`,
                      }}
                    >
                      <Icon
                        size={isTinyScreen ? 11 : isMobile ? 13 : 15}
                        color={
                          badge.color !== "currentColor"
                            ? badge.color
                            : undefined
                        }
                      />
                    </div>

                    {/* Tech Name */}
                    <span className="font-semibold text-zinc-900 leading-none">
                      {badge.name}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTechGlobe;
