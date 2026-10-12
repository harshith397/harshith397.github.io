import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import projectsData from "../data/projects_data.json";
import CyclingButton from "../components/CyclingButton";
import RevealHeading from "../components/RevealHeading";
import HighlightText from "../components/HighlightText";
import {
  SiReact, SiFastapi, SiDocker, SiPostgresql, SiRedis,
  SiMongodb, SiTailwindcss, SiFlask, SiNodedotjs,
  SiTypescript, SiLangchain, SiHuggingface, SiMqtt,
  SiArduino, SiGit, SiLinux, SiGithubactions, SiSqlite,
  SiPython, SiGithub,
} from "@icons-pack/react-simple-icons";

// ── Tech icon map ──────────────────────────────────────────────
const ICON_MAP = {
  React:            { component: SiReact,         color: "#61DAFB" },
  FastAPI:          { component: SiFastapi,        color: "#009688" },
  Docker:           { component: SiDocker,         color: "#2496ED" },
  PostgreSQL:       { component: SiPostgresql,     color: "#4169E1" },
  Redis:            { component: SiRedis,          color: "#DC382D" },
  MongoDB:          { component: SiMongodb,        color: "#47A248" },
  "Tailwind CSS":   { component: SiTailwindcss,    color: "#06B6D4" },
  Flask:            { component: SiFlask,          color: "#000000" },
  "Node.js":        { component: SiNodedotjs,      color: "#339933" },
  TypeScript:       { component: SiTypescript,     color: "#3178C6" },
  LangChain:        { component: SiLangchain,      color: "#1C3C3C" },
  "Hugging Face":   { component: SiHuggingface,    color: "#FFD21E" },
  MQTT:             { component: SiMqtt,           color: "#660066" },
  Arduino:          { component: SiArduino,        color: "#00979D" },
  Git:              { component: SiGit,            color: "#F05032" },
  Linux:            { component: SiLinux,          color: "#FCC624" },
  "GitHub Actions": { component: SiGithubactions,  color: "#2088FF" },
  SQLite:           { component: SiSqlite,         color: "#003B57" },
  Python:           { component: SiPython,         color: "#3776AB" },
};

// ── Fade up animation wrapper ──────────────────────────────────
const FadeUp = ({ children, delay = 0 }) => {
  const fadeRef = useRef(null);
  const isInView = useInView(fadeRef, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={fadeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

// ── Mobile image viewer (3 at a time, arrows if >3) ───────────
const MobileImageViewer = ({ screenshots }) => {
  const [offset, setOffset] = useState(0);
  const visible = 3;
  const canPrev = offset > 0;
  const canNext = offset + visible < screenshots.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 items-end">
        {screenshots.slice(offset, offset + visible).map((src, i) => (
          <div key={i} className="flex-1 overflow-hidden rounded-2xl bg-zinc-100 shadow-md" style={{ aspectRatio: "9/19" }}>
            <img src={src} alt={`screen-${i}`}
              className="w-full h-full object-contain transition-transform duration-500 "
              onError={(e) => { e.target.src = "https://placehold.co/200x400?text=Screen"; }} />
          </div>
        ))}
      </div>
      {screenshots.length > visible && (
        <div className="flex gap-2 justify-center mt-1">
          <button onClick={() => setOffset((p) => Math.max(0, p - 1))} disabled={!canPrev}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center disabled:opacity-30 transition-all">
            <SiGithub size={14} className="rotate-90 opacity-0" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => setOffset((p) => Math.min(screenshots.length - visible, p + 1))} disabled={!canNext}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center disabled:opacity-30 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ── Web image viewer (1 at a time, arrows + dots if >1) ───────
const WebImageViewer = ({ screenshots }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-md" style={{ aspectRatio: "16/9" }}>
        <img src={screenshots[current]} alt={`screen-${current}`}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.src = "https://placehold.co/800x450?text=Screenshot"; }} />
      </div>
      {screenshots.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center disabled:opacity-30 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex gap-1.5">
            {screenshots.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-2 bg-zinc-800" : "w-2 h-2 bg-zinc-300"}`} />
            ))}
          </div>
          <button onClick={() => setCurrent((p) => Math.min(screenshots.length - 1, p + 1))} disabled={current === screenshots.length - 1}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center disabled:opacity-30 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ── Section label ──────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <div className="mb-8">
    <RevealHeading text={text} />
    <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
  </div>
);


// ── Main page ──────────────────────────────────────────────────
const ProjectPage = () => {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center text-zinc-400">
      Project not found.
    </div>
  );

  const ImageViewer = project.screenshotType === "mobile" ? MobileImageViewer : WebImageViewer;

  return (
    <div className="min-h-screen bg-white text-black">

      {/* ── Banner ─────────────────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: "4/1" }}>
        {project.banner ? (
          <img src={project.banner} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300 text-5xl font-bold">
            {project.title[0]}
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 pb-32">
        {/* Back navigation */}
        <div className="pt-8 pb-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black transition-all hover:-translate-x-0.5 shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={13} height={13}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to projects</span>
          </Link>
        </div>

        {/* Hero text */}
        <div className="mb-16">
          <RevealHeading text={project.type} />
          <FadeUp delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-semibold text-zinc-900 leading-tight tracking-tight mb-4">
              {project.title}
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-lg md:text-xl text-zinc-800 font-light leading-relaxed max-w-2xl mb-8">
              {project.tagline}
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="flex items-center gap-4">
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:opacity-70 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={16} height={16}>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Live Demo
                </a>
              )}
              {project.repo_url && (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-zinc-700 text-sm font-medium rounded-full hover:border-black hover:text-black transition-all">
                  <SiGithub size={16} />
                  GitHub
                </a>
              )}
            </div>
          </FadeUp>
        </div>

        {/* Meta row */}
        <FadeUp delay={0.5}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 rounded-2xl overflow-hidden mb-20">
            {[
              { label: "Status", value: project.tag },
              { label: "Duration", value: project.duration },
              { label: "Role", value: project.role },
              { label: "Category", value: project.type },
            ].map(({ label, value }) => value && (
              <div key={label} className="bg-white px-6 py-5 flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">{label}</span>
                <span className="text-sm font-medium text-zinc-800">{value}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Overview */}
        {(project.problem || project.solution || project.results?.length) && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="Overview" />
              <div className="flex flex-col gap-10 max-w-4xl">
                {project.problem && (
                  <div>
                    <p className="text-sm font-semibold tracking-widest uppercase text-zinc-400 mb-3">Problem</p>
                    <p className="text-base md:text-2xl lg:text-lg font-normal text-zinc-800  leading-relaxed">{project.problem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <p className="text-sm font-semibold tracking-widest uppercase text-zinc-400 mb-3">Solution</p>
                    <p className="text-base md:text-2xl lg:text-lg text-zinc-800 font-normal leading-relaxed">{project.solution}</p>
                  </div>
                )}
                {project.results?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold tracking-widest uppercase text-zinc-400 mb-3">Result</p>
                    <ul className="flex flex-col gap-2">
                      {project.results.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-base md:text-2xl lg:text-lg text-zinc-800 font-normal">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Screenshots */}
        {project.screenshots?.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="Screenshots" />
              <ImageViewer screenshots={project.screenshots} />
            </div>
          </FadeUp>
        )}

        {/* Architecture */}
        {project.architecture_url && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="System Architecture" />
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                <img src={project.architecture_url} alt="Architecture" className="w-full h-auto" />
              </div>
            </div>
          </FadeUp>
        )}

        {/* Tech stack */}
        {project.tech_stack?.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="Built With" />
              <div className="flex flex-wrap gap-3">
                {project.tech_stack.map((tech) => {
                  const entry = ICON_MAP[tech];
                  const Icon = entry?.component;
                  return (
                    <span key={tech} className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
                      {Icon && <Icon size={16} color={entry.color} style={{ transform: "rotate(-6deg)", filter: `drop-shadow(1px 1px 3px ${entry.color}40)` }} />}
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Journal */}
        {project.project_journal && (
          <FadeUp delay={0.1}>
            <div className="mb-20 max-w-4xl">
              <SectionLabel text="Engineering Log" />
              <div className="text-base md:text-2xl lg:text-lg text-zinc-800 font-normal leading-relaxed">
                <HighlightText text={project.project_journal} />
              </div>
              {/*<div className="mt-12 text-center opacity-30 text-2xl font-serif italic">fin.</div>*/}
            </div>
          </FadeUp>
        )}

        {/* CTA */}
        <FadeUp delay={0.1}>
          <div className="border-t border-zinc-100 pt-20 flex flex-col items-center text-center gap-8">
            <p className="text-xl md:text-3xl font-light text-zinc-800 max-w-lg leading-relaxed">
              Want to know about my experience and projects?{" "}
              <span className="text-zinc-500 italic" style={{ fontFamily: "Georgia, serif" }}>
                Get in touch.
              </span>
            </p>
            <CyclingButton />
          </div>
        </FadeUp>

      </main>
    </div>
  );
};

export default ProjectPage;