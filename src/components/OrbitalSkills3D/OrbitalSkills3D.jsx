import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Orbit, Sparkles, Layers, Terminal, Database, Wrench, Cpu, Code2, Info } from "lucide-react";
import OrbitalCanvas, { ICON_MAP } from "./OrbitalCanvas";
import SkillDetailsPanel from "./SkillDetailsPanel";
import { ORBITAL_SKILLS_DATA } from "../../data/orbitalSkillsData";
import "./orbitalSkills3d.css";

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
 * 3D Orbital Skills Portfolio Component
 * Apple Minimalist Visual Language + Physically Grounded 3D Spheres
 * 3 States:
 * - State A: Overview (Elliptical 3D orbit of category spheres)
 * - State B: Category Focus Transition (Cinematic GSAP camera travel)
 * - State C: Category Skill Orbit (Child skill satellites + slide-over details panel)
 */
const OrbitalSkills3D = ({ data = ORBITAL_SKILLS_DATA, className = "" }) => {
  // App States: 'overview' | 'transitioning-to-category' | 'category' | 'transitioning-to-overview'
  const [appState, setAppState] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Handler: Select Category Sphere (State A -> State B)
  const handleSelectCategory = useCallback(
    (category) => {
      if (appState !== "overview") return;
      setSelectedCategory(category);
      setAppState("transitioning-to-category");
    },
    [appState]
  );

  // Callback when camera zoom completes
  const handleCategoryFocused = useCallback(() => {
    setAppState("category");
  }, []);

  // Handler: Select Child Skill Sphere (State C -> Skill Details)
  const handleSelectSkill = useCallback((skill) => {
    setSelectedSkill(skill);
  }, []);

  // Handler: Back Navigation (State C -> Overview)
  const handleBackToOverview = useCallback(() => {
    if (appState === "transitioning-to-overview") return;
    setSelectedSkill(null);
    setAppState("transitioning-to-overview");
  }, [appState]);

  // Complete reverse transition to overview
  const handleOverviewRestored = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSkill(null);
    setAppState("overview");
  }, []);

  // Keyboard shortcut listener: ESC key returns or closes panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedSkill) {
          setSelectedSkill(null);
        } else if (appState === "category") {
          handleBackToOverview();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSkill, appState, handleBackToOverview]);

  const ActiveCategoryIcon = selectedCategory
    ? CATEGORY_ICONS[selectedCategory.id] || Orbit
    : null;

  return (
    <div className={`orbital-skills-container ${className}`}>
      {/* ── TOP FLOATING NAVIGATION & BREADCRUMB BAR ── */}
      <div className="orbital-nav-bar">
        {/* Left: Back Control or Category Title */}
        <AnimatePresence mode="wait">
          {(appState === "category" || appState === "transitioning-to-category") &&
          selectedCategory ? (
            <motion.button
              key="back-button"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              type="button"
              onClick={handleBackToOverview}
              className="orbital-back-button"
              aria-label="Return to all categories"
            >
              <ArrowLeft size={14} className="text-zinc-600" />
              <span>All Categories</span>
              <span className="text-zinc-300">/</span>
              <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                {selectedCategory.name}
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="overview-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="orbital-view-hint"
            >
              <Orbit size={13} className="text-zinc-400" />
              <span>Click any sphere to travel into its domain</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Interaction Tip */}
        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <Info size={12} />
          <span>
            {appState === "category"
              ? "Click a skill satellite for details"
              : "3D Perspective Camera"}
          </span>
        </div>
      </div>

      {/* ── THREE.JS 3D CANVAS & INTERACTION SCENE ── */}
      {hasWebGL ? (
        <OrbitalCanvas
          data={data}
          appState={appState}
          selectedCategory={selectedCategory}
          selectedSkill={selectedSkill}
          onSelectCategory={handleSelectCategory}
          onSelectSkill={handleSelectSkill}
          onBackToOverview={handleOverviewRestored}
          onCategoryFocused={handleCategoryFocused}
        />
      ) : (
        /* Fallback for environments where WebGL is unavailable */
        <div className="p-8 space-y-6">
          <p className="text-sm text-zinc-500">
            WebGL is not active in this browser. Here is the categorized technical skills overview:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-zinc-200 bg-white"
              >
                <h4 className="font-semibold text-sm text-zinc-900 mb-2">
                  {cat.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SLIDE-OVER SKILL DETAILS DRAWER (STATE C -> DETAILS) ── */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailsPanel
            skill={selectedSkill}
            category={selectedCategory}
            onClose={() => setSelectedSkill(null)}
            IconComponent={ICON_MAP[selectedSkill.icon]}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrbitalSkills3D;
