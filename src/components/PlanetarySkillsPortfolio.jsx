import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiPython,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFastapi,
  SiNodedotjs,
  SiHuggingface,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSqlite,
  SiDocker,
  SiGit,
  SiLinux,
  SiGithubactions,
  SiC,
  SiOpenjdk,
  SiGo,
  SiMqtt,
  SiArduino,
  SiOllama,
  SiRaspberrypi,
  SiJavascript,
  SiExpress,
  SiMilvus,
  SiPytorch,
  SiExpo,
} from "@icons-pack/react-simple-icons";
import {
  Terminal,
  Layers,
  Database,
  Wrench,
  Cpu,
  Sparkles,
  Code2,
  Orbit,
} from "lucide-react";
import { PLANETARY_SKILLS_DATA } from "../data/skills";
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
const ICON_MAP = {
  SiPython,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFastapi,
  SiNodedotjs,
  SiHuggingface,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSqlite,
  SiDocker,
  SiGit,
  SiLinux,
  SiGithubactions,
  SiC,
  SiJava: SiOpenjdk,
  SiOpenjdk,
  SiGo,
  SiMqtt,
  SiArduino,
  SiOllama,
  SiRaspberrypi,
  SiJavascript,
  SiExpress,
  SiMilvus,
  SiPytorch,
  SiExpo,
  SiChroma,
  Chroma: SiChroma,
  ChromaDB: SiChroma,
};

// ── Category Icon Registry ────────────────────────────────────────────────
const CATEGORY_ICON_MAP = {
  languages: Code2,
  frontend: Layers,
  backend: Terminal,
  databases: Database,
  devops: Wrench,
  aiml: Sparkles,
  embedded: Cpu,
};

// Helper: Normalize skill string or object
const normalizeSkill = (skill) => {
  if (typeof skill === "string") {
    const matchedKey = Object.keys(ICON_MAP).find((k) =>
      k.toLowerCase().includes(skill.toLowerCase())
    );
    return {
      name: skill,
      Icon: matchedKey ? ICON_MAP[matchedKey] : null,
      color: "#18181b",
    };
  }
  return {
    name: skill.name,
    Icon: skill.icon ? ICON_MAP[skill.icon] : null,
    color: skill.color || "#18181b",
  };
};

/**
 * 2D Planetary / Orbital Skills Selector Component
 * Master-Detail Architecture:
 * - Header Zone: Neutral Minimized Navigation Row with dynamic edge-fade mask
 * - Stage Zone: Slidable/swipeable Active Central Globe with dynamic trigonometric satellite orbit
 */
