import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import GridBackground from "./GridBackground";
import heroData from "../data/hero.json";

const charContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const charVariant = {
  initial: {
    opacity: 0,
    y: 14,
    filter: "blur(8px)",
    letterSpacing: "0.08em",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    letterSpacing: "0em",
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

const calculateAge = (dob) => {
  const birth = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  return hasHadBirthdayThisYear ? age : age - 1;
};

const SplitText = ({ text, className, style, delay=0 , tag = "p" }) => {
  const MotionTag = motion[tag];
  const words = text.split(" ");

  return (
    <MotionTag
      className={className}
      style={{ ...style, display: "flex", flexWrap: "wrap", columnGap: "0.25em" }}
      variants={charContainer}
      initial="initial"
      animate="animate"
      transition={{ delayChildren: delay }}
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                variants={charVariant}
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </MotionTag>
  );
};

// ── Polaroid Animation Configuration (Manageable Timing Parameters) ──
const POLAROID_CONFIG = {
  delay: 0.2,       // Delay before animation begins on page load (in seconds)
  duration: 0.85,   // Total transition time for succession keyframe sequence (in seconds)
  rotateEnd: -3,    // Resting rotation angle (in degrees)
  initialScale: 0.8, // Starting scale at center (0.8 = starts at 80% size and expands smoothly)
};

const PolaroidPhoto = ({
  src,
  alt,
  delay = POLAROID_CONFIG.delay,
  duration = POLAROID_CONFIG.duration,
  rotateEnd = POLAROID_CONFIG.rotateEnd,
  initialScale = POLAROID_CONFIG.initialScale,
}) => {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <motion.div
      style={{ transformOrigin: "center center" }}
      initial={{
        opacity: 0,
        scale: initialScale,
        rotate: rotateEnd,
      }}
      animate={
        hasEntered
          ? {
              opacity: 1,
              scale: 1,
              rotate: rotateEnd,
            }
          : {
              opacity: [0, 1, 1, 1],
              scale: [initialScale, 1.05, 0.99, 1],
              rotate: rotateEnd,
            }
      }
      transition={
        hasEntered
          ? {
              duration: 0.35,
              ease: [0.33, 1, 0.68, 1],
            }
          : {
              duration: duration,
              delay: delay,
              times: [0, 0.6, 0.85, 1],
              ease: [0.22, 1, 0.36, 1],
            }
      }
      onAnimationComplete={() => setHasEntered(true)}
      whileHover={{
        rotate: 0,
        scale: 1.03,
        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
      }}
      className="relative shrink-0 w-56 md:w-72 cursor-pointer select-none origin-center"
    >
      <div className="bg-white p-3 pb-10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] rounded-[2px] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
        <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <p
          className="absolute bottom-2.5 left-0 right-0 text-center text-xs text-gray-400"
          style={{ fontFamily: "cursive" }}
        >
          me.jpeg
        </p>
      </div>
    </motion.div>
  );
};

const Hero = ({ id }) => {
  const { name, role, about, dob, profileImage, resumeUrl, greetings } = heroData;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const age = calculateAge(dob);
  const resolvedAbout = about
    .replace("{age}", age)
    .replace("{role}", role);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(intervalId);
  }, [greetings.length]);

  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id={id}
      className="relative overflow-hidden min-h-screen w-full bg-white flex flex-col justify-center px-8 md:px-20 lg:px-32"
    >
      <GridBackground color="#000" opacity={0.07} size={60} />

      <div
        ref={sectionRef}
        className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-20 max-w-6xl mx-auto w-full"
      >
        <PolaroidPhoto
          src={profileImage}
          alt={name}
          delay={POLAROID_CONFIG.delay}
          duration={POLAROID_CONFIG.duration}
          rotateEnd={POLAROID_CONFIG.rotateEnd}
          initialScale={POLAROID_CONFIG.initialScale}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col items-start min-w-0 w-full"
        >
          {/* Cycling greeting — untouched */}
          <div
            className="overflow-hidden mb-1 text-3xl md:text-4xl lg:text-5xl text-gray-800 h-[1.2em]"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            <div
              className="transition-transform duration-450 ease-in-out"
              style={{
                transform: `translateY(-${currentGreetingIndex * 1.2}em)`,
              }}
            >
              {greetings.map((greeting, i) => (
                <div
                  key={i}
                  className="h-[1.2em] leading-[1.2em] whitespace-nowrap"
                >
                  {greeting}
                </div>
              ))}
            </div>
          </div>

          {/* Name — char by char, no delay */}
          {loaded && (
            <SplitText
              text={`I'm ${name}.`}
              tag="h1"
              delay={0}
              className="text-4xl md:text-6xl lg:text-6xl font-semibold text-black leading-none tracking-tight mb-4"
            />
          )}

          {/* About — char by char, starts after name */}
          {loaded && (
            <SplitText
              text={resolvedAbout}
              tag="p"
              delay={0}
              className="text-base md:text-lg lg:text-2xl text-zinc-600 font-normal max-w-sm md:max-w-xl lg:max-w-2xl leading-relaxed mb-8 pt-2"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
