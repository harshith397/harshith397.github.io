import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import {
  SiPython,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFastapi,
  SiNodedotjs,
  SiHuggingface,
  SiPostgresql,
  SiRedis,
  SiSqlite,
  SiDocker,
  SiGit,
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
  SiPytorch,
  SiExpo,
} from "@icons-pack/react-simple-icons";
import { Orbit, Sparkles, Layers, Terminal, Database, Wrench, Cpu, Code2 } from "lucide-react";

// Official Multi-Color Chroma SVG Component
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

// Authentic Multi-Color JavaScript Logo (Official Yellow square + Black JS text)
const OfficialJavaScript = ({ size = 26, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <path
      fill="#000000"
      d="M6.25 18.5c.5.85 1.3 1.45 2.5 1.45 1.3 0 2.1-.65 2.1-2.15v-7.3H8.8v7.3c0 .6-.25.9-.75.9-.55 0-.85-.35-1.1-.8l-.7.6zm8.15.05c.7.9 1.8 1.4 3.05 1.4 1.95 0 3.2-1 3.2-2.6 0-1.7-1.15-2.3-2.65-2.95l-.65-.3c-.85-.35-1.3-.7-1.3-1.35 0-.6.5-1.1 1.4-1.1.8 0 1.4.35 1.85.95l1.6-1.05c-.8-1.3-2-1.75-3.45-1.75-2 0-3.3 1.15-3.3 2.7 0 1.5 1 2.25 2.45 2.85l.65.25c.95.4 1.5.75 1.5 1.5 0 .7-.65 1.2-1.65 1.2-.95 0-1.7-.5-2.2-1.35l-1.5 1.1z"
    />
  </svg>
);

// Authentic Multi-Color Java Coffee Cup Logo (Blue steam + Orange/red cup base)
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

export const ICON_MAP = {
  SiPython: OfficialPython,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFastapi,
  SiNodedotjs,
  SiHuggingface,
  SiPostgresql,
  SiRedis,
  SiSqlite,
  SiDocker,
  SiGit,
  SiGithubactions,
  SiC,
  SiJava: OfficialJava,
  SiOpenjdk: OfficialJava,
  SiGo,
  SiMqtt,
  SiArduino,
  SiOllama,
  SiRaspberrypi: OfficialRaspberryPi,
  SiJavascript: OfficialJavaScript,
  SiExpress,
  SiPytorch,
  SiExpo,
  SiChroma,
};

const CATEGORY_ICONS = {
  languages: Code2,
  frontend: Layers,
  backend: Terminal,
  aiml: Sparkles,
  databases: Database,
  devops: Wrench,
  systems: Cpu,
};

/**
 * Soft Diffuse Ambient Contact Shadow Texture
 */
const createShadowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(15, 23, 42, 0.28)");
  gradient.addColorStop(0.35, "rgba(15, 23, 42, 0.12)");
  gradient.addColorStop(0.7, "rgba(15, 23, 42, 0.03)");
  gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const OrbitalCanvas = ({
  data = [],
  appState = "overview",
  selectedCategory = null,
  selectedSkill = null,
  onSelectCategory,
  onSelectSkill,
  onBackToOverview,
  onCategoryFocused,
}) => {
  const mountRef = useRef(null);

  // Three.js Core Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const categoryMeshesRef = useRef(new Map());
  const skillMeshesRef = useRef(new Map());
  const mainOrbitLineRef = useRef(null);
  const childOrbitLineRef = useRef(null);
  const shadowTextureRef = useRef(null);

  const globalAngleRef = useRef(0);
  const isOrbitingRef = useRef(true);
  const cameraTargetRef = useRef(new THREE.Vector3(0, -0.6, 0));

  // Pointer drag/tap tracking to avoid accidental click while scrolling on mobile
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const lastWidthRef = useRef(0);
  const lastHeightRef = useRef(0);
  const currentOrbitConfigRef = useRef(null);

  // DIRECT DOM REFERENCES for 60fps transform updates (Zero React Re-renders!)
  const categoryLabelRefs = useRef(new Map());
  const skillLabelRefs = useRef(new Map());

  const [activeCategoryList, setActiveCategoryList] = useState([]);
  const [activeSkillList, setActiveSkillList] = useState([]);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-9999, -9999));
  const hoveredIdRef = useRef(null);

  // Calibrated Viewport & Circular Orbit Configuration
  // Dynamically computes camera distances and orbit radii to ensure 100% visible bounds without desktop or mobile clipping
  const getOrbitConfig = useCallback((customWidth, customHeight) => {
    const container = mountRef.current;
    const width = customWidth || container?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1200);
    const height = customHeight || container?.clientHeight || 740;
    const aspect = width / height;

    const isMobile = width < 640;
    const isTablet = width < 1024 && !isMobile;

    // Overview orbit setup: Prominent, grand, properly-sized globes
    const radius = isMobile ? 5.6 : isTablet ? 7.2 : 8.4;
    const categoryRadius = isMobile ? 1.35 : isTablet ? 1.55 : 1.75;

    // Camera vertical FOV is 40 degrees, half-FOV = 20 degrees
    const fov = 40;
    const halfFovRad = 20 * (Math.PI / 180); // tan(20 deg) ≈ 0.36397

    // In overview, scale camera distance on narrow screens so horizontal bounds never clip
    let overviewCamPos;
    if (isMobile) {
      const mobilePullBack = Math.max(1, 0.72 / Math.max(aspect, 0.45));
      overviewCamPos = new THREE.Vector3(0, 19.5 * mobilePullBack, 33.5 * mobilePullBack);
    } else if (isTablet) {
      overviewCamPos = new THREE.Vector3(0, 17.5, 29.5);
    } else {
      overviewCamPos = new THREE.Vector3(0, 16.5, 27.5);
    }

    // Category / Focused Skill Area configuration
    // Sizable satellites with room for both logo and title inside!
    const childOrbitRadius = isMobile ? 3.6 : isTablet ? 4.3 : 5.0;
    const skillRadius = isMobile ? 0.82 : isTablet ? 1.0 : 1.15;

    // Required bounds in world units to prevent ANY cutoff:
    // With title INSIDE the sphere (no external hanging pill!), bounds are determined directly by the satellite sphere
    const yRequired = childOrbitRadius + skillRadius + (isMobile ? 1.3 : 1.6);
    const xRequired = childOrbitRadius + skillRadius + (isMobile ? 1.2 : 1.4);

    // Compute required camera Z distance:
    // Z_y guarantees vertical clearance (stops top/bottom cutoff on desktop)
    // Z_x guarantees horizontal clearance (stops left/right cutoff on mobile)
    const zForY = yRequired / Math.tan(halfFovRad);
    const zForX = xRequired / (Math.tan(halfFovRad) * aspect);
    const categoryCamZ = Math.max(zForY, zForX);

    return {
      width,
      height,
      aspect,
      radius,
      inclination: 0.35, // ~20 deg subtle 3D tilt
      cameraPos: overviewCamPos,
      cameraTarget: new THREE.Vector3(0, -0.6, 0),
      categoryRadius,
      childOrbitRadius,
      skillRadius,
      categoryCamZ,
    };
  }, []);

  useEffect(() => {
    setActiveCategoryList(data);
  }, [data]);

  // ── 1. SETUP THREE.JS SCENE ───────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    lastWidthRef.current = width;
    lastHeightRef.current = height;
    const orbitConfig = getOrbitConfig(width, height);
    currentOrbitConfigRef.current = orbitConfig;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera (Calibrated to look at 0, -0.6, 0 so bottom part never cuts out)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.copy(orbitConfig.cameraPos);
    camera.lookAt(orbitConfig.cameraTarget);
    cameraRef.current = camera;
    cameraTargetRef.current.copy(orbitConfig.cameraTarget);

    // Renderer (Capped at 2x for rock-solid 60 FPS on Retina screens)
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

    // ── SOFT DIFFUSE STUDIO LIGHTING (NO HARSH SPOTLIGHTS / GLARE!) ─────────
    // Soft, uniform ambient light illuminates all sides evenly
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    // Subtle hemisphere light for soft vertical gradation
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf1f5f9, 0.75);
    scene.add(hemiLight);

    // Gentle diffuse directional fill (low intensity, no spotlight glare!)
    const softFillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    softFillLight.position.set(6, 14, 12);
    scene.add(softFillLight);

    const shadowTexture = createShadowTexture();
    shadowTextureRef.current = shadowTexture;

    // ── CREATE PURE CIRCULAR 3D ORBIT LINE ──────────────────────────────────
    const points = [];
    const segments = 160;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * orbitConfig.radius;
      const z = Math.sin(theta) * orbitConfig.radius;
      const pt = new THREE.Vector3(x, 0, z);
      pt.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbitConfig.inclination);
      points.push(pt);
    }

    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0xcbd5e1,
      transparent: true,
      opacity: 0.55,
    });
    const mainOrbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
    scene.add(mainOrbitLine);
    mainOrbitLineRef.current = mainOrbitLine;

    // ── CREATE MAIN CATEGORY PLANETS (MATTE/SATIN CERAMIC FINISH) ───────────
    const categoryMeshes = new Map();
    const totalCategories = data.length;

    data.forEach((cat, index) => {
      const baseAngle = (index / totalCategories) * Math.PI * 2;

      const x = Math.cos(baseAngle) * orbitConfig.radius;
      const z = Math.sin(baseAngle) * orbitConfig.radius;
      const pos = new THREE.Vector3(x, 0, z);
      pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbitConfig.inclination);

      const sphereGeo = new THREE.SphereGeometry(orbitConfig.categoryRadius, 64, 64);
      // Diffuse matte material: NO harsh spotlight glare or shiny white hotspots!
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cat.color),
        roughness: 0.62,
        metalness: 0.0,
        transparent: true,
        opacity: 1.0,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.copy(pos);
      sphereMesh.userData = {
        type: "category",
        id: cat.id,
        category: cat,
        baseAngle,
        radius: orbitConfig.categoryRadius,
      };
      scene.add(sphereMesh);

      // Contact Shadow Plane
      const shadowGeo = new THREE.PlaneGeometry(
        orbitConfig.categoryRadius * 2.8,
        orbitConfig.categoryRadius * 2.8
      );
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(pos.x, pos.y - orbitConfig.categoryRadius - 0.04, pos.z);
      scene.add(shadowMesh);

      categoryMeshes.set(cat.id, {
        mesh: sphereMesh,
        shadow: shadowMesh,
        category: cat,
      });
    });

    categoryMeshesRef.current = categoryMeshes;

    // ── ANIMATION LOOP (ZERO REACT RE-RENDERS, 100% STABLE) ─────────────────
    let childSkillAngle = 0;
    const tempV = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const curWidth = container.clientWidth;
      const curHeight = container.clientHeight;

      // 1. Overview Orbit: Constant smooth rotation
      if (isOrbitingRef.current) {
        globalAngleRef.current += 0.0022;
      }

      // 2. Category Planets Update
      const curConfig = currentOrbitConfigRef.current || orbitConfig;

      categoryMeshes.forEach((item) => {
        const { mesh, shadow } = item;

        if (isOrbitingRef.current) {
          const currentAngle = mesh.userData.baseAngle + globalAngleRef.current;
          const x = Math.cos(currentAngle) * curConfig.radius;
          const z = Math.sin(currentAngle) * curConfig.radius;
          const pos = new THREE.Vector3(x, 0, z);
          pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), curConfig.inclination);

          mesh.position.copy(pos);
          shadow.position.set(pos.x, pos.y - curConfig.categoryRadius - 0.04, pos.z);
        }

        // Direct GPU Transform for Category Labels (Centered on the sphere)
        const labelEl = categoryLabelRefs.current.get(mesh.userData.id);
        if (labelEl) {
          if (mesh.material.opacity > 0.05) {
            tempV.setFromMatrixPosition(mesh.matrixWorld).project(camera);
            if (tempV.z < 1.0) {
              const screenX = (tempV.x * 0.5 + 0.5) * curWidth;
              const screenY = (-(tempV.y * 0.5) + 0.5) * curHeight;
              const isCenter = !isOrbitingRef.current && selectedCategory?.id === mesh.userData.id;
              labelEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) ${
                isCenter ? "scale(1.28)" : "scale(1)"
              }`;
              labelEl.style.opacity = `${mesh.material.opacity}`;
            } else {
              labelEl.style.opacity = "0";
            }
          } else {
            labelEl.style.opacity = "0";
          }
        }
      });

      // 3. Technology-Logo Spheres Orbit in Camera Plane (Z = 0)
      if (skillMeshesRef.current.size > 0 && !isOrbitingRef.current) {
        childSkillAngle += 0.0035;

        skillMeshesRef.current.forEach((item) => {
          const { mesh, initialAngle, radius } = item;
          const angle = initialAngle + childSkillAngle;

          // Pure 2D Circle in Camera-Facing Plane (Z = 0)
          const localX = Math.cos(angle) * radius;
          const localY = Math.sin(angle) * radius;
          const localZ = 0; // Strictly in front/around the central category globe

          mesh.position.set(localX, localY, localZ);

          // Update Tech Logo & Title Position Directly via GPU Transform
          const labelEl = skillLabelRefs.current.get(mesh.userData.id);
          if (labelEl) {
            tempV.setFromMatrixPosition(mesh.matrixWorld).project(camera);
            if (tempV.z < 1.0) {
              const screenX = (tempV.x * 0.5 + 0.5) * curWidth;
              const screenY = (-(tempV.y * 0.5) + 0.5) * curHeight;
              labelEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%)`;
              labelEl.style.opacity = "1";
            } else {
              labelEl.style.opacity = "0";
            }
          }
        });
      }

      // 4. Update Camera LookAt
      camera.lookAt(cameraTargetRef.current);

      // 5. Render 3D Scene
      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // ── STABLE RESIZE HANDLER (RESPONSIVE CAMERA & ORBIT ADAPTATION) ────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (Math.abs(newWidth - lastWidthRef.current) > 2 || Math.abs(newHeight - lastHeightRef.current) > 2) {
        lastWidthRef.current = newWidth;
        lastHeightRef.current = newHeight;
        const newConfig = getOrbitConfig(newWidth, newHeight);
        currentOrbitConfigRef.current = newConfig;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);

        if (isOrbitingRef.current) {
          camera.position.copy(newConfig.cameraPos);
          cameraTargetRef.current.copy(newConfig.cameraTarget);
        } else {
          camera.position.set(0, 0, newConfig.categoryCamZ);
          cameraTargetRef.current.set(0, 0, 0);
        }

        // Update overview orbit line geometry on resize
        if (mainOrbitLineRef.current) {
          const points = [];
          const segments = 160;
          for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const x = Math.cos(theta) * newConfig.radius;
            const z = Math.sin(theta) * newConfig.radius;
            const pt = new THREE.Vector3(x, 0, z);
            pt.applyAxisAngle(new THREE.Vector3(1, 0, 0), newConfig.inclination);
            points.push(pt);
          }
          mainOrbitLineRef.current.geometry.dispose();
          mainOrbitLineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
          mainOrbitLineRef.current.visible = isOrbitingRef.current;
        }
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

      if (shadowTexture) shadowTexture.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [data, getOrbitConfig]);

  // ── 2. STATE B: BRING SELECTED PLANET TO CENTER (PRESERVES EXACT STYLE & COLOR) ──
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    const isMobile = window.innerWidth < 640;

    if (appState === "transitioning-to-category" && selectedCategory) {
      isOrbitingRef.current = false;

      const targetEntry = categoryMeshesRef.current.get(selectedCategory.id);
      if (!targetEntry) return;

      const targetMesh = targetEntry.mesh;
      const targetShadow = targetEntry.shadow;

      gsap.killTweensOf(targetMesh.position);
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(cameraTargetRef.current);

      // Fade out and hide other categories completely
      categoryMeshesRef.current.forEach((entry) => {
        if (entry.category.id !== selectedCategory.id) {
          gsap.to(entry.mesh.material, {
            opacity: 0,
            duration: 0.45,
            onComplete: () => {
              entry.mesh.visible = false;
            },
          });
          gsap.to(entry.shadow.material, {
            opacity: 0,
            duration: 0.45,
            onComplete: () => {
              entry.shadow.visible = false;
            },
          });
          gsap.to(entry.mesh.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.45 });
        }
      });

      // Hide main overview orbit line completely in domain view (eliminates dummy background line)
      if (mainOrbitLineRef.current) {
        gsap.to(mainOrbitLineRef.current.material, {
          opacity: 0,
          duration: 0.35,
          onComplete: () => {
            if (mainOrbitLineRef.current) {
              mainOrbitLineRef.current.visible = false;
            }
          },
        });
      }

      // Hide central globe's ground shadow in 2D frontal camera view to prevent edge-on line artifact
      if (targetShadow) {
        gsap.to(targetShadow.material, {
          opacity: 0,
          duration: 0.45,
          onComplete: () => {
            targetShadow.visible = false;
          },
        });
      }

      // DO NOT CHANGE MATERIAL OR COLOR: Keeps the exact same style, color, and logo!
      const orbitConfig = currentOrbitConfigRef.current || getOrbitConfig();

      const tl = gsap.timeline({
        onComplete: () => {
          spawnChildSkillPlanets(selectedCategory);
          if (onCategoryFocused) onCategoryFocused();
        },
      });

      // Animate to Center (0, 0, 0)
      tl.to(
        targetMesh.position,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      );

      tl.to(
        targetMesh.scale,
        {
          x: 1.25,
          y: 1.25,
          z: 1.25,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      );

      // Camera smoothly frames the centered category globe with dynamic clearance
      tl.to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: orbitConfig.categoryCamZ,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      );

      tl.to(
        cameraTargetRef.current,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      );
    }

    // ── REVERSE TRANSITION: RESTORE OVERVIEW ─────────────────────────────────
    if (appState === "transitioning-to-overview") {
      const orbitConfig = currentOrbitConfigRef.current || getOrbitConfig();

      despawnChildSkills(() => {
        if (selectedCategory) {
          const entry = categoryMeshesRef.current.get(selectedCategory.id);
          if (entry) {
            const currentAngle = entry.mesh.userData.baseAngle + globalAngleRef.current;
            const origX = Math.cos(currentAngle) * orbitConfig.radius;
            const origZ = Math.sin(currentAngle) * orbitConfig.radius;
            const origPos = new THREE.Vector3(origX, 0, origZ);
            origPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbitConfig.inclination);

            gsap.to(entry.mesh.position, {
              x: origPos.x,
              y: origPos.y,
              z: origPos.z,
              duration: 0.8,
              ease: "power3.inOut",
            });

            entry.shadow.visible = true;
            gsap.to(entry.shadow.position, {
              x: origPos.x,
              y: origPos.y - orbitConfig.categoryRadius - 0.04,
              z: origPos.z,
              duration: 0.8,
              ease: "power3.inOut",
            });
            gsap.to(entry.shadow.material, { opacity: 0.65, duration: 0.8 });

            gsap.to(entry.mesh.scale, {
              x: 1.0,
              y: 1.0,
              z: 1.0,
              duration: 0.8,
              ease: "power3.inOut",
            });
          }
        }

        categoryMeshesRef.current.forEach((entry) => {
          entry.mesh.visible = true;
          entry.shadow.visible = true;
          gsap.to(entry.mesh.material, { opacity: 1.0, duration: 0.8 });
          gsap.to(entry.shadow.material, { opacity: 0.65, duration: 0.8 });
          gsap.to(entry.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.8 });
        });

        if (mainOrbitLineRef.current) {
          mainOrbitLineRef.current.visible = true;
          gsap.to(mainOrbitLineRef.current.material, { opacity: 0.55, duration: 0.8 });
        }

        const tl = gsap.timeline({
          onComplete: () => {
            isOrbitingRef.current = true;
            onBackToOverview();
          },
        });

        tl.to(
          camera.position,
          {
            x: orbitConfig.cameraPos.x,
            y: orbitConfig.cameraPos.y,
            z: orbitConfig.cameraPos.z,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0
        );

        tl.to(
          cameraTargetRef.current,
          {
            x: orbitConfig.cameraTarget.x,
            y: orbitConfig.cameraTarget.y,
            z: orbitConfig.cameraTarget.z,
            duration: 0.8,
            ease: "power3.inOut",
          },
          0
        );
      });
    }
  }, [appState, selectedCategory, getOrbitConfig, onCategoryFocused, onBackToOverview]);

  // ── 3. SPAWN CHILD SKILLS IN PURE 2D CAMERA PLANE (Z = 0) ────────────────
  const spawnChildSkillPlanets = (category) => {
    const scene = sceneRef.current;
    if (!scene || !category.skills) return;
    const orbitConfig = currentOrbitConfigRef.current || getOrbitConfig();

    cleanChildSkillMeshes();

    const newSkillMeshes = new Map();
    const skills = category.skills;
    const total = skills.length;
    const radius = orbitConfig.childOrbitRadius;

    setActiveSkillList(skills);

    // Pure floating satellites: No dummy wireframe lines or edge-on ground shadow planes!

    // Spawn each child skill sphere with its familiar brand color & matte finish
    skills.forEach((skill, index) => {
      const initialAngle = (index / total) * Math.PI * 2;

      const geo = new THREE.SphereGeometry(orbitConfig.skillRadius, 32, 32);
      // Soft matte finish without spotlight glare
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(skill.sphereBg || skill.brandColor),
        roughness: 0.6,
        metalness: 0.0,
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0, 0); // Burst from center outwards
      mesh.scale.set(0.01, 0.01, 0.01);
      mesh.userData = {
        type: "skill",
        id: skill.id,
        skill,
        category,
        radius: orbitConfig.skillRadius,
      };

      scene.add(mesh);

      const item = {
        mesh,
        skill,
        initialAngle,
        radius: 0,
        targetRadius: radius,
      };
      newSkillMeshes.set(skill.id, item);

      // Smooth outward fan burst to targetRadius
      gsap.to(item, {
        radius: radius,
        duration: 0.75,
        ease: "back.out(1.4)",
        delay: index * 0.05,
      });

      gsap.to(mesh.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 0.75,
        ease: "back.out(1.4)",
        delay: index * 0.05,
      });

      gsap.to(mat, {
        opacity: 1.0,
        duration: 0.45,
        delay: index * 0.05,
      });
    });

    skillMeshesRef.current = newSkillMeshes;
  };

  const cleanChildSkillMeshes = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (childOrbitLineRef.current) {
      scene.remove(childOrbitLineRef.current);
      childOrbitLineRef.current.geometry.dispose();
      childOrbitLineRef.current.material.dispose();
      childOrbitLineRef.current = null;
    }

    skillMeshesRef.current.forEach((item) => {
      scene.remove(item.mesh);
      if (item.shadow) {
        scene.remove(item.shadow);
        item.shadow.geometry.dispose();
        item.shadow.material.dispose();
      }
      item.mesh.geometry.dispose();
      item.mesh.material.dispose();
    });
    skillMeshesRef.current.clear();
    setActiveSkillList([]);
  };

  const despawnChildSkills = (onDone) => {
    const scene = sceneRef.current;
    if (!scene || skillMeshesRef.current.size === 0) {
      cleanChildSkillMeshes();
      if (onDone) onDone();
      return;
    }

    if (childOrbitLineRef.current) {
      gsap.to(childOrbitLineRef.current.material, { opacity: 0, duration: 0.25 });
    }

    const meshes = Array.from(skillMeshesRef.current.values());
    let count = 0;

    meshes.forEach((item) => {
      gsap.to(item.mesh.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(item.mesh.material, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          count++;
          if (count === meshes.length) {
            cleanChildSkillMeshes();
            if (onDone) onDone();
          }
        },
      });
    });
  };

  // ── 4. POINTER & TOUCH INTERACTIONS ───────────────────────────────────────
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

    // Overview Mode: Hover over category planets
    if (isOrbitingRef.current || appState === "overview") {
      const categoryMeshList = Array.from(categoryMeshesRef.current.values()).map(
        (v) => v.mesh
      );
      const intersects = raycasterRef.current.intersectObjects(categoryMeshList);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const catId = hit.userData.id;
        if (hoveredIdRef.current !== catId) {
          hoveredIdRef.current = catId;
          gsap.to(hit.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.2 });
        }
      } else if (hoveredIdRef.current) {
        const prev = categoryMeshesRef.current.get(hoveredIdRef.current);
        if (prev) {
          gsap.to(prev.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
        }
        hoveredIdRef.current = null;
      }
    }

    // Category Mode: Hover over child skill planets
    if (!isOrbitingRef.current && skillMeshesRef.current.size > 0) {
      const skillMeshList = Array.from(skillMeshesRef.current.values()).map(
        (v) => v.mesh
      );
      const intersects = raycasterRef.current.intersectObjects(skillMeshList);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const skillId = hit.userData.id;
        if (hoveredIdRef.current !== skillId) {
          hoveredIdRef.current = skillId;
          gsap.to(hit.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 0.2 });
        }
      } else if (hoveredIdRef.current) {
        const prev = skillMeshesRef.current.get(hoveredIdRef.current);
        if (prev) {
          gsap.to(prev.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
        }
        hoveredIdRef.current = null;
      }
    }
  };

  const handlePointerUp = (e) => {
    if (e.button && e.button !== 0) return;

    // Reject scrolling gestures (iPhone touch drag threshold)
    const dx = e.clientX - pointerDownPosRef.current.x;
    const dy = e.clientY - pointerDownPosRef.current.y;
    if (Math.hypot(dx, dy) > 8) return;

    const container = mountRef.current;
    if (!container || !cameraRef.current) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    if (isOrbitingRef.current || appState === "overview") {
      const categoryMeshList = Array.from(categoryMeshesRef.current.values()).map(
        (v) => v.mesh
      );
      const intersects = raycasterRef.current.intersectObjects(categoryMeshList);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        onSelectCategory(hit.userData.category);
      }
    } else if (!isOrbitingRef.current && skillMeshesRef.current.size > 0) {
      const skillMeshList = Array.from(skillMeshesRef.current.values()).map(
        (v) => v.mesh
      );
      const intersects = raycasterRef.current.intersectObjects(skillMeshList);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        onSelectSkill(hit.userData.skill);
      }
    }
  };

  return (
    <div
      ref={mountRef}
      className="orbital-canvas-wrapper"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        hoveredIdRef.current = null;
      }}
    >
      {/* ── 2D LABELS & LOGOS LAYER (NEVER CLIPPED, DIRECT GPU TRANSFORMS) ── */}
      <div className="orbital-labels-layer">
        {/* 1. Main Category Planet Labels (EXACT SAME STYLE & ICON IN ORBITS & WHEN CENTERED) */}
        {activeCategoryList.map((item) => {
          const CategoryIcon = CATEGORY_ICONS[item.id] || Orbit;
          const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

          return (
            <div
              key={`planet-label-${item.id}`}
              ref={(el) => {
                if (el) categoryLabelRefs.current.set(item.id, el);
                else categoryLabelRefs.current.delete(item.id);
              }}
              className="orbital-planet-label"
              style={{ opacity: 0 }}
            >
              <CategoryIcon size={isMobile ? 18 : 22} className="orbital-planet-icon" />
              <span>{item.name}</span>
            </div>
          );
        })}

        {/* 2. Technology Satellites: Authentic Brand Logo + Title INSIDE Sphere (No External Pill, exactly like Domain Globes) */}
        {activeSkillList.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || (item.icon === "SiChroma" ? SiChroma : null);
          const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

          return (
            <div
              key={`tech-node-${item.id}`}
              ref={(el) => {
                if (el) skillLabelRefs.current.set(item.id, el);
                else skillLabelRefs.current.delete(item.id);
              }}
              className="orbital-tech-satellite-label orbital-tech-logo-node"
              style={{ opacity: 0 }}
              onClick={() => {
                const targetSkill = selectedCategory?.skills?.find((s) => s.id === item.id);
                if (targetSkill) onSelectSkill(targetSkill);
              }}
            >
              {/* Authentic Brand SVG Logo Embedded Directly on Sphere Face */}
              <div className="orbital-tech-satellite-icon">
                {IconComponent ? (
                  <IconComponent
                    size={isMobile ? 22 : 30}
                    color={item.logoColor || "#FFFFFF"}
                  />
                ) : (
                  <span className="text-sm font-bold text-white">{item.name.charAt(0)}</span>
                )}
              </div>

              {/* Technology Title INSIDE the Sphere (No External Pill!) */}
              <div className="orbital-tech-satellite-name">
                <span>{item.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrbitalCanvas;
