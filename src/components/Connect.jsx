import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealHeading from "./RevealHeading";
import CyclingButton from "./CyclingButton";
import { Mail, ArrowUpRight } from "lucide-react";

const EMAIL = "medichelmeharshith6@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Hey%20Harshith!`;

// ── Social Pill ────────────────────────────────────────────────────────
const SocialPill = ({ href, label, svgPath, viewBox = "0 0 24 24", iconBg = "#000000" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-3 rounded-full border border-zinc-200/80 bg-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-300 hover:text-black transition-all duration-200 select-none"
  >
    <span
      className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-transform group-hover:scale-110"
      style={{ backgroundColor: iconBg }}
    >
      <svg viewBox={viewBox} fill="white" width={13} height={13}>
        <path d={svgPath} />
      </svg>
    </span>
    <span>{label}</span>
  </a>
);

// ── Main Contact Section ───────────────────────────────────────────────
const Contact = ({ id }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      id={id}
      className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-32 bg-white border-t border-black/[0.05]"
    >
      <div
        ref={sectionRef}
        className="max-w-6xl mx-auto flex flex-col gap-10 sm:gap-14"
      >
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
          className="w-full text-left"
        >
          <RevealHeading text="Connect" />
          <div className="mt-2 w-10 h-[1.5px] bg-zinc-200" />
        </motion.div>

        {/* Big Editorial Content */}
        <div className="flex flex-col items-center text-center gap-10 sm:gap-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1], delay: 0.06 }}
            className="space-y-3"
          >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-950 tracking-tight leading-[1.15]">
            Let's work together.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-zinc-500 max-w-lg mx-auto font-normal leading-relaxed">
            Have an engineering challenge, an ambitious project, or an internship opportunity?
            I'd love to talk.
          </p>
        </motion.div>

        {/* Interactive Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1], delay: 0.12 }}
          className="flex justify-center items-center"
        >
          <CyclingButton />
        </motion.div>

        {/* Social Links Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1], delay: 0.16 }}
          className="flex flex-wrap justify-center gap-2.5 sm:gap-3"
        >
          <SocialPill
            href="https://x.com/harrshth_24"
            label="X (Twitter)"
            iconBg="#000000"
            svgPath="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
          />
          <SocialPill
            href="https://www.linkedin.com/in/harshith-medichelme/"
            iconBg="#0A66C2"
            label="LinkedIn"
            svgPath="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
          <SocialPill
            href="https://github.com/harshith397"
            iconBg="#181717"
            label="GitHub"
            svgPath="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
          <SocialPill
            href={MAILTO}
            iconBg="#EA4335"
            label="Email"
            svgPath="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
          />
        </motion.div>

        {/* Bottom Status & Resume */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-4"
        >
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200/90 text-xs font-semibold text-zinc-700 hover:text-black hover:border-black transition-all"
          >
            <span>View Resume</span>
            <ArrowUpRight size={13} />
          </a>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-zinc-200/80 bg-zinc-50/50 text-xs font-medium text-zinc-600 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Hyderabad, India • Available to collaborate</span>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
