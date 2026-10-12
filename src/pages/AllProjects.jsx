import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ExternalLink, ArrowUpRight, ArrowLeft, Sparkles } from "lucide-react";
import projectsData from "../data/projects_data.json";
import RevealHeading from "../components/RevealHeading";

// ── Gowtham Craft Project Card ─────────────────────────────────────────
const AllProjectsCard = ({ project, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
        delay: Math.min(index * 0.05, 0.2),
      }}
      className="group relative flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch p-6 sm:p-8 md:p-10 rounded-3xl bg-white border border-black/[0.07] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:border-black/[0.12] transition-[box-shadow,border-color] duration-200"
    >
      {/* Visual / Screenshot Side */}
      <div className="w-full lg:w-[48%] shrink-0 flex flex-col justify-center">
        <Link
          to={`/project/${project.id}`}
          className="relative block w-full aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 cursor-pointer"
        >
          <img
            src={project.image || "https://placehold.co/800x500?text=Project"}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://placehold.co/800x500?text=Project";
            }}
          />
        </Link>
      </div>

      {/* Narrative & Details Side */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Top meta tags */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              {project.type}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-medium text-zinc-500">
              {project.duration}
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

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 mb-2 group-hover:text-black">
            <Link
              to={`/project/${project.id}`}
              className="hover:underline underline-offset-4 decoration-zinc-300"
            >
              {project.title}
            </Link>
          </h2>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed mb-4">
            {project.tagline}
          </p>

          {/* Data-driven CRM highlight note */}
          {project.highlight && (
            <div className="p-3.5 rounded-xl lined-notebook mb-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-1">
                <Sparkles size={14} className="text-amber-500" />
                <span style={{ fontFamily: "'Caveat', cursive" }} className="text-base text-zinc-800">
                  {project.highlight.title || "Engineering highlight"}
                </span>
              </div>
              <p className="text-zinc-600 font-normal text-xs">
                {project.highlight.description}
              </p>
            </div>
          )}

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech_stack?.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-zinc-100/80 border border-zinc-200/60 text-xs font-medium text-zinc-600 select-none"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Row — Identical to Home Featured Cards */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-100">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span>Live Site</span>
              <ExternalLink size={12} />
            </a>
          )}

          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-medium transition-colors"
            >
              <SiGithub size={13} />
              <span>Source</span>
            </a>
          )}

          <Link
            to={`/project/${project.id}`}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-black underline underline-offset-4 decoration-zinc-400 hover:decoration-black transition-all group/link"
          >
            <span>View Project</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

// ── All Projects Page ──────────────────────────────────────────────────
const AllProjects = () => (
  <div className="w-full min-h-screen bg-white px-6 sm:px-10 md:px-16 lg:px-24 pt-24 pb-24 font-sans">
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/#Work"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black transition-all hover:-translate-x-0.5 shadow-xs"
        >
          <ArrowLeft size={13} />
          <span>Back to overview</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-4">
        <RevealHeading text="All Projects" />
        <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
      </div>

      <p className="text-zinc-500 text-sm font-normal mb-10">
        Archive of {projectsData.length} personal, hackathon, and production tools
      </p>

      {/* Project Cards Grid / Stack */}
      <div className="flex flex-col gap-10">
        {projectsData.map((project, i) => (
          <AllProjectsCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  </div>
);

export default AllProjects;
