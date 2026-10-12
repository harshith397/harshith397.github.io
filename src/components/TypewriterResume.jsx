import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Volume2, VolumeX, FileText, Check } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Use same-origin static worker copied to /public/pdf.worker.min.mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Global in-memory cache for parsed PDF document
let cachedPdfPromise = null;

const getPdfDocument = (url) => {
  if (!cachedPdfPromise) {
    cachedPdfPromise = pdfjsLib.getDocument({
      url,
      disableRange: true,
      disableStream: true,
    }).promise;
  }
  return cachedPdfPromise;
};

// ── Authentic Mechanical Typewriter Audio Samples ─────────────────────────
const KEY_SOUND_URLS = [
  "/sounds/typewriter-key-1.mp3",
  "/sounds/typewriter-key-2.mp3",
  "/sounds/typewriter-key-3.mp3",
];
const SPACE_SOUND_URL = "/sounds/typewriter-space.mp3";
const BELL_SOUND_URL = "/sounds/typewriter-bell.mp3";

let audioCtx = null;
const audioBuffers = {
  keys: [],
  space: null,
  bell: null,
};
let isAudioPreloading = false;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const preloadAudioBuffers = async () => {
  if (isAudioPreloading) return;
  isAudioPreloading = true;
  const ctx = getAudioContext();
  if (!ctx) return;

  const loadBuffer = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return await ctx.decodeAudioData(arrayBuffer);
    } catch {
      return null;
    }
  };

  try {
    const [k1, k2, k3, sp, bell] = await Promise.all([
      loadBuffer(KEY_SOUND_URLS[0]),
      loadBuffer(KEY_SOUND_URLS[1]),
      loadBuffer(KEY_SOUND_URLS[2]),
      loadBuffer(SPACE_SOUND_URL),
      loadBuffer(BELL_SOUND_URL),
    ]);

    audioBuffers.keys = [k1, k2, k3].filter(Boolean);
    audioBuffers.space = sp;
    audioBuffers.bell = bell;
  } catch (err) {
    console.warn("Typewriter audio load warning:", err);
  }
};

const playKeystrokeSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (audioBuffers.keys.length > 0) {
      const buffer = audioBuffers.keys[Math.floor(Math.random() * audioBuffers.keys.length)];
      if (buffer) {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        // Subtle micro-pitch variation (0.94 - 1.06) for realistic analog hammer acoustics
        source.playbackRate.value = 0.94 + Math.random() * 0.12;
        gain.gain.value = 0.42;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        return;
      }
    }

    // High fidelity synthesis fallback if offline / audio loading
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(580 + (Math.random() * 200 - 100), ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.032);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.032);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.032);
  } catch {}
};

const playSpaceSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (audioBuffers.space) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBuffers.space;
      source.playbackRate.value = 0.98 + Math.random() * 0.04;
      gain.gain.value = 0.45;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      return;
    }

    playKeystrokeSound();
  } catch {}
};

const playCarriageBell = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (audioBuffers.bell) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBuffers.bell;
      gain.gain.value = 0.55;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      return;
    }

    // Vintage brass chime synthesis fallback
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1920, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.58);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.58);
  } catch {}
};

// ── Dedicated PDF Canvas Vector Renderer Component ────────────────────────
const PdfCanvasViewer = ({ resumeUrl }) => {
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [renderError, setRenderError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    let renderTask = null;

    const render = async () => {
      try {
        const pdf = await getPdfDocument(resumeUrl);
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");

        // High-DPI 2.0x scale for crisp, razor-sharp vector rendering
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;
        if (!isCancelled) {
          setRendered(true);
        }
      } catch (err) {
        console.error("PDF.js canvas rendering failed:", err);
        if (!isCancelled) setRenderError(err.message);
      }
    };

    render();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {}
      }
    };
  }, [resumeUrl]);

  return (
    <div className="relative w-full min-h-[350px] bg-white">
      <canvas
        ref={canvasRef}
        className={`w-full h-auto block select-none pointer-events-none transition-opacity duration-200 ${
          rendered ? "opacity-100" : "opacity-0"
        }`}
      />
      {!rendered && !renderError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white gap-2 text-zinc-400 font-mono text-xs">
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
          <span>Rendering PDF vectors...</span>
        </div>
      )}
      {renderError && (
        <div className="p-6 text-center text-xs text-red-500 font-mono">
          Unable to render PDF: {renderError}
        </div>
      )}
    </div>
  );
};

