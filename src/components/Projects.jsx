import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import projectsData from "../data/projects_data.json";
import RevealHeading from "./RevealHeading";
import ProjectCard from "./ProjectCard";
import { ArrowUpRight } from "lucide-react";

const featured = projectsData.filter((p) => p.featured);

// ── Main Projects Section ─────────────────────────────────────────────
const Projects = ({ id }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      id={id}
      className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-24 bg-white border-t border-black/[0.05]"
    >
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <RevealHeading text="Featured Work" />
            <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal">
            Highlighted software solutions & interactive tools
          </p>
        </motion.div>

        {/* Featured Projects List */}
        <div className="flex flex-col gap-10">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* View All Projects Pill Link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
          className="mt-14 flex justify-center"
        >
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs sm:text-sm font-semibold text-zinc-800 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <span>View all projects ({projectsData.length})</span>
            <ArrowUpRight
              size={15}
              className="text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
