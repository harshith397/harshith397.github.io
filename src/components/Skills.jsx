import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealHeading from "./RevealHeading";
import OrbitalSkills3D from "./OrbitalSkills3D/OrbitalSkills3D";
import PlanetarySkillsPortfolio from "./PlanetarySkillsPortfolio";

/**
 * Skills Section
 * Minimalist 3D Orbital Skills Portfolio (Section 20 Implementation)
 * - Transparent Glass Central Category Sphere with title inside
 * - 3D Technology-Logo Spheres with authentic logos & titles underneath
 * - Smooth camera transitions and zero desktop/mobile clipping
 */
const Skills = ({ id }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-5% 0px" });

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full px-3 xs:px-6 sm:px-10 md:px-16 lg:px-24 py-16 sm:py-24 md:py-28 bg-white border-t border-black/[0.05]"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col items-start mb-6 sm:mb-10 pb-4 border-b border-zinc-100">
          <RevealHeading text="Skills" />
          <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
        </div>

        {/* 3D Minimalist Orbital Skills Experience */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <OrbitalSkills3D />
        </motion.div>
      </div>
    </section>
  );
};

export { PlanetarySkillsPortfolio, OrbitalSkills3D };
export default Skills;