// ── Real-World Typewriter Keyboard Layout ────────────────────────────────
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const TypewriterResume = ({ resumeUrl = "/Resume.pdf" }) => {
  // States: "idle" | "typing" | "ready" | "closing"
  const [state, setState] = useState("idle");
  const [activeKey, setActiveKey] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [downloaded, setDownloaded] = useState(false);
  const [typingProgress, setTypingProgress] = useState(0);

  const containerRef = useRef(null);
  const paperScrollRef = useRef(null);

  const isActive = state !== "idle";
  const isTyping = state === "typing";
  const isReady = state === "ready";
  const isClosing = state === "closing";

  // Preload actual PDF document data and authentic audio samples on mount
  useEffect(() => {
    getPdfDocument(resumeUrl).catch(() => {});
    preloadAudioBuffers().catch(() => {});
  }, [resumeUrl]);

  // Keyboard shortcut: ESC to close typewriter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isActive) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  // Smoothly shift screen view to the typewriter's position upon opening
  useEffect(() => {
    if (isActive && containerRef.current) {
      const el = containerRef.current;
      const rect = el.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 75;

      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 0.6, force: true });
      } else {
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth",
        });
      }
    }
  }, [isActive]);

  // Enable responsive desktop mouse wheel scrolling (prevents Lenis smooth-scroll hijack)
  useEffect(() => {
    if (!isActive) return;
    const el = paperScrollRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };
    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isActive]);

  // Start Typing Sequence
  const handleStartTyping = () => {
    if (state !== "idle") return;
    preloadAudioBuffers().catch(() => {});
    setState("typing");
    setTypingProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4.2;
      setTypingProgress(Math.min(progress, 100));

      // Depress keycaps with authentic typewriter rhythm (occasional spacebar strike)
      const isSpace = Math.random() < 0.14;
      if (isSpace) {
        setActiveKey("SPACE");
        if (soundEnabled) {
          playSpaceSound();
        }
      } else {
        const randomRow = KEYBOARD_ROWS[Math.floor(Math.random() * KEYBOARD_ROWS.length)];
        const randomChar = randomRow[Math.floor(Math.random() * randomRow.length)];
        setActiveKey(randomChar);
        if (soundEnabled) {
          playKeystrokeSound();
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setActiveKey(null);
        if (soundEnabled) {
          playCarriageBell();
        }
        setTimeout(() => {
          setState("ready");
        }, 280);
      }
    }, 65); // High speed typing cadence (~15 cps)
  };

  // Close handler: retracts paper into roller then restores buttons
  const handleClose = () => {
    if (state === "idle" || isClosing) return;
    setState("closing");
    setTimeout(() => {
      setState("idle");
      setTypingProgress(0);
    }, 450);
  };

  // Download official PDF
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "Harshith-Medichelme-Resume.pdf";
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2400);
  };

  // Interactive user keypress
  const handleUserKeyPress = (char) => {
    setActiveKey(char);
    if (soundEnabled) {
      if (char === "SPACE") {
        playSpaceSound();
      } else {
        playKeystrokeSound();
      }
    }
    setTimeout(() => setActiveKey(null), 160);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* ── 1. IDLE STATE: Action Buttons Row (Gowtham Style) ── */}
      <AnimatePresence mode="wait">
        {!isActive && (
          <motion.div
            key="action-buttons-row"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Say Hi Button with yellow hover glow */}
            <a
              href="mailto:medichelmeharshith6@gmail.com?subject=Hi%20Harshith!"
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-[#ffd84d] text-zinc-900 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(210,160,0,0.24)]"
            >
              <span>Say hi</span>
              <span className="transition-transform group-hover:rotate-12 duration-200">👋</span>
            </a>

            {/* Resume Button (Only named Resume) */}
            <motion.button
              type="button"
              onClick={handleStartTyping}
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-zinc-200"
            >
              <FileText size={15} className="text-zinc-600 group-hover:text-black transition-colors" />
              <span>Resume</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. ACTIVE STATE: Authentic Real-World Typewriter Machine ── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="real-typewriter-apparatus"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: isClosing ? 0 : 1,
              y: isClosing ? 12 : 0,
              scale: isClosing ? 0.96 : 1,
            }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[400px] sm:max-w-[420px] flex flex-col items-center"
          >
            {/* 
              ─────────────────────────────────────────────────────────────────
              TOP CONTROL BAR (Balanced, sleek desktop & mobile scale)
              Clean, unified utility bar: Download + Volume + Close
              ─────────────────────────────────────────────────────────────────
            */}
            <div className="w-full flex items-center justify-between px-1 py-1 mb-2.5">
              <span className="font-mono text-xs text-zinc-500 font-medium tracking-wide uppercase">
                {isTyping ? "Typing..." : "Resume"}
              </span>

              {/* Refined utility buttons: Download, Volume, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-medium shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
                  title="Download official PDF"
                >
                  {downloaded ? <Check size={13} className="text-emerald-400" /> : <Download size={13} />}
                  <span>{downloaded ? "Saved" : "Download PDF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="p-1.5 sm:p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors"
                  title={soundEnabled ? "Mute audio" : "Enable audio"}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors"
                  title="Close typewriter (ESC)"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* 
              ─────────────────────────────────────────────────────────────────
              SECTION 1: BORDERLESS ACTUAL RESUME PDF (PURE VECTOR CANVAS)
              Directly renders the real PDF vector streams onto an HTML5 canvas!
              Zero static image fallback — pure PDF.js vector rendering.
              ─────────────────────────────────────────────────────────────────
            */}
            <div className="relative w-full h-[350px] flex justify-center items-end overflow-hidden mb-[-4px] z-10">
              <motion.div
                data-lenis-prevent="true"
                className="relative w-[92%] sm:w-[94%] bg-white rounded-t-sm shadow-[0_12px_36px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.04)] border border-zinc-200/90 overflow-hidden"
                initial={{ y: 360, opacity: 0.8 }}
                animate={{
                  y: isTyping ? 350 * (1 - typingProgress / 100) : isReady ? 0 : 360,
                  opacity: 1,
                }}
                transition={{
                  duration: isTyping ? 0.08 : 0.42,
                  ease: "easeOut",
                }}
              >
                {/* Scrollable Document Container (Desktop Mouse Wheel & Touch Enabled) */}
                <div
                  ref={paperScrollRef}
                  data-lenis-prevent="true"
                  className="relative w-full h-[350px] overflow-y-auto overflow-x-hidden bg-white scrollbar-thin scrollbar-thumb-zinc-300 overscroll-contain"
                  style={{ overscrollBehavior: "contain" }}
                >
                  {/* Actual Vector Rendered PDF Page */}
                  <PdfCanvasViewer resumeUrl={resumeUrl} />

                  {/* Real Typewriter Alignment & Typing Guide */}
                  {isTyping && (
                    <motion.div
                      className="absolute left-0 right-0 pointer-events-none z-20 flex items-center"
                      style={{
                        top: `${Math.min(94, typingProgress)}%`,
                      }}
                    >
                      {/* Precise horizontal typewriter ribbon line */}
                      <div className="w-full h-[1.5px] bg-red-500/70 shadow-[0_0_4px_rgba(239,68,68,0.4)]" />

                      {/* Moving Type Guide Notch (tracks across the line) */}
                      <motion.div
                        animate={{ x: ["8%", "84%", "18%", "72%", "35%"] }}
                        transition={{ repeat: Infinity, duration: 0.34, ease: "linear" }}
                        className="absolute top-[-5px] flex items-center justify-center w-3 h-3.5 bg-zinc-900 border border-zinc-700 rounded-sm shadow-sm"
                      >
                        <span className="text-[7px] text-amber-300 font-mono leading-none">▼</span>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* 
              ─────────────────────────────────────────────────────────────────
              SECTION 2: REAL-WORLD TYPEWRITER CHASSIS & CARRIAGE
              Authentic physical anatomy:
              • Circular Ribbed Platen Knobs on the ends
              • Curved Chrome Carriage Return Lever on the left
              • Dark Rubber Platen Roller
              • Polished Chrome Paper Bail Bar
              • Character Column Margin Ruler: 10·20·30·40·50·60·70·80
              • V-Shaped Central Type Guide & Twin-Color Ribbon Vibrator
              • Pure Typewriter Keyboard (no external non-typewriter buttons)
              ─────────────────────────────────────────────────────────────────
            */}
            <div className="relative w-full z-20 bg-gradient-to-b from-[#ffffff] via-[#f7f8fa] to-[#eceef2] rounded-2xl border border-zinc-200 shadow-[0_16px_36px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] p-3 sm:p-3.5 flex flex-col items-center select-none">
              
              {/* Carriage Assembly: Knobs + Roller + Return Lever */}
              <div className="w-full relative flex items-center justify-between mb-2 px-0.5">
                
                {/* ── LEFT CARRIAGE END: Knob & Return Lever ── */}
                <div className="flex items-center gap-1">
                  {/* Authentic Curved Chrome Carriage Return Lever */}
                  <motion.div
                    animate={isTyping ? { rotate: [-14, 2, -14] } : { rotate: -14 }}
                    transition={{ repeat: Infinity, duration: 0.75 }}
                    whileTap={{ rotate: 4 }}
                    className="relative origin-bottom-right cursor-pointer"
                    title="Carriage Return Lever (Click to ring bell)"
                    onClick={() => {
                      if (soundEnabled) playCarriageBell();
                    }}
                  >
                    <div className="w-2 h-7 bg-gradient-to-t from-zinc-400 via-zinc-100 to-zinc-300 rounded-t-full shadow-sm border border-zinc-400 hover:border-zinc-500" />
                    <div className="absolute top-0 -left-1 w-3 h-2 bg-gradient-to-r from-zinc-300 to-zinc-100 rounded-sm shadow-sm border border-zinc-400" />
                  </motion.div>

                  {/* Left Platen Turn Knob (Authentic circular ribbed dial) */}
                  <div
                    className="w-4 h-8 rounded-md bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 border border-zinc-500 shadow-sm flex flex-col justify-around py-0.5 px-0.5"
                    title="Platen Knob"
                  >
                    <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                  </div>
                </div>

                {/* ── CENTER: Platen Roller Cylinder & Paper Feed Slot ── */}
                <div className="flex-1 mx-2 relative flex flex-col">
                  {/* Paper shelf lip behind roller */}
                  <div className="w-full h-1 bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-300 rounded-t-sm border-t border-zinc-300" />

                  {/* Platen Rubber Roller Bar */}
                  <div className="w-full h-5 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black rounded-sm border-t border-b border-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] flex items-center justify-between px-3 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#fff_8px,#fff_9px)]" />

                    {/* Polished Chrome Paper Bail Bar */}
                    <div className="w-full h-1 bg-gradient-to-r from-zinc-300 via-white to-zinc-300 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-10 flex items-center justify-around">
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full border border-zinc-400" />
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full border border-zinc-400" />
                    </div>
                  </div>

                  {/* Character Column Margin Ruler Bar */}
                  <div className="w-full bg-zinc-200/90 border-t border-b border-zinc-300 flex items-center justify-between px-2 py-0.5 text-[7px] font-mono text-zinc-500 tracking-tighter">
                    <span>10</span>
                    <span>·</span>
                    <span>20</span>
                    <span>·</span>
                    <span>30</span>
                    <span>·</span>
                    <span>40</span>
                    <span>·</span>
                    <span>50</span>
                    <span>·</span>
                    <span>60</span>
                    <span>·</span>
                    <span>70</span>
                    <span>·</span>
                    <span>80</span>
                  </div>
                </div>

                {/* ── RIGHT CARRIAGE END: Right Platen Knob ── */}
                <div
                  className="w-4 h-8 rounded-md bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 border border-zinc-500 shadow-sm flex flex-col justify-around py-0.5 px-0.5"
                  title="Platen Knob"
                >
                  <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                  <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                  <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                  <div className="w-full h-0.5 bg-zinc-600/40 rounded-full" />
                </div>
              </div>

              {/* 
                ── Center Typebar Guide & Two-Tone Ribbon Vibrator ──
              */}
              <div className="w-full flex items-center justify-between px-3 py-1 bg-white/70 rounded-md border border-zinc-200/80 mb-2">
                {/* Left Ribbon Spool Cup */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-300 border border-zinc-400 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase">Ribbon</span>
                </div>

                {/* Central V-Guide & Typebar Hammer Strike */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isTyping ? { y: [0, -3, 0] } : { y: 0 }}
                    transition={{ repeat: Infinity, duration: 0.12 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-3 h-2.5 bg-zinc-300 border-t-2 border-l border-r border-zinc-500 rounded-t-sm flex items-center justify-center shadow-xs">
                      <span className="text-[6px] font-bold text-zinc-800 font-mono">V</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right Ribbon Spool Cup */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase">Standard</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-300 border border-zinc-400 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </div>
                </div>
              </div>

              {/* 
                ── SECTION 3: REAL-WORLD TYPEWRITER KEYBOARD ──
                Classic circular keycaps with silver/chrome rims
              */}
              <div className="w-full bg-[#f1f2f5] p-1.5 sm:p-2.5 rounded-xl border border-zinc-200/90 shadow-inner flex flex-col items-center gap-1 sm:gap-1.5 overflow-hidden">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <div
                    key={`keyboard-row-${rowIndex}`}
                    className="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 w-full"
                  >
                    {row.map((char) => {
                      const isDepressed = activeKey === char;
                      return (
                        <motion.button
                          key={char}
                          type="button"
                          onClick={() => handleUserKeyPress(char)}
                          animate={
                            isDepressed
                              ? { y: 2, scale: 0.94 }
                              : { y: 0, scale: 1 }
                          }
                          transition={{ duration: 0.08 }}
                          className={`relative rounded-full w-[25px] h-[25px] xs:w-7 xs:h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center font-mono font-medium text-[9px] xs:text-[10px] sm:text-xs transition-colors ${
                            isDepressed
                              ? "bg-amber-100 text-zinc-950 border-amber-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]"
                              : "bg-white text-zinc-700 border border-zinc-300 shadow-[0_2px_0_#d4d4d8,0_2px_4px_rgba(0,0,0,0.06)] hover:border-zinc-400 hover:text-black"
                          }`}
                        >
                          <span>{char}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {/* Authentic Typewriter Spacebar Bar (No other buttons on the board) */}
                <div className="flex items-center justify-center w-full pt-1 pb-0.5">
                  <button
                    type="button"
                    onClick={() => handleUserKeyPress("SPACE")}
                    className="w-full max-w-[220px] sm:max-w-[250px] h-6 sm:h-7 rounded-full bg-white border border-zinc-300 text-zinc-400 text-[10px] font-mono tracking-widest shadow-[0_2px_0_#d4d4d8] hover:border-zinc-400 active:translate-y-0.5 transition-all"
                  >
                    SPACE
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TypewriterResume;
