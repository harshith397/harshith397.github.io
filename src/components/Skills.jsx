import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
} from "@icons-pack/react-simple-icons";
import { LayoutGrid, Layers, Terminal, Database, Cpu, Wrench } from "lucide-react";
import skillsData from "../data/skills.json";
import RevealHeading from "./RevealHeading";

const ICON_MAP = {
  SiPython: SiPython,
  SiReact: SiReact,
  SiTypescript: SiTypescript,
  SiTailwindcss: SiTailwindcss,
  SiFastapi: SiFastapi,
  SiNodedotjs: SiNodedotjs,
  SiHuggingface: SiHuggingface,
  SiPostgresql: SiPostgresql,
  SiMongodb: SiMongodb,
  SiRedis: SiRedis,
  SiSqlite: SiSqlite,
  SiDocker: SiDocker,
  SiGit: SiGit,
  SiLinux: SiLinux,
  SiGithubactions: SiGithubactions,
  SiMqtt: SiMqtt,
  SiGo: SiGo,
  SiC: SiC,
  SiJava: SiOpenjdk,
  SiArduino: SiArduino,
  SiOllama: SiOllama,
};

const SkillPill = ({ name, icon, color }) => {
  const Icon = icon ? ICON_MAP[icon] : null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-sm hover:border-zinc-300 hover:text-zinc-950 transition-all duration-200 cursor-default select-none">
      {Icon && <Icon size={16} color={color || "currentColor"} />}
      <span>{name}</span>
    </span>
  );
};

// ── Alternative 1: Bento Architecture Cards (Gowtham / CRED Product Style) ──
const BentoSkillGrid = () => {
  const cards = [
    {
      title: "Backend & Systems Architecture",
      icon: Terminal,
      highlight: "High-throughput APIs & microservice proxies",
      skills: [
        { name: "FastAPI", icon: "SiFastapi", color: "#009688", role: "ERP scraper proxy" },
        { name: "Node.js", icon: "SiNodedotjs", color: "#339933", role: "Runtime services" },
        { name: "Python", icon: "SiPython", color: "#3776AB", role: "Core backend & scripting" },
        { name: "GoLang", icon: "SiGo", color: "#00ADD8", role: "Concurrent tooling" },
        { name: "C / Java", icon: "SiC", color: "#283593", role: "Systems foundations" },
      ],
      border: "border-blue-100/80 hover:border-blue-300",
      accent: "bg-blue-50/50 text-blue-700",
    },
    {
      title: "Frontend Engineering & UI Craft",
      icon: Layers,
      highlight: "Responsive SPAs, spring physics & accessible design",
      skills: [
        { name: "React", icon: "SiReact", color: "#61DAFB", role: "Component architecture" },
        { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4", role: "Design systems" },
        { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", role: "Type-safe apps" },
      ],
      border: "border-purple-100/80 hover:border-purple-300",
      accent: "bg-purple-50/50 text-purple-700",
    },
    {
      title: "Databases & Cloud Caching",
      icon: Database,
      highlight: "Persistent relational stores & sub-millisecond caching",
      skills: [
        { name: "PostgreSQL", icon: "SiPostgresql", color: "#0064a5", role: "Relational data" },
        { name: "Redis", icon: "SiRedis", color: "#DC382D", role: "In-memory caching" },
        { name: "SQLite", icon: "SiSqlite", color: "#003B57", role: "Embedded fast storage" },
      ],
      border: "border-emerald-100/80 hover:border-emerald-300",
      accent: "bg-emerald-50/50 text-emerald-700",
    },
    {
      title: "DevOps, Automation & Embedded",
      icon: Wrench,
      highlight: "CI pipelines, automated document vision & IoT sensors",
      skills: [
        { name: "GitHub Actions", icon: "SiGithubactions", color: "#2088FF", role: "Daily CI sync" },
        { name: "Docker", icon: "SiDocker", color: "#2496ED", role: "Containerization" },
        { name: "Git & Linux", icon: "SiGit", color: "#F05032", role: "Environment workflow" },
        { name: "Ollama / AI", icon: "SiOllama", color: "#000000", role: "Local models & vision" },
        { name: "MQTT & Arduino", icon: "SiMqtt", color: "#660066", role: "IoT telemetry" },
      ],
      border: "border-amber-100/80 hover:border-amber-300",
      accent: "bg-amber-50/50 text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {cards.map((card, i) => {
        const HeaderIcon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className={`group p-6 rounded-2xl bg-zinc-50/70 border ${card.border} hover:bg-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className={`p-2 rounded-xl ${card.accent}`}>
                  <HeaderIcon size={18} />
                </span>
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">
                  {card.title}
                </h3>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-normal mb-5">
              {card.highlight}
            </p>

            {/* Badges with role context */}
            <div className="flex flex-wrap gap-2">
              {card.skills.map((s) => {
                const Icon = ICON_MAP[s.icon];
                return (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] group-hover:border-zinc-300 transition-colors"
                  >
                    {Icon && <Icon size={14} color={s.color || "currentColor"} />}
                    <span className="font-semibold">{s.name}</span>
                    {s.role && (
                      <span className="text-[10px] text-zinc-400 font-normal">
                        • {s.role}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ── Alternative 2: Categorized Rows (Pills View) ──
const CategoryRow = ({ label, skills, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.35,
        ease: [0.33, 1, 0.68, 1],
        delay: index * 0.05,
      }}
      className="flex flex-col md:flex-row md:items-start gap-2.5 md:gap-8 pt-5 pb-5 border-b border-zinc-100 last:border-b-0"
    >
      <span className="shrink-0 md:w-36 text-xs font-semibold tracking-[0.1em] uppercase text-zinc-400 md:pt-2 select-none">
        {label}
      </span>

      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {skills.map((skill) => (
          <SkillPill key={skill.name} {...skill} />
        ))}
      </div>
    </motion.div>
  );
};

// ── Main Skills Section with Gowtham Segmented View Switcher ──
const Skills = ({ id }) => {
  const { categories } = skillsData;
  const [viewStyle, setViewStyle] = useState("bento"); // 'bento' | 'pills'
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-5% 0px" });

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-32 bg-white border-t border-black/[0.05]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Segmented View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-4 border-b border-zinc-100">
          <div>
            <RevealHeading text="Skills" />
            <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
          </div>

          {/* Segmented view pill toggle */}
          <div className="self-start sm:self-auto flex items-center p-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => setViewStyle("bento")}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors select-none ${
                viewStyle === "bento"
                  ? "text-zinc-950 font-semibold"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {viewStyle === "bento" && (
                <motion.span
                  layoutId="skillsTogglePill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/[0.04]"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <LayoutGrid size={13} className="relative z-10" />
              <span className="relative z-10">Bento Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setViewStyle("pills")}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors select-none ${
                viewStyle === "pills"
                  ? "text-zinc-950 font-semibold"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {viewStyle === "pills" && (
                <motion.span
                  layoutId="skillsTogglePill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/[0.04]"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <Layers size={13} className="relative z-10" />
              <span className="relative z-10">Categorized Pills</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
          className="min-h-[240px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={viewStyle}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {viewStyle === "bento" ? (
                <BentoSkillGrid />
              ) : (
                <div className="flex flex-col">
                  {categories.map((cat, i) => (
                    <CategoryRow
                      key={cat.label}
                      label={cat.label}
                      skills={cat.skills}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
