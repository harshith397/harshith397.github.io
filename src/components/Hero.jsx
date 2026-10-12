import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import GridBackground from "./GridBackground";
import heroData from "../data/hero.json";
import TypewriterResume from "./TypewriterResume";
import { FileText, Sparkles } from "lucide-react";

const calculateAge = (dob) => {
  const birth = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  return hasHadBirthdayThisYear ? age : age - 1;
};

// ── Realistic Draggable Polaroid (Gowtham Style) ──────────────────────
const PolaroidCard = ({ src, alt }) => {
  const [flashing, setFlashing] = useState(false);
  const [photoFilter, setPhotoFilter] = useState("grayscale");

  const handleSnap = () => {
    setFlashing(true);
    setPhotoFilter((prev) => (prev === "grayscale" ? "color" : "grayscale"));
    setTimeout(() => setFlashing(false), 380);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, rotate: 4, y: 15 }}
      animate={{ opacity: 1, scale: 1, rotate: 3, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      drag
      dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
      whileHover={{ y: -6, rotate: 1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      whileDrag={{ scale: 1.06, rotate: 5, zIndex: 100, cursor: "grabbing" }}
      onClick={handleSnap}
      className="relative shrink-0 w-[250px] xs:w-64 sm:w-72 md:w-80 cursor-grab select-none origin-center mx-auto md:mx-0"
      style={{
        transformOrigin: "center center",
        touchAction: "none",
      }}
    >
      <div className="relative bg-white p-3.5 pb-12 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.12)] border border-black/[0.05] rounded-[2px] transition-all duration-300 hover:shadow-[0_24px_50px_rgba(0,0,0,0.16)] paper-grain">
        {/* Photo frame */}
        <div className="relative w-full aspect-[4/4.5] overflow-hidden bg-zinc-200 rounded-[2px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)]">
          <img
            src={src}
            alt={alt}
            draggable={false}
            className={`w-full h-full object-cover transition-all duration-500 ${
              photoFilter === "grayscale" ? "grayscale contrast-[1.05]" : "grayscale-0"
            }`}
          />

          {/* Flash animation */}
          <AnimatePresence>
            {flashing && (
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                className="absolute inset-0 bg-white pointer-events-none z-20"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Handwritten caption */}
        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 px-4">
          <p
            className="text-base sm:text-lg text-zinc-600 tracking-wide font-handwriting select-none"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            harshith.jpeg
          </p>
          <span
            className="text-xs text-zinc-400 font-handwriting opacity-80"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            (click me)
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Hero Section ────────────────────────────────────────────────────────
const Hero = ({ id }) => {
  const { name, role, dob, profileImage, resumeUrl, greetings } = heroData;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const age = calculateAge(dob);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 2800);
    return () => clearInterval(intervalId);
  }, [greetings.length]);

  return (
    <section
      id={id}
      className="relative w-full bg-white flex flex-col justify-start px-4 sm:px-10 md:px-16 lg:px-24 pt-24 sm:pt-32 pb-16 sm:pb-20 md:pb-24 overflow-hidden"
    >
      <GridBackground color="#000" opacity={0.05} size={54} />

      <div
        ref={sectionRef}
        className="relative z-10 max-w-6xl mx-auto w-full flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-10 md:gap-16 lg:gap-20"
      >
        {/* Left Side: Hero Text Side (Gowtham structure) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col items-start max-w-2xl text-left w-full"
        >
          {/* Greeting in Newsreader / Instrument Serif italic */}
          <div className="h-[2.2rem] md:h-[2.6rem] overflow-hidden mb-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentGreetingIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="block text-2xl md:text-3xl lg:text-4xl text-zinc-700/90 font-serif-italic"
                style={{
                  fontFamily: "'Instrument Serif', 'Newsreader', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {greetings[currentGreetingIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Name heading with wave */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold tracking-[-0.03em] text-zinc-950 leading-[1.08] mb-4">
            I'm {name}.{" "}
            <span
              className="inline-block origin-[70%_70%] hover:animate-bounce cursor-pointer select-none"
              title="Hello!"
            >
              👋
            </span>
          </h1>

          {/* Role line with inline badges */}
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base md:text-lg text-zinc-800 font-medium mb-3">
            <span>{age} y/o</span>
            <span className="text-zinc-400">•</span>
            <span>{role}</span>
            <span className="text-zinc-400">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/70 text-xs font-medium text-zinc-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Vasavi College of Engg.
            </span>
          </div>

          {/* Bio summary paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl mb-8">
            Based in Hyderabad, building practical software to solve problems. Passionate about
            high-throughput backend systems, full-stack web experiences, and developer automation.
          </p>

          {/* Action Row: Inline Gowtham-style Typewriter Resume & Say Hi */}
          <TypewriterResume resumeUrl={resumeUrl} />
        </motion.div>

        {/* Right Side: Draggable Polaroid Photo (Centered on mobile, top-right on desktop) */}
        <div className="w-full md:w-auto flex justify-center items-center py-4 md:py-0 self-center md:self-start">
          <PolaroidCard src={profileImage} alt={name} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
