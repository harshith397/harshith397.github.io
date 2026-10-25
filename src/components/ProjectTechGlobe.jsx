import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
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
  SiVite,
  SiExpress,
  SiMilvus,
  SiPytorch,
  SiExpo,
  SiC,
  SiGo,
  SiOllama,
} from "@icons-pack/react-simple-icons";
import { Layers, Sparkles, Code2, Cpu } from "lucide-react";
import "../styles/projectTechGlobe.css";

// ── Official Multi-Color SVG Components ─────────────────────────────────────

// Official Chroma DB Vector Icon
const SiChroma = ({ size = 26, className = "" }) => (
  <svg
    viewBox="17.36 -11.81 221.29 141.62"
    width={size}
    height={size}
    className={className}
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

// Authentic Multi-Color Python Logo (Blue top snake + Yellow bottom snake + White eyes)
const OfficialPython = ({ size = 26, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path
      fill="#387eb8"
      d="M11.914 0C5.766 0 6.13 2.668 6.13 2.668l.006 2.766h5.882v.834H3.84s-3.84.436-3.84 6.146 3.35 6.01 3.35 6.01h2.003v-2.825s-.11-3.353 3.303-3.353h5.688s3.21.053 3.21-3.15V3.208S18.062 0 11.914 0zm-3.15 1.832a1.07 1.07 0 1 1 0 2.14 1.07 1.07 0 0 1 0-2.14z"
    />
    <path
      fill="#ffe052"
      d="M12.086 24c6.148 0 5.784-2.668 5.784-2.668l-.006-2.766H11.98v-.834h8.177s3.84-.436 3.84-6.146-3.35-6.01-3.35-6.01h-2.003v2.825s.11 3.353-3.303 3.353H9.646s-3.21-.053-3.21 3.15v5.884S5.938 24 12.086 24zm3.15-1.832a1.07 1.07 0 1 1 0-2.14 1.07 1.07 0 0 1 0 2.14z"
    />
  </svg>
);

// Authentic Multi-Color Raspberry Pi Logo (Green leaves + Magenta/red berry)
const OfficialRaspberryPi = ({ size = 26, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path
      fill="#78c043"
      d="M8.547 3.966c.46-.867 1.458-1.572 2.37-1.572.242 0 .445.05.586.136-.347.535-.745 1.343-.745 2.115 0 .227.034.423.091.59-.79-.052-1.748-.485-2.302-1.269zm6.906 0c-.554.784-1.512 1.217-2.302 1.269.057-.167.091-.363.091-.59 0-.772-.398-1.58-.745-2.115.141-.086.344-.136.586-.136.912 0 1.91.705 2.37 1.572zM12 4.675c.44-.45 1.09-.76 1.76-.76.71 0 1.33.35 1.62.88-.69.25-1.56.76-2.05 1.44-.27-.58-.75-1.12-1.33-1.56zm0 0c-.58.44-1.06.98-1.33 1.56-.49-.68-1.36-1.19-2.05-1.44.29-.53.91-.88 1.62-.88.67 0 1.32.31 1.76.76z"
    />
    <path
      fill="#c51a4a"
      d="M12 7.037c-.77 0-1.47.27-2.02.73.55.46 1.25.73 2.02.73s1.47-.27 2.02-.73c-.55-.46-1.25-.73-2.02-.73zm-3.53 1.38c-.73 0-1.38.31-1.84.82.52.41 1.17.65 1.88.65.65 0 1.25-.2 1.75-.55-.47-.56-1.1-1.23-1.79-1.23zm7.06 0c-.69 0-1.32.67-1.79 1.23.5.35 1.1.55 1.75.55.71 0 1.36-.24 1.88-.65-.46-.51-1.11-.82-1.84-.82zm-8.82 2.65c-.77 0-1.41.44-1.71 1.08.57.34 1.24.54 1.95.54.49 0 .95-.1 1.37-.28-.39-.75-.98-1.34-1.61-1.34zm10.58 0c-.63 0-1.22.59-1.61 1.34.42.18.88.28 1.37.28.71 0 1.38-.2 1.95-.54-.3-.64-.94-1.08-1.71-1.08zm-7.06.82c-.85 0-1.57.48-1.92 1.19.57.41 1.26.66 2.01.66.71 0 1.37-.22 1.92-.6-.44-.73-1.15-1.25-2.01-1.25zm3.54 0c-.86 0-1.57.52-2.01 1.25.55.38 1.21.6 1.92.6.75 0 1.44-.25 2.01-.66-.35-.71-1.07-1.19-1.92-1.19zm-3.54 2.89c-.83 0-1.53.44-1.89 1.1.56.36 1.23.58 1.95.58.7 0 1.34-.21 1.88-.56-.44-.67-1.13-1.12-1.94-1.12zm-3.4 1.18c-.73 0-1.34.45-1.6 1.09.52.33 1.13.52 1.79.52.39 0 .76-.07 1.1-.2-.36-.8-.82-1.41-1.29-1.41zm6.8 0c-.47 0-.93.61-1.29 1.41.34.13.71.2 1.1.2.66 0 1.27-.19 1.79-.52-.26-.64-.87-1.09-1.6-1.09zm-3.4 2.15c-.88 0-1.6.57-1.87 1.37.54.27 1.15.42 1.8.42.63 0 1.22-.14 1.75-.39-.27-.8-.99-1.4-1.68-1.4zm0 2.66c-.63 0-1.17.37-1.43.91.43.14.89.22 1.37.22.46 0 .9-.08 1.32-.21-.26-.55-.77-.92-1.26-.92z"
    />
  </svg>
);

// Authentic Multi-Color JavaScript Logo (Yellow tile + Black JS text)
const OfficialJavaScript = ({ size = 26, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <path
      fill="#000000"
      d="M6.25 18.5c.5.85 1.3 1.45 2.5 1.45 1.3 0 2.1-.65 2.1-2.15v-7.3H8.8v7.3c0 .6-.25.9-.75.9-.55 0-.85-.35-1.1-.8l-.7.6zm8.15.05c.7.9 1.8 1.4 3.05 1.4 1.95 0 3.2-1 3.2-2.6 0-1.7-1.15-2.3-2.65-2.95l-.65-.3c-.85-.35-1.3-.7-1.3-1.35 0-.6.5-1.1 1.4-1.1.8 0 1.4.35 1.85.95l1.6-1.05c-.8-1.3-2-1.75-3.45-1.75-2 0-3.3 1.15-3.3 2.7 0 1.5 1 2.25 2.45 2.85l.65.25c.95.4 1.5.75 1.5 1.5 0 .7-.65 1.2-1.65 1.2-.95 0-1.7-.5-2.2-1.35l-1.5 1.1z"
    />
  </svg>
);

// Authentic Multi-Color Java Logo (Blue steam + Orange cup)
const OfficialJava = ({ size = 26, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path
      fill="#5382A1"
      d="M8.85 16.35s-.75.45-1.65.55c-1.35.15-2.1-.45-2.1-.45s.6.3 1.5.3c1.05 0 2.25-.4 2.25-.4zm-1.05-2.25s-1.05.6-2.1.6c-1.5 0-2.25-.6-2.25-.6s.75.4 1.8.4c1.2 0 2.55-.4 2.55-.4zm1.8 4.2s-1.2.75-2.85.9c-2.1.15-3.6-.6-3.6-.6s1.05.4 2.55.4c1.8 0 3.9-.7 3.9-.7zm-1.95-6.9s.75-1.35 1.8-2.55c1.05-1.2 1.35-2.1 1.35-2.1s-.45.9-1.2 1.95c-.9 1.2-1.95 2.7-1.95 2.7zm4.35 6.9s.75-.45 1.65-.6c.9-.15 1.5-.45 1.5-.45s-.45.3-1.2.45c-.9.15-1.95.6-1.95.6zm1.05-2.25s1.2-.6 2.4-.6c1.2 0 1.8-.4 1.8-.4s-.6.3-1.65.4c-1.2.1-2.55.6-2.55.6z"
    />
    <path
      fill="#E76F00"
      d="M17.4 17.55s1.05-.3 1.5-.75c.45-.45.6-.9.6-.9s-.3.45-.9.75c-.75.3-1.2.9-1.2.9zm-4.35-14.7s2.55 2.55 1.05 5.55c-1.2 2.4-2.85 3.6-2.85 5.55 0 1.5 1.05 2.55 2.1 2.85-.9-.45-1.5-1.2-1.5-2.1 0-1.5 1.2-2.7 2.4-4.2 1.5-1.95 1.2-4.2-1.2-7.65zm3.15 3.75s1.95 1.95.6 4.35c-1.05 1.95-2.4 2.85-2.4 4.5 0 1.2.9 2.1 1.8 2.25-.75-.3-1.2-.9-1.2-1.65 0-1.2.9-2.25 1.95-3.45 1.35-1.65.9-3.45-.75-6zm2.4 9.45c-.45.3-.9.6-1.5.75.9-.15 1.65-.45 2.1-.9.6-.6.6-1.35.6-1.35s0 .9-1.2 1.5z"
    />
  </svg>
);

// ── Complete Technology Configuration Registry ─────────────────────────────
const TECH_REGISTRY = {
  // Frontend
  React: {
    icon: SiReact,
    brandColor: "#61DAFB",
    sphereBg: "#1E293B",
    logoColor: "#61DAFB",
  },
  "React Native": {
    icon: SiExpo,
    brandColor: "#61DAFB",
    sphereBg: "#0F172A",
    logoColor: "#61DAFB",
  },
  Expo: {
    icon: SiExpo,
    brandColor: "#000020",
    sphereBg: "#0F172A",
    logoColor: "#FFFFFF",
  },
  "React Native + Expo": {
    icon: SiExpo,
    brandColor: "#000020",
    sphereBg: "#0F172A",
    logoColor: "#FFFFFF",
  },
  "Tailwind CSS": {
    icon: SiTailwindcss,
    brandColor: "#06B6D4",
    sphereBg: "#0F172A",
    logoColor: "#38BDF8",
  },
  Vite: {
    icon: SiVite,
    brandColor: "#646CFF",
    sphereBg: "#4B51C6",
    logoColor: "#FFFFFF",
  },

  // Languages
  JavaScript: {
    icon: OfficialJavaScript,
    brandColor: "#F7DF1E",
    sphereBg: "#D4BE14",
    logoColor: "#000000",
  },
  JS: {
    icon: OfficialJavaScript,
    brandColor: "#F7DF1E",
    sphereBg: "#D4BE14",
    logoColor: "#000000",
  },
  TypeScript: {
    icon: SiTypescript,
    brandColor: "#3178C6",
    sphereBg: "#235A97",
    logoColor: "#FFFFFF",
  },
  Python: {
    icon: OfficialPython,
    brandColor: "#3776AB",
    sphereBg: "#2B5B84",
    logoColor: "#FFD43B",
  },
  Java: {
    icon: OfficialJava,
    brandColor: "#E76F00",
    sphereBg: "#B35600",
    logoColor: "#FFFFFF",
  },
  OpenJDK: {
    icon: OfficialJava,
    brandColor: "#E76F00",
    sphereBg: "#B35600",
    logoColor: "#FFFFFF",
  },
  C: {
    icon: SiC,
    brandColor: "#283593",
    sphereBg: "#1C2566",
    logoColor: "#64B5F6",
  },
  Go: {
    icon: SiGo,
    brandColor: "#00ADD8",
    sphereBg: "#0086A8",
    logoColor: "#FFFFFF",
  },
  GoLang: {
    icon: SiGo,
    brandColor: "#00ADD8",
    sphereBg: "#0086A8",
    logoColor: "#FFFFFF",
  },

  // Backend
  FastAPI: {
    icon: SiFastapi,
    brandColor: "#009688",
    sphereBg: "#00796B",
    logoColor: "#FFFFFF",
  },
  Flask: {
    icon: SiFlask,
    brandColor: "#18181B",
    sphereBg: "#27272A",
    logoColor: "#FFFFFF",
  },
  "Node.js": {
    icon: SiNodedotjs,
    brandColor: "#339933",
    sphereBg: "#1E5A1E",
    logoColor: "#FFFFFF",
  },
  Express: {
    icon: SiExpress,
    brandColor: "#18181B",
    sphereBg: "#27272A",
    logoColor: "#FFFFFF",
  },
  "Express.js": {
    icon: SiExpress,
    brandColor: "#18181B",
    sphereBg: "#27272A",
    logoColor: "#FFFFFF",
  },

  // Databases
  PostgreSQL: {
    icon: SiPostgresql,
    brandColor: "#0064a5",
    sphereBg: "#004B7C",
    logoColor: "#FFFFFF",
  },
  Redis: {
    icon: SiRedis,
    brandColor: "#DC382D",
    sphereBg: "#B3281E",
    logoColor: "#FFFFFF",
  },
  "Chroma DB": {
    icon: SiChroma,
    brandColor: "#FF6446",
    sphereBg: "#1E293B",
    logoColor: "#FF6446",
  },
  Chroma: {
    icon: SiChroma,
    brandColor: "#FF6446",
    sphereBg: "#1E293B",
    logoColor: "#FF6446",
  },
  ChromaDB: {
    icon: SiChroma,
    brandColor: "#FF6446",
    sphereBg: "#1E293B",
    logoColor: "#FF6446",
  },
  MongoDB: {
    icon: SiMongodb,
    brandColor: "#47A248",
    sphereBg: "#2E6B2E",
    logoColor: "#FFFFFF",
  },
  SQLite: {
    icon: SiSqlite,
    brandColor: "#003B57",
    sphereBg: "#00283B",
    logoColor: "#FFFFFF",
  },
  Milvus: {
    icon: SiMilvus,
    brandColor: "#00A1EA",
    sphereBg: "#0073A8",
    logoColor: "#FFFFFF",
  },
  "Milvus (Vector DB)": {
    icon: SiMilvus,
    brandColor: "#00A1EA",
    sphereBg: "#0073A8",
    logoColor: "#FFFFFF",
  },

  // AI & ML
  "Groq API": {
    icon: Sparkles,
    brandColor: "#F55036",
    sphereBg: "#D13A23",
    logoColor: "#FFFFFF",
  },
  "Groq LLM": {
    icon: Sparkles,
    brandColor: "#F55036",
    sphereBg: "#D13A23",
    logoColor: "#FFFFFF",
  },
  PyTorch: {
    icon: SiPytorch,
    brandColor: "#EE4C2C",
    sphereBg: "#C43519",
    logoColor: "#FFFFFF",
  },
  "Hugging Face": {
    icon: SiHuggingface,
    brandColor: "#FFD21E",
    sphereBg: "#D4AC0D",
    logoColor: "#000000",
  },
  LangChain: {
    icon: SiLangchain,
    brandColor: "#1C3C3C",
    sphereBg: "#142929",
    logoColor: "#FFFFFF",
  },
  Ollama: {
    icon: SiOllama,
    brandColor: "#18181B",
    sphereBg: "#27272A",
    logoColor: "#FFFFFF",
  },

  // DevOps & Hardware
  Docker: {
    icon: SiDocker,
    brandColor: "#2496ED",
    sphereBg: "#1679C4",
    logoColor: "#FFFFFF",
  },
  Git: {
    icon: SiGit,
    brandColor: "#F05032",
    sphereBg: "#C4381D",
    logoColor: "#FFFFFF",
  },
  Linux: {
    icon: SiLinux,
    brandColor: "#FCC624",
    sphereBg: "#A17D16",
    logoColor: "#000000",
  },
  "GitHub Actions": {
    icon: SiGithubactions,
    brandColor: "#2088FF",
    sphereBg: "#116EE0",
    logoColor: "#FFFFFF",
  },
  Actions: {
    icon: SiGithubactions,
    brandColor: "#2088FF",
    sphereBg: "#116EE0",
    logoColor: "#FFFFFF",
  },
  "Raspberry Pi": {
    icon: OfficialRaspberryPi,
    brandColor: "#C51A4A",
    sphereBg: "#9E143A",
    logoColor: "#FFFFFF",
  },
  "Raspberry Pi 3": {
    icon: OfficialRaspberryPi,
    brandColor: "#C51A4A",
    sphereBg: "#9E143A",
    logoColor: "#FFFFFF",
  },
  Arduino: {
    icon: SiArduino,
    brandColor: "#00979D",
    sphereBg: "#007A7F",
    logoColor: "#FFFFFF",
  },
  MQTT: {
    icon: SiMqtt,
    brandColor: "#660066",
    sphereBg: "#4D004D",
    logoColor: "#FFFFFF",
  },
};

const getTechConfig = (name) => {
  if (TECH_REGISTRY[name]) return TECH_REGISTRY[name];
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(TECH_REGISTRY)) {
    if (key.toLowerCase() === lower) return val;
  }
  return {
    icon: Code2,
    brandColor: "#4B5563",
    sphereBg: "#374151",
    logoColor: "#FFFFFF",
  };
};

/**
 * 3D Orbital Tech Stack Globe for Project Details Page
 * Architecture:
 * - 3D Central Globe representing the Project (Theme-curated matte finish, Apple HIG typography)
 * - Equidistant 3D Satellite Spheres revolving in the camera plane (Z = 0)
 * - Authentic Multi-Color SVGs (Python, JavaScript, Raspberry Pi, Java, Chroma, etc.)
 * - Technology Title carved cleanly INSIDE the sphere (No external pills)
 * - Aspect-ratio-aware mathematical camera framing (Zero cutoff on desktop and mobile)
 * - Clean guide orbit trajectory (No dummy lines or edge-on shadow lines)
 */
const ProjectTechGlobe = ({
  techStack = [],
  projectTitle = "Project",
  projectTag = "Completed",
}) => {
  const mountRef = useRef(null);

  // Three.js Core Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const centerMeshRef = useRef(null);
  const satelliteMeshesRef = useRef(new Map());

  const centerLabelRef = useRef(null);
  const satelliteLabelRefs = useRef(new Map());

  const isHoveredRef = useRef(false);
  const hoveredIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-9999, -9999));

  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const lastWidthRef = useRef(0);
  const lastHeightRef = useRef(0);
  const currentOrbitConfigRef = useRef(null);

  // Status Theme (Apple HIG Ceramic Palette)
  const theme = useMemo(() => {
    if (projectTag === "Completed") {
      return {
        accent: "#059669",
        sphereColor: "#059669",
        ringColor: "#10b981",
        glow: "rgba(5, 150, 105, 0.25)",
      };
    }
    if (projectTag === "Discontinued") {
      return {
        accent: "#6366f1",
        sphereColor: "#4f46e5",
        ringColor: "#818cf8",
        glow: "rgba(99, 102, 241, 0.25)",
      };
    }
    return {
      accent: "#d97706",
      sphereColor: "#d97706",
      ringColor: "#fbbf24",
      glow: "rgba(217, 119, 6, 0.25)",
    };
  }, [projectTag]);

  // Calibrated Viewport & Circular Orbit Configuration (Guarantees zero cutoff)
  const getOrbitConfig = useCallback((customWidth, customHeight) => {
    const container = mountRef.current;
    const width =
      customWidth ||
      container?.clientWidth ||
      (typeof window !== "undefined" ? window.innerWidth : 900);
    const height =
      customHeight || container?.clientHeight || 560;
    const aspect = width / height;

    const isMobile = width < 640;
    const isTablet = width < 1024 && !isMobile;

    const centerRadius = isMobile ? 1.35 : isTablet ? 1.55 : 1.75;
    const orbitRadius = isMobile ? 3.6 : isTablet ? 4.3 : 5.0;
    const techRadius = isMobile ? 0.85 : isTablet ? 1.0 : 1.15;

    // Zero-cutoff bounds calculation
    // Camera FOV = 40 deg, half-FOV = 20 deg
    const halfFovRad = 20 * (Math.PI / 180);
    const yRequired = orbitRadius + techRadius + (isMobile ? 1.2 : 1.5);
    const xRequired = orbitRadius + techRadius + (isMobile ? 1.1 : 1.4);

    const zForY = yRequired / Math.tan(halfFovRad);
    const zForX = xRequired / (Math.tan(halfFovRad) * aspect);
    const camZ = Math.max(zForY, zForX);

    return {
      width,
      height,
      aspect,
      centerRadius,
      orbitRadius,
      techRadius,
      camZ,
    };
  }, []);

  // Prepared data list for rendering 2D labels
  const activeTechList = useMemo(() => {
    if (!techStack || techStack.length === 0) return [];
    return techStack.map((name, index) => {
      const config = getTechConfig(name);
      return {
        id: `tech-${index}-${name}`,
        name,
        index,
        ...config,
      };
    });
  }, [techStack]);

  // ── SETUP THREE.JS 3D SCENE ───────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !techStack || techStack.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    lastWidthRef.current = width;
    lastHeightRef.current = height;

    const orbitConfig = getOrbitConfig(width, height);
    currentOrbitConfigRef.current = orbitConfig;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Centered at (0, 0, camZ) facing origin (0, 0, 0))
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, orbitConfig.camZ);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Soft Diffuse Studio Lighting (No harsh hotspots)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf1f5f9, 0.75);
    scene.add(hemiLight);

    const softFillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    softFillLight.position.set(6, 14, 12);
    scene.add(softFillLight);

    // 5. Central Project Globe Mesh (Matte ceramic finish)
    const centerGeo = new THREE.SphereGeometry(orbitConfig.centerRadius, 64, 64);
    const centerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(theme.sphereColor),
      roughness: 0.62,
      metalness: 0.0,
      transparent: true,
      opacity: 1.0,
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.position.set(0, 0, 0);
    centerMesh.userData = {
      type: "center",
      id: "project-center-globe",
    };
    scene.add(centerMesh);
    centerMeshRef.current = centerMesh;

    // 7. Technology Satellite Meshes (Outward burst entrance)
    const satelliteMeshes = new Map();
    const total = techStack.length;

    techStack.forEach((name, index) => {
      const config = getTechConfig(name);
      const initialAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
      const itemId = `tech-${index}-${name}`;

      const geo = new THREE.SphereGeometry(orbitConfig.techRadius, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.sphereBg),
        roughness: 0.6,
        metalness: 0.0,
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0, 0);
      mesh.scale.set(0.01, 0.01, 0.01);
      mesh.userData = {
        type: "tech",
        id: itemId,
        name,
        config,
        initialAngle,
      };
      scene.add(mesh);

      const item = {
        mesh,
        name,
        config,
        initialAngle,
        currentRadius: 0,
      };
      satelliteMeshes.set(itemId, item);

      // Smooth outward burst animation
      gsap.to(item, {
        currentRadius: orbitConfig.orbitRadius,
        duration: 0.75,
        ease: "back.out(1.4)",
        delay: index * 0.06,
      });
      gsap.to(mesh.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 0.75,
        ease: "back.out(1.4)",
        delay: index * 0.06,
      });
      gsap.to(mat, {
        opacity: 1.0,
        duration: 0.45,
        delay: index * 0.06,
      });
    });

    satelliteMeshesRef.current = satelliteMeshes;

    // ── 8. 60 FPS ANIMATION LOOP (DIRECT GPU TRANSFORMS) ─────────────────────
    let orbitAngle = 0;
    const tempV = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const curWidth = container.clientWidth;
      const curHeight = container.clientHeight;

      // Smooth rotation: slows down on hover so user can easily inspect
      const step = isHoveredRef.current ? 0.0008 : 0.0032;
      orbitAngle += step;

      // Update central globe label position
      if (centerLabelRef.current) {
        tempV.set(0, 0, 0).project(camera);
        if (tempV.z < 1.0) {
          const screenX = (tempV.x * 0.5 + 0.5) * curWidth;
          const screenY = (-(tempV.y * 0.5) + 0.5) * curHeight;
          centerLabelRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%)`;
          centerLabelRef.current.style.opacity = "1";
        }
      }

      // Update tech satellites along the orbit in the camera plane (Z = 0)
      satelliteMeshes.forEach((item) => {
        const { mesh, initialAngle, currentRadius } = item;
        const angle = initialAngle + orbitAngle;

        const x = Math.cos(angle) * currentRadius;
        const y = Math.sin(angle) * currentRadius;
        mesh.position.set(x, y, 0);

        const labelEl = satelliteLabelRefs.current.get(mesh.userData.id);
        if (labelEl) {
          tempV.setFromMatrixPosition(mesh.matrixWorld).project(camera);
          if (tempV.z < 1.0) {
            const screenX = (tempV.x * 0.5 + 0.5) * curWidth;
            const screenY = (-(tempV.y * 0.5) + 0.5) * curHeight;
            labelEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%)`;
            labelEl.style.opacity = `${mesh.material.opacity}`;
          } else {
            labelEl.style.opacity = "0";
          }
        }
      });

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // ── 9. RESPONSIVE RESIZE LISTENER ────────────────────────────────────────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (
        Math.abs(newWidth - lastWidthRef.current) > 2 ||
        Math.abs(newHeight - lastHeightRef.current) > 2
      ) {
        lastWidthRef.current = newWidth;
        lastHeightRef.current = newHeight;
        const newConfig = getOrbitConfig(newWidth, newHeight);
        currentOrbitConfigRef.current = newConfig;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        camera.position.set(0, 0, newConfig.camZ);
        renderer.setSize(newWidth, newHeight);

        // Update satellites orbit radius
        satelliteMeshes.forEach((item) => {
          item.currentRadius = newConfig.orbitRadius;
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [techStack, theme, getOrbitConfig]);

  // ── POINTER & HOVER INTERACTIONS ──────────────────────────────────────────
  const handlePointerDown = (e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const satelliteMeshList = Array.from(
      satelliteMeshesRef.current.values()
    ).map((v) => v.mesh);
    const intersects = raycasterRef.current.intersectObjects(satelliteMeshList);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const hitId = hit.userData.id;
      if (hoveredIdRef.current !== hitId) {
        if (hoveredIdRef.current) {
          const prev = satelliteMeshesRef.current.get(hoveredIdRef.current);
          if (prev) {
            gsap.to(prev.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
          }
        }
        hoveredIdRef.current = hitId;
        isHoveredRef.current = true;
        gsap.to(hit.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 0.25 });
      }
    } else if (hoveredIdRef.current) {
      const prev = satelliteMeshesRef.current.get(hoveredIdRef.current);
      if (prev) {
        gsap.to(prev.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
      }
      hoveredIdRef.current = null;
      isHoveredRef.current = false;
    }
  };

  const handlePointerLeave = () => {
    if (hoveredIdRef.current) {
      const prev = satelliteMeshesRef.current.get(hoveredIdRef.current);
      if (prev) {
        gsap.to(prev.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
      }
      hoveredIdRef.current = null;
    }
    isHoveredRef.current = false;
  };

  // Helper for DOM label hovering
  const handleItemHover = (id, isEntering) => {
    const item = satelliteMeshesRef.current.get(id);
    if (!item) return;

    if (isEntering) {
      hoveredIdRef.current = id;
      isHoveredRef.current = true;
      gsap.to(item.mesh.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 0.25 });
    } else {
      if (hoveredIdRef.current === id) {
        hoveredIdRef.current = null;
        isHoveredRef.current = false;
        gsap.to(item.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
      }
    }
  };

  if (!techStack || techStack.length === 0) {
    return null;
  }

  return (
    <div className="project-tech-globe-container">
      <div
        ref={mountRef}
        className="project-tech-globe-wrapper"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* ── 2D LABELS & BRAND LOGOS OVERLAY (DIRECT GPU TRANSFORMS) ── */}
        <div className="project-tech-globe-labels">
          {/* 1. Central Project Globe Label */}
          <div
            ref={centerLabelRef}
            className="project-central-globe-label"
            style={{ opacity: 0 }}
          >
            <span className="project-central-title">Tech stack</span>
          </div>

          {/* 2. Technology Satellites: Authentic Brand SVG + Title INSIDE Sphere (No External Pills) */}
          {activeTechList.map((item) => {
            const IconComponent = item.icon || Code2;
            const isMobile =
              typeof window !== "undefined" && window.innerWidth < 640;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  if (el) satelliteLabelRefs.current.set(item.id, el);
                  else satelliteLabelRefs.current.delete(item.id);
                }}
                className="project-tech-satellite-node"
                style={{ opacity: 0 }}
                onMouseEnter={() => handleItemHover(item.id, true)}
                onMouseLeave={() => handleItemHover(item.id, false)}
              >
                {/* Authentic Brand SVG Logo carved directly on sphere */}
                <div className="project-tech-satellite-icon">
                  <IconComponent
                    size={isMobile ? 22 : 28}
                    color={item.logoColor || "#FFFFFF"}
                  />
                </div>

                {/* Technology Title INSIDE the Sphere (No External Pill!) */}
                <div className="project-tech-satellite-name">
                  <span>{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTechGlobe;
