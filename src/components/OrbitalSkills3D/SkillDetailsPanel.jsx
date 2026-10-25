import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Code2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import projectsData from "../../data/projects_data.json";

// Chroma SVG component
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

const SkillDetailsPanel = ({
  skill,
  category,
  onClose,
  IconComponent,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!skill) return null;

  // Retrieve linked projects from projects_data.json
  const linkedProjects = (skill.projectIds || [])
    .map((pid) => projectsData.find((p) => p.id === pid))
    .filter(Boolean);

  const EffectiveIcon = skill.icon === "SiChroma" ? SiChroma : IconComponent;

  return (
    <AnimatePresence>
      <motion.div
        key={skill.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="orbital-details-panel p-6 sm:p-8"
        role="dialog"
        aria-label={`${skill.name} technical details`}
      >
        {/* Header with category tag and close button */}
        <div className="flex items-center justify-between pb-5 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: category?.color || "#5286DE" }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {category?.name || "Skill Detail"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-black/[0.05] transition-colors"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Skill Identity & Icon */}
        <div className="mt-6 flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm flex-shrink-0"
            style={{
              backgroundColor: `${skill.brandColor || skill.color}14`,
              borderColor: `${skill.brandColor || skill.color}35`,
            }}
          >
            {EffectiveIcon ? (
              <EffectiveIcon size={28} color={skill.brandColor || skill.color} />
            ) : (
              <Code2 size={28} color={skill.brandColor || skill.color} />
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
              {skill.name}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 font-mono">
              3D Technology Sphere • {category?.name}
            </p>
          </div>
        </div>

        {/* Engineering Purpose / Description */}
        <div className="mt-6 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Technical Role
          </span>
          <p className="text-sm text-zinc-700 leading-relaxed font-normal">
            {skill.description}
          </p>
        </div>

        {/* Practical Evidence in Real Projects */}
        {skill.evidence && (
          <div className="mt-6 p-4 rounded-xl bg-zinc-50/80 border border-black/[0.05] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Applied In Practice</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {skill.evidence}
            </p>
          </div>
        )}

        {/* Linked Projects Section */}
        {linkedProjects.length > 0 && (
          <div className="mt-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Featured Implementations ({linkedProjects.length})
            </span>

            <div className="mt-3 space-y-3">
              {linkedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-xl border border-black/[0.06] bg-white hover:border-black/[0.15] hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900">
                      {proj.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      {proj.type}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                    {proj.tagline || proj.problem}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    {proj.demo_url && (
                      <a
                        href={proj.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight size={12} />
                      </a>
                    )}
                    {proj.repo_url && (
                      <a
                        href={proj.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
                      >
                        <SiGithub size={12} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-auto pt-6 border-t border-black/[0.05] flex items-center justify-between text-xs text-zinc-400">
          <span>Press ESC or click outside to dismiss</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-zinc-700 hover:text-black underline underline-offset-2"
          >
            Done
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillDetailsPanel;
