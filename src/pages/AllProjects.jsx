import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { SiGithub } from "@icons-pack/react-simple-icons";
import projectsData from "../data/projects_data.json";
import RevealHeading from "../components/RevealHeading";

// ── Single project row ─────────────────────────────────────────
const ProjectRow = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
        delay: index * 0.1,
      }}
      className="flex flex-col md:flex-row gap-10 md:gap-16 py-16 md:py-20"
    >
      {/* Left — thumbnail */}
      <div className="w-full md:w-[55%] shrink-0 overflow-hidden rounded-2xl bg-zinc-100 shadow-md">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          style={{ aspectRatio: "16/9" }}
          onError={(e) => {
            e.target.src = "https://placehold.co/800x450?text=Project";
          }}
        />
      </div>

      {/* Right — description */}
      <div className="flex flex-col justify-center gap-4 flex-1">
        {/* Status badge */}
        <span
  className={`self-start flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
    project.tag === "Working"
      ? "bg-orange-50 text-orange-500 border-orange-200"
      : project.tag === "Discontinued"
      ? "bg-zinc-100 text-zinc-500 border-zinc-200"
      : "bg-emerald-50 text-emerald-600 border-emerald-200"
  }`}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width={11}
    height={11}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
  {project.tag}
</span>


        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-zinc-900 leading-tight">
          {project.title}
        </h2>

        {/* Type */}
        <p className="text-xs font-medium tracking-widest uppercase text-zinc-400">
          {project.type}
        </p>

        {/* Tagline */}
        <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed max-w-sm">
          {project.tagline}
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 mt-2">
          <Link
            to={`/project/${project.id}`}
            className="text-sm font-semibold text-black underline underline-offset-4 hover:opacity-60 transition-opacity flex items-center gap-1"
          >
            View Project
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width={13}
              height={13}
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-black transition-colors"
            >
              <SiGithub size={15} />
              GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-black transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                width={15}
                height={15}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Page ───────────────────────────────────────────────────────
const AllProjects = () => (
  <div className="w-full min-h-screen bg-white px-6 sm:px-10 md:px-16 lg:px-24 pt-24 pb-24 font-sans">
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/#Work"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black transition-all hover:-translate-x-0.5 shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={13} height={13}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to overview</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-4">
        <RevealHeading text="All Projects" />
        <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
      </div>

      <p className="text-zinc-500 text-sm font-normal mb-6">
        Archive of {projectsData.length} personal, hackathon, and production tools
      </p>

      {/* Project rows */}
      <div className="divide-y divide-zinc-100">
        {projectsData.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  </div>
);

export default AllProjects;
