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

// Official Chroma SVG Component
const SiChroma = ({ size = 20, className = "" }) => (
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

export const ICON_MAP = {
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
  SiJava: SiOpenjdk,
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

  // DIRECT DOM REFERENCES for 60fps transform updates (Zero React Re-renders!)
  const categoryLabelRefs = useRef(new Map());
  const skillLabelRefs = useRef(new Map());

  const [activeCategoryList, setActiveCategoryList] = useState([]);
  const [activeSkillList, setActiveSkillList] = useState([]);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-9999, -9999));
  const hoveredIdRef = useRef(null);

  // Calibrated Viewport & Circular Orbit Configuration
  // Target shifted slightly downward in 3D space to eliminate bottom clipping
  const getOrbitConfig = useCallback(() => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;

    const radius = isMobile ? 6.0 : isTablet ? 7.4 : 8.5;

    return {
      radius,
      inclination: 0.35, // ~20 deg subtle 3D tilt
      cameraPos: isMobile
        ? new THREE.Vector3(0, 18.0, 30.0)
        : isTablet
        ? new THREE.Vector3(0, 16.5, 27.0)
        : new THREE.Vector3(0, 15.5, 25.5),
      cameraTarget: new THREE.Vector3(0, -0.6, 0),
      categoryRadius: isMobile ? 1.3 : 1.55,
      childOrbitRadius: isMobile ? 4.2 : 5.2,
      skillRadius: isMobile ? 0.72 : 0.85,
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
    const orbitConfig = getOrbitConfig();

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
      categoryMeshes.forEach((item) => {
        const { mesh, shadow } = item;

        if (isOrbitingRef.current) {
          const currentAngle = mesh.userData.baseAngle + globalAngleRef.current;
          const x = Math.cos(currentAngle) * orbitConfig.radius;
          const z = Math.sin(currentAngle) * orbitConfig.radius;
          const pos = new THREE.Vector3(x, 0, z);
          pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbitConfig.inclination);

          mesh.position.copy(pos);
          shadow.position.set(pos.x, pos.y - orbitConfig.categoryRadius - 0.04, pos.z);
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
          const { mesh, shadow, initialAngle, radius } = item;
          const angle = initialAngle + childSkillAngle;

          // Pure 2D Circle in Camera-Facing Plane (Z = 0)
          const localX = Math.cos(angle) * radius;
          const localY = Math.sin(angle) * radius;
          const localZ = 0; // Strictly in front/around the central category globe

          mesh.position.set(localX, localY, localZ);
          shadow.position.set(localX, localY - 0.85 - 0.03, localZ);

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

    // ── STABLE RESIZE HANDLER (IGNORES IPHONE ADDRESS BAR HEIGHT SHIFTS) ────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (Math.abs(newWidth - lastWidthRef.current) > 2) {
        lastWidthRef.current = newWidth;
        const newConfig = getOrbitConfig();

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);

        if (isOrbitingRef.current) {
          camera.position.copy(newConfig.cameraPos);
          cameraTargetRef.current.copy(newConfig.cameraTarget);
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

      // Fade out other categories
      categoryMeshesRef.current.forEach((entry) => {
        if (entry.category.id !== selectedCategory.id) {
          gsap.to(entry.mesh.material, { opacity: 0, duration: 0.45 });
          gsap.to(entry.shadow.material, { opacity: 0, duration: 0.45 });
          gsap.to(entry.mesh.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.45 });
        }
      });

      // Fade out main orbit line
      if (mainOrbitLineRef.current) {
        gsap.to(mainOrbitLineRef.current.material, { opacity: 0, duration: 0.45 });
      }

      // DO NOT CHANGE MATERIAL OR COLOR: Keeps the exact same style, color, and logo!
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
        targetShadow.position,
        {
          x: 0,
          y: -targetMesh.userData.radius * 1.3 - 0.04,
          z: 0,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      );

      tl.to(
        targetMesh.scale,
        {
          x: 1.32,
          y: 1.32,
          z: 1.32,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      );

      // Camera smoothly frames the centered category globe
      const camDestZ = isMobile ? 18.0 : 14.5;
      tl.to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: camDestZ,
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
      const orbitConfig = getOrbitConfig();

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

            gsap.to(entry.shadow.position, {
              x: origPos.x,
              y: origPos.y - orbitConfig.categoryRadius - 0.04,
              z: origPos.z,
              duration: 0.8,
              ease: "power3.inOut",
            });

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
          gsap.to(entry.mesh.material, { opacity: 1.0, duration: 0.8 });
          gsap.to(entry.shadow.material, { opacity: 0.65, duration: 0.8 });
          gsap.to(entry.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.8 });
        });

        if (mainOrbitLineRef.current) {
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
    const orbitConfig = getOrbitConfig();

    cleanChildSkillMeshes();

    const newSkillMeshes = new Map();
    const skills = category.skills;
    const total = skills.length;
    const radius = orbitConfig.childOrbitRadius;

    setActiveSkillList(skills);

    // Create 2D circular orbit ring in camera-facing plane (XY, Z = 0)
    const circlePoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }
    const childOrbitGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
    const childOrbitMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(category.color),
      transparent: true,
      opacity: 0,
    });
    const childOrbit = new THREE.LineLoop(childOrbitGeo, childOrbitMat);
    scene.add(childOrbit);
    childOrbitLineRef.current = childOrbit;

    gsap.to(childOrbitMat, { opacity: 0.35, duration: 0.5 });

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

      const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTextureRef.current,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0, -0.85, 0);

      scene.add(mesh);
      scene.add(shadow);

      const item = {
        mesh,
        shadow,
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

      gsap.to(shadowMat, {
        opacity: 0.55,
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
      scene.remove(item.shadow);
      item.mesh.geometry.dispose();
      item.mesh.material.dispose();
      item.shadow.geometry.dispose();
      item.shadow.material.dispose();
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
              <CategoryIcon size={16} className="orbital-planet-icon" />
              <span>{item.name}</span>
            </div>
          );
        })}

        {/* 2. Technology-Logo Spheres: Official 3D Brand Logo + Title Directly Underneath */}
        {activeSkillList.map((item) => {
          const IconComponent = item.icon === "SiChroma" ? SiChroma : ICON_MAP[item.icon];
          const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

          return (
            <div
              key={`tech-node-${item.id}`}
              ref={(el) => {
                if (el) skillLabelRefs.current.set(item.id, el);
                else skillLabelRefs.current.delete(item.id);
              }}
              className="orbital-tech-logo-node"
              style={{ opacity: 0 }}
              onClick={() => {
                const targetSkill = selectedCategory?.skills?.find((s) => s.id === item.id);
                if (targetSkill) onSelectSkill(targetSkill);
              }}
            >
              {/* Authentic Brand SVG Logo Embedded on Sphere Face */}
              <div
                className="orbital-tech-sphere-logo"
                style={{ color: item.logoColor || "#FFFFFF" }}
              >
                {IconComponent ? (
                  <IconComponent
                    size={isMobile ? 22 : 26}
                    color={item.logoColor || "#FFFFFF"}
                  />
                ) : (
                  <span className="text-sm font-bold">{item.name.charAt(0)}</span>
                )}
              </div>

              {/* Technology Title Cleanly Underneath Sphere */}
              <div className="orbital-tech-sphere-title">
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
