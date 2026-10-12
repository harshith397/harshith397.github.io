import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import projectsData from "../data/projects_data.json";
import CyclingButton from "../components/CyclingButton";
import RevealHeading from "../components/RevealHeading";
import HighlightText from "../components/HighlightText";
import {
  ExternalLink,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import ProjectTechGlobe from "../components/ProjectTechGlobe";

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

// ── Mobile preview viewer (3 at a time, arrows if >3) ─────────
const MobilePreviewViewer = ({ previews }) => {
  const [offset, setOffset] = useState(0);
  const visible = 3;
  const canPrev = offset > 0;
  const canNext = offset + visible < previews.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 sm:gap-4 items-end">
        {previews.slice(offset, offset + visible).map((src, i) => (
          <div
            key={i}
            className="flex-1 overflow-hidden rounded-2xl bg-zinc-100 border border-black/[0.06] shadow-xs"
            style={{ aspectRatio: "9/19" }}
          >
            <img
              src={src}
              alt={`preview-${i}`}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-[1.02]"
              onError={(e) => {
                e.target.src = "https://placehold.co/200x400?text=Preview";
              }}
            />
          </div>
        ))}
      </div>
      {previews.length > visible && (
        <div className="flex gap-2 justify-center mt-2">
          <button
            type="button"
            onClick={() => setOffset((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            aria-label="Previous previews"
            className="w-9 h-9 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:text-black hover:border-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() =>
              setOffset((p) => Math.min(previews.length - visible, p + 1))
            }
            disabled={!canNext}
            aria-label="Next previews"
            className="w-9 h-9 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:text-black hover:border-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// ── Web preview viewer (1 at a time, arrows + dots if >1) ─────
const WebPreviewViewer = ({ previews }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Browser mockup window container */}
      <div
        className="w-full overflow-hidden rounded-2xl bg-zinc-100 border border-black/[0.07] shadow-xs"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={previews[current]}
          alt={`preview-${current}`}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-[1.01]"
          onError={(e) => {
            e.target.src = "https://placehold.co/800x450?text=Preview";
          }}
        />
      </div>
      {previews.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setCurrent((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            aria-label="Previous preview"
            className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:text-black hover:border-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
          >
            <ChevronLeft size={15} />
          </button>
          <div className="flex gap-1.5">
            {previews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to preview ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-5 h-2 bg-zinc-900" : "w-2 h-2 bg-zinc-300"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setCurrent((p) => Math.min(previews.length - 1, p + 1))
            }
            disabled={current === previews.length - 1}
            aria-label="Next preview"
            className="w-8 h-8 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:text-black hover:border-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
          >
            <ChevronRight size={15} />
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

// ── Main Project Detail Page ───────────────────────────────────
const ProjectPage = () => {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Project not found.
      </div>
    );

  const previews = project.previews || project.screenshots || [];
  const isMobile =
    (project.previewType || project.screenshotType) === "mobile";
  const PreviewViewer = isMobile ? MobilePreviewViewer : WebPreviewViewer;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-amber-200 selection:text-zinc-950">
      {/* ── Banner ─────────────────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: "4/1" }}>
        {project.banner ? (
          <img
            src={project.banner}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/1200x300?text=" + encodeURIComponent(project.title);
            }}
          />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black transition-all hover:-translate-x-0.5 shadow-xs"
          >
            <ArrowLeft size={13} />
            <span>Back to projects</span>
          </Link>
        </div>

        {/* Hero header block */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              {project.type}
            </span>
            <span className="text-zinc-300">•</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                project.tag === "Completed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : project.tag === "Discontinued"
                  ? "bg-zinc-100 text-zinc-600 border-zinc-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  project.tag === "Completed"
                    ? "bg-emerald-500"
                    : project.tag === "Discontinued"
                    ? "bg-zinc-400"
                    : "bg-amber-500"
                }`}
              />
              {project.tag}
            </span>
          </div>

          <FadeUp delay={0.15}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-950 leading-tight tracking-tight mb-4">
              {project.title}
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="text-lg md:text-xl text-zinc-650 font-normal leading-relaxed max-w-2xl mb-8">
              {project.tagline}
            </p>
          </FadeUp>

          {/* Action Row — Identical to Home & AllProjects buttons */}
          <FadeUp delay={0.35}>
            <div className="flex flex-wrap items-center gap-3">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <span>Live Site</span>
                  <ExternalLink size={13} />
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs sm:text-sm font-medium transition-colors"
                >
                  <SiGithub size={14} />
                  <span>Source</span>
                </a>
              )}
            </div>
          </FadeUp>
        </div>

        {/* Gowtham-style Meta Grid */}
        <FadeUp delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200/80 border border-zinc-200/80 rounded-2xl overflow-hidden mb-16 shadow-xs">
            {[
              { label: "Status", value: project.tag },
              { label: "Duration", value: project.duration },
              { label: "Role", value: project.role },
              { label: "Category", value: project.type },
            ].map(
              ({ label, value }) =>
                value && (
                  <div
                    key={label}
                    className="bg-white px-5 sm:px-6 py-4 sm:py-5 flex flex-col gap-1"
                  >
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-zinc-850 flex items-center gap-1.5">
                      {label === "Status" && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            value === "Completed"
                              ? "bg-emerald-500"
                              : value === "Discontinued"
                              ? "bg-zinc-400"
                              : "bg-amber-500"
                          }`}
                        />
                      )}
                      {value}
                    </span>
                  </div>
                )
            )}
          </div>
        </FadeUp>

        {/* Data-Driven CRM Engineering Highlight Note */}
        {project.highlight && (
          <FadeUp delay={0.45}>
            <div className="p-4 sm:p-5 rounded-2xl lined-notebook mb-16 max-w-4xl text-sm sm:text-base text-zinc-700 leading-relaxed shadow-xs">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 mb-1.5">
                <Sparkles size={16} className="text-amber-500" />
                <span
                  style={{ fontFamily: "'Caveat', cursive" }}
                  className="text-lg sm:text-xl text-zinc-800"
                >
                  {project.highlight.title || "Engineering highlight"}
                </span>
              </div>
              <p className="text-zinc-600 font-normal text-sm sm:text-base leading-relaxed">
                {project.highlight.description}
              </p>
            </div>
          </FadeUp>
        )}

        {/* Overview: Problem, Solution, Results */}
        {(project.problem || project.solution || project.results?.length) && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="Overview" />
              <div className="flex flex-col gap-10 max-w-4xl">
                {project.problem && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">
                      Problem
                    </p>
                    <p className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">
                      Solution
                    </p>
                    <p className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
                {project.results?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">
                      Result
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {project.results.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-base sm:text-lg text-zinc-800 font-normal"
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Previews (formerly Screenshots) */}
        {previews.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="Previews" />
              <PreviewViewer previews={previews} />
            </div>
          </FadeUp>
        )}

        {/* Architecture */}
        {project.architecture_url && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="System Architecture" />
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
                <img
                  src={project.architecture_url}
                  alt="Architecture"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeUp>
        )}

        {/* Built With (Orbital 2D Tech Stack Globe) */}
        {project.tech_stack?.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="mb-20">
              <SectionLabel text="Built With" />
              <ProjectTechGlobe
                techStack={project.tech_stack}
                projectTitle={project.title}
                projectTag={project.tag}
              />
            </div>
          </FadeUp>
        )}

        {/* Engineering Log */}
        {project.project_journal && (
          <FadeUp delay={0.1}>
            <div className="mb-20 max-w-4xl">
              <SectionLabel text="Engineering Log" />
              <div className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">
                <HighlightText text={project.project_journal} />
              </div>
            </div>
          </FadeUp>
        )}

        {/* CTA */}
        <FadeUp delay={0.1}>
          <div className="border-t border-zinc-100 pt-20 flex flex-col items-center text-center gap-8">
            <p className="text-xl md:text-3xl font-light text-zinc-800 max-w-lg leading-relaxed">
              Want to know about my experience and projects?{" "}
              <span
                className="text-zinc-500 italic"
                style={{ fontFamily: "'Instrument Serif', 'Newsreader', Georgia, serif" }}
              >
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