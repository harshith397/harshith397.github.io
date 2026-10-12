import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Server, Smartphone, Globe, Cpu, Wifi, BookOpen, List, History } from "lucide-react";
import aboutData from "../data/about.json";
import RevealHeading from "./RevealHeading";
import MarkerSpan from "./MarkerSpan";

const ICON_MAP = {
  Server:     { component: Server,     color: "#3b82f6", rotate: -10 },
  Smartphone: { component: Smartphone, color: "#8b5cf6", rotate: 8  },
  Globe:      { component: Globe,      color: "#10b981", rotate: -6  },
  Cpu:        { component: Cpu,        color: "#f97316", rotate: 12  },
  Wifi:       { component: Wifi,       color: "#0ea5e9", rotate: -8  },
};

const InlineIcon = ({ name }) => {
  const entry = ICON_MAP[name];
  if (!entry) return null;
  const Icon = entry.component;
  return (
    <Icon
      size={19}
      color={entry.color}
      className="inline-block align-middle mb-[3px] mx-[4px]"
      style={{
        transform: `rotate(${entry.rotate}deg)`,
        filter: `drop-shadow(2px 2px 4px ${entry.color}40)`,
      }}
    />
  );
};

const renderSegment = (segment, index) => {
  switch (segment.type) {
    case "text":
      return (
        <span className="text-zinc-650" key={index}>
          {segment.content}
        </span>
      );
    case "keyword":
      return (
        <span key={index} className="inline-flex items-baseline">
          <InlineIcon name={segment.icon} />
          <MarkerSpan>
            <span className="font-semibold text-zinc-900">{segment.content}</span>
          </MarkerSpan>
        </span>
      );
    case "quote":
      return (
        <span
          key={index}
          className="italic text-zinc-800 font-serif-italic"
          style={{ fontFamily: "'Instrument Serif', 'Newsreader', Georgia, serif" }}
        >
          "{segment.content}"
        </span>
      );
    default:
      return null;
  }
};

// ── View 1: Story / Narrative View ────────────────────────────────────
const StoryView = ({ paragraphs }) => (
  <div className="flex flex-col gap-6">
    {paragraphs.map((para, paraIndex) => (
      <p
        key={paraIndex}
        className="text-base sm:text-lg md:text-xl text-zinc-700 leading-relaxed font-normal"
      >
        {para.map((segment, segIndex) => renderSegment(segment, segIndex))}
      </p>
    ))}
  </div>
);

// ── View 2: TL;DR Bullets View ─────────────────────────────────────────
const TldrView = () => {
  const bullets = [
    {
      label: "Education",
      icon: "🎓",
      content: "Computer Science Engineering undergraduate at Vasavi College of Engineering, Hyderabad.",
    },
    {
      label: "Specialization",
      icon: "⚡",
      content: "Full stack engineering, robust backend APIs (FastAPI / Node.js), Redis caching, and automated pipelines.",
    },
    {
      label: "Build Approach",
      icon: "🛠️",
      content: "Identify everyday bottlenecks (college ERPs, GPA planning, manual forms) and build lightweight, high-performance static or microservice solutions.",
    },
    {
      label: "Current Focus",
      icon: "🤖",
      content: "Exploring AI vision integrations, agentic workflows, and distributed microservices architecture.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bullets.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 hover:border-zinc-300 transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{b.icon}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {b.label}
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-700 leading-normal font-medium">
            {b.content}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// ── View 3: Milestone Timeline View (Gowtham Style) ───────────────────
const TimelineView = () => {
  const milestones = [
    {
      year: "2026",
      isCurrent: true,
      title: "AI Pipelines & Full Stack Systems",
      desc: "Architecting automated CI vision pipelines for document ingestion and building resilient full-stack applications with React & FastAPI.",
    },
    {
      year: "2025",
      isCurrent: false,
      title: "SGPA Calculator & Student ERP Tools",
      desc: "Engineered the VCE SGPA Calculator with O(1) grade computation and automated PDF syllabus ingestion via GitHub Actions & Groq vision models.",
    },
    {
      year: "2024",
      isCurrent: false,
      title: "First Hackathon & Full-Stack Awakening",
      desc: "Built AI Email Generator in a 24-hour college hackathon; navigated CORS, multi-runtime envs, and connected LLM APIs end-to-end.",
    },
    {
      year: "2024",
      isCurrent: false,
      title: "Enrolled at Vasavi College of Engineering",
      desc: "Commenced B.E. in Computer Science and Engineering, beginning foundational studies in data structures, algorithms, and computing systems.",
    },
  ];

  return (
    <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 space-y-8 my-2 max-w-2xl">
      {milestones.map((item, index) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          className="relative group"
        >
          {/* Milestone dot on the vertical line */}
          <span
            className={`absolute -left-[31px] sm:-left-[39px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${
              item.isCurrent
                ? "border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                : "border-zinc-300 group-hover:border-zinc-500"
            }`}
          >
            {item.isCurrent && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </span>

          <div className="flex items-baseline gap-3 mb-1">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                item.isCurrent
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-zinc-100 text-zinc-600 border border-zinc-200/60"
              }`}
            >
              {item.year}
            </span>
            <h4 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">
              {item.title}
            </h4>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed font-normal">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// ── Main About Section with Gowtham Segmented View Switcher ───────────
const AboutMe = ({ id }) => {
  const { paragraphs } = aboutData;
  const [viewMode, setViewMode] = useState("story"); // 'story' | 'tldr' | 'timeline'
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const viewOptions = [
    { id: "story", label: "Story", icon: BookOpen },
    { id: "tldr", label: "TL;DR", icon: List },
    { id: "timeline", label: "Timeline", icon: History },
  ];

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-24 bg-white border-t border-black/[0.05]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Gowtham View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-4 border-b border-zinc-100">
          <div>
            <RevealHeading text="About" />
            <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
          </div>

          {/* Segmented view pill toggle */}
          <div className="self-start sm:self-auto flex items-center p-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-inner">
            {viewOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = viewMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setViewMode(opt.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors select-none ${
                    isActive
                      ? "text-zinc-950 font-semibold"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="aboutTogglePill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/[0.04]"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon size={13} className="relative z-10" />
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area with smooth tab transition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          className="min-h-[220px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {viewMode === "story" && <StoryView paragraphs={paragraphs} />}
              {viewMode === "tldr" && <TldrView />}
              {viewMode === "timeline" && <TimelineView />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;