import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealHeading from "./RevealHeading";
import PlanetarySkillsPortfolio from "./PlanetarySkillsPortfolio";

/**
 * Skills Section (Gowtham Oleti Design System)
 * Exclusively features the interactive 2D Planetary/Orbital Skills Selector.
 */
const Skills = ({ id }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-5% 0px" });

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full px-4 xs:px-6 sm:px-10 md:px-16 lg:px-24 py-20 sm:py-28 md:py-32 bg-white border-t border-black/[0.05] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col items-start mb-8 sm:mb-12 pb-4 border-b border-zinc-100">
          <RevealHeading text="Skills" />
          <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
        </div>

        {/* Dedicated 2D Planetary / Orbital Skills Experience */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center"
        >
          <PlanetarySkillsPortfolio />
        </motion.div>
      </div>
    </section>
  );
};

export { PlanetarySkillsPortfolio };
export default Skills;