const PlanetarySkillsPortfolio = ({
  data = PLANETARY_SKILLS_DATA,
  initialCategoryId = null,
  className = "",
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState(
    initialCategoryId || (data.length > 0 ? data[0].id : null)
  );
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const stageRef = useRef(null);
  const navContainerRef = useRef(null);
  const buttonRefs = useRef({});

  // Responsive breakpoint tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check scroll boundary state for dynamic edge-fade gradient masking
  const checkScrollState = () => {
    const el = navContainerRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 6;
    const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 6;
    setScrollState({ canScrollLeft: canLeft, canScrollRight: canRight });
  };

  useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [data, activeCategoryId]);

  const isFirstRender = useRef(true);

  // Auto-scroll active category pill horizontally into center view only on user category change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const targetNode = buttonRefs.current[activeCategoryId];
    const nav = navContainerRef.current;
    if (targetNode && nav) {
      const navRect = nav.getBoundingClientRect();
      const targetRect = targetNode.getBoundingClientRect();
      const offset =
        targetRect.left - navRect.left - nav.clientWidth / 2 + targetNode.clientWidth / 2;
      nav.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScrollState, 320);
    }
  }, [activeCategoryId]);

  // Compute dynamic edge-fade mask: disappears when at ends, appears only when content remains
  const maskStyle = useMemo(() => {
    const { canScrollLeft, canScrollRight } = scrollState;
    if (!canScrollLeft && !canScrollRight) {
      return { maskImage: "none", WebkitMaskImage: "none" };
    }
    if (canScrollLeft && canScrollRight) {
      const gradient =
        "linear-gradient(to right, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)";
      return { maskImage: gradient, WebkitMaskImage: gradient };
    }
    if (!canScrollLeft && canScrollRight) {
      const gradient =
        "linear-gradient(to right, black 0%, black calc(100% - 24px), transparent 100%)";
      return { maskImage: gradient, WebkitMaskImage: gradient };
    }
    if (canScrollLeft && !canScrollRight) {
      const gradient =
        "linear-gradient(to right, transparent 0%, black 24px, black 100%)";
      return { maskImage: gradient, WebkitMaskImage: gradient };
    }
    return { maskImage: "none", WebkitMaskImage: "none" };
  }, [scrollState]);

  const isTinyScreen = windowWidth < 380;
  const isMobile = windowWidth < 640;

  // Active Category Object & Index
  const currentIndex = useMemo(() => {
    const idx = data.findIndex((c) => c.id === activeCategoryId);
    return idx >= 0 ? idx : 0;
  }, [data, activeCategoryId]);

  const activeCategory = data[currentIndex] || data[0];

  const activeTheme = activeCategory?.theme || {
    accent: "#d97706",
    glow: "rgba(217, 119, 6, 0.25)",
    border: "#fbbf24",
    bgLight: "#fffbeb",
  };

  // Next / Previous Navigation Handlers for Swipe / Drag
  const handlePrevCategory = () => {
    const prevIdx = (currentIndex - 1 + data.length) % data.length;
    setActiveCategoryId(data[prevIdx].id);
  };

  const handleNextCategory = () => {
    const nextIdx = (currentIndex + 1) % data.length;
    setActiveCategoryId(data[nextIdx].id);
  };

  // Dynamic Responsive Orbit Radius calibrated with larger mobile globe size
  const orbitRadius = useMemo(() => {
    if (isTinyScreen) return 106;
    if (isMobile) return 126;
    return 174;
  }, [isTinyScreen, isMobile]);

  // Dynamic Trigonometric Orbital Coordinates
  // θ = (2 * π * index) / totalSkills - (π / 2) -> starts at 12 o'clock for visual balance
  // X = R * cos(θ), Y = R * sin(θ)
  const orbitalSkills = useMemo(() => {
    if (!activeCategory || !activeCategory.skills) return [];
    const totalSkills = activeCategory.skills.length;

    return activeCategory.skills.map((rawSkill, index) => {
      const normalized = normalizeSkill(rawSkill);
      const angle = (2 * Math.PI * index) / totalSkills - Math.PI / 2;
      const x = Math.round(orbitRadius * Math.cos(angle));
      const y = Math.round(orbitRadius * Math.sin(angle));

      return {
        ...normalized,
        index,
        x,
        y,
        angle,
      };
    });
  }, [activeCategory, orbitRadius]);

  const CategoryIcon =
    CATEGORY_ICON_MAP[activeCategory?.id] || Orbit;

  // Staggered fan-out animation variants bursting outward from (0,0) to (X,Y)
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
        delay: custom.index * 0.045, // 300ms-400ms staggered fan-out burst
      },
    }),
    exit: {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.2,
      transition: {
        duration: 0.18,
        ease: "easeIn",
      },
    },
  };

  return (
    <div
      className={`planetary-container ${className}`}
      style={{
        "--globe-border-color": activeTheme.border,
        "--globe-bg-light": activeTheme.bgLight,
        "--globe-glow": activeTheme.glow,
      }}
    >
      {/* 
        ── 1. HEADER ZONE (Clean Neutral Gowtham Linear Dock) ──
        Features dynamic edge-fade gradient masking that disappears when reaching
        the ends of the list and appears only when more items exist to explore!
      */}
      <div className="planetary-nav-scroll-wrapper" style={maskStyle}>
        <nav
          ref={navContainerRef}
          aria-label="Skills categories"
          className="planetary-header-zone"
        >
          {data.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            const NodeIcon = CATEGORY_ICON_MAP[cat.id] || Orbit;

            return (
              <button
                key={cat.id}
                ref={(el) => (buttonRefs.current[cat.id] = el)}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`planetary-nav-node ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
              >
                {/* Concentric active pill: perfectly matches button's rounded-full bounds */}
                {isActive && (
                  <motion.div
                    layoutId="activePlanetaryPill"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.04)] border border-black/[0.08] pointer-events-none z-0"
                    transition={{ type: "spring", stiffness: 440, damping: 32 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <NodeIcon
                    size={isMobile ? 14 : 16}
                    className={isActive ? "text-zinc-950" : "text-zinc-400"}
                  />
                  <span className={isActive ? "text-zinc-950 font-semibold" : "text-zinc-600 font-medium"}>
                    {cat.shortName || cat.name}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 
        ── 2. STAGE ZONE (SWIPEABLE/DRAGGABLE CELESTIAL STAGE) ──
        Slidable without nav arrows using mouse drag or finger swipe on phones/tablets!
      */}
      <div
        ref={stageRef}
        className="planetary-stage-zone"
        role="region"
        aria-label={`Orbital display for ${activeCategory?.name}. Swipe or drag horizontally to change category.`}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragEnd={(e, { offset, velocity }) => {
            const swipeThreshold = 45;
            if (offset.x < -swipeThreshold || velocity.x < -300) {
              handleNextCategory();
            } else if (offset.x > swipeThreshold || velocity.x > 300) {
              handlePrevCategory();
            }
          }}
          className="planetary-stage-drag-area"
          title="Swipe or drag to change category"
        >
          {/* 
            ── ORBITAL TRACK & GRAVITATIONAL CONNECTING RAYS ──
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
              stroke={activeTheme.accent}
              strokeWidth="1.75"
              strokeDasharray="6 6"
              opacity="0.75"
              style={{
                transition: "stroke 0.3s ease, opacity 0.3s ease",
              }}
            />

            {/* Inner concentric guide ring */}
            <circle
              cx="0"
              cy="0"
              r={isTinyScreen ? 58 : isMobile ? 68 : 88}
              fill="none"
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Gravitational Connecting Beams from Central Globe to Active Satellites */}
            {orbitalSkills.map((skill) => {
              const isHovered = hoveredSkill === skill.name;
              return (
                <line
                  key={`grav-ray-${skill.name}`}
                  x1="0"
                  y1="0"
                  x2={skill.x}
                  y2={skill.y}
                  stroke={isHovered ? skill.color : "rgba(0, 0, 0, 0.12)"}
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  strokeDasharray={isHovered ? "none" : "3 4"}
                  opacity={isHovered ? 0.9 : 0.6}
                  style={{
                    transition: "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease",
                  }}
                />
              );
            })}
          </svg>

          {/* 
            ── ACTIVE CENTRAL GLOBE (LARGER TACTILE CELESTIAL HUB) ──
            Increased diameter on mobile screens for confident visual presence
            (Completely dot-free)
          */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory?.id}
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.86, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 26,
                duration: 0.35,
              }}
              style={{
                background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${activeTheme.bgLight} 55%, #eef0f3 100%)`,
                borderColor: activeTheme.border,
                borderWidth: "2px",
                boxShadow: `0 0 38px ${activeTheme.glow}, 0 16px 36px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.95)`,
              }}
              className={`planetary-central-globe ${
                isTinyScreen
                  ? "w-[118px] h-[118px] p-2.5"
                  : isMobile
                  ? "w-[136px] h-[136px] p-3.5"
                  : "w-[164px] h-[164px] p-4"
              }`}
            >
              {/* Outer atmospheric pulse ring */}
              <div
                className="planetary-globe-pulse-ring"
                style={{
                  borderColor: activeTheme.border,
                }}
              />

              {/* Category Icon Badge */}
              <div
                className={`rounded-full mb-1.5 sm:mb-2 shadow-xs transition-transform ${
                  isTinyScreen ? "p-2" : isMobile ? "p-2.5" : "p-3"
                }`}
                style={{
                  backgroundColor: "#ffffff",
                  border: `1.5px solid ${activeTheme.border}`,
                  color: activeTheme.accent,
                  boxShadow: `0 2px 8px ${activeTheme.glow}`,
                }}
              >
                <CategoryIcon size={isTinyScreen ? 18 : isMobile ? 20 : 24} />
              </div>

              {/* Category Name - Clean, bold & prominent */}
              <h3
                className={`font-bold text-zinc-950 leading-tight tracking-tight ${
                  isTinyScreen
                    ? "text-xs max-w-[90px]"
                    : isMobile
                    ? "text-sm max-w-[105px]"
                    : "text-base max-w-[130px]"
                }`}
              >
                {activeCategory?.name}
              </h3>
            </motion.div>
          </AnimatePresence>

          {/* 
            ── SATELLITE SKILL BADGES (EQUIDISTANT ORBITAL RING) ──
            Displays ONLY the official brand icon image and skill name.
          */}
          <AnimatePresence mode="wait">
            <div
              key={`orbit-group-${activeCategory?.id}`}
              className="absolute inset-0 pointer-events-none"
            >
              {orbitalSkills.map((skill) => {
                const { Icon } = skill;
                const isHovered = hoveredSkill === skill.name;

                return (
                  <motion.div
                    key={`${activeCategory.id}-${skill.name}`}
                    custom={skill}
                    variants={satelliteVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
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
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      style={{
                        borderColor: isHovered ? skill.color : "rgba(0, 0, 0, 0.12)",
                        borderWidth: "1.5px",
                        boxShadow: isHovered
                          ? `0 12px 28px ${skill.color}28, 0 3px 8px rgba(0, 0, 0, 0.06)`
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
                      {/* Dedicated Brand Icon Chip */}
                      <div
                        className={`planetary-skill-icon-chip ${
                          isTinyScreen ? "w-5 h-5" : isMobile ? "w-6 h-6" : "w-7 h-7"
                        }`}
                        style={{
                          backgroundColor: `${skill.color}15`,
                          border: `1px solid ${skill.color}35`,
                        }}
                      >
                        {Icon ? (
                          <Icon
                            size={isTinyScreen ? 11 : isMobile ? 13 : 15}
                            color={skill.color !== "currentColor" ? skill.color : undefined}
                          />
                        ) : (
                          <span
                            className="text-[10px] font-bold font-mono"
                            style={{ color: skill.color }}
                          >
                            {skill.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Skill Name */}
                      <span className="font-semibold text-zinc-900 leading-none">
                        {skill.name}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default PlanetarySkillsPortfolio;
