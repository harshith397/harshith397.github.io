import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import projectsData from "../data/projects_data.json";
import RevealHeading from "../components/RevealHeading";
import ProjectCard from "../components/ProjectCard";

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
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            titleAs="h2"
            animateOnScroll={false}
          />
        ))}
      </div>
    </div>
  </div>
);

export default AllProjects;
