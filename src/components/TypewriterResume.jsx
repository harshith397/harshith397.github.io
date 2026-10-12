import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Volume2, VolumeX, FileText, Check } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Use same-origin static worker copied to /public/pdf.worker.min.mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Global in-memory cache for parsed PDF document and pre-rendered vector canvas
let cachedPdfPromise = null;
let cachedRenderedCanvas = null;
let cachedRenderPromise = null;

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

// Background pre-renderer: rasterizes page 1 vectors offscreen ahead of time
const preloadPdfPage = (url = "/Resume.pdf") => {
  if (cachedRenderPromise) return cachedRenderPromise;
  if (typeof document === "undefined") return Promise.resolve(null);

  cachedRenderPromise = (async () => {
    try {
      const pdf = await getPdfDocument(url);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 });
      const offscreen = document.createElement("canvas");
      offscreen.width = viewport.width;
      offscreen.height = viewport.height;
      const ctx = offscreen.getContext("2d");
      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
      });
      await renderTask.promise;
      cachedRenderedCanvas = offscreen;
      return offscreen;
    } catch (err) {
      console.warn("Pre-render PDF vector warning:", err);
      return null;
    }
  })();

  return cachedRenderPromise;
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
let isAudioPreloaded = false;
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

// Preload and decode all authentic MP3 sounds immediately into memory the second site loads
const preloadAudioBuffers = async () => {
  if (isAudioPreloaded || isAudioPreloading || typeof window === "undefined") return;
  isAudioPreloading = true;
  const ctx = getAudioContext();
  if (!ctx) {
    isAudioPreloading = false;
    return;
  }

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
    isAudioPreloaded = true;
    isAudioPreloading = false;
  } catch (err) {
    isAudioPreloading = false;
    console.warn("Typewriter audio load warning:", err);
  }
};

// Immediate preloader executed the second the site loads in browser
if (typeof window !== "undefined") {
  const triggerEarlyPreload = () => {
    preloadAudioBuffers().catch(() => {});
    preloadPdfPage().catch(() => {});
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    triggerEarlyPreload();
  } else {
    window.addEventListener("DOMContentLoaded", triggerEarlyPreload, { once: true });
    window.addEventListener("load", triggerEarlyPreload, { once: true });
  }

  // Also unlock audio context and preload on very first user gesture anywhere on page
  const userGestureInit = () => {
    triggerEarlyPreload();
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener("pointerdown", userGestureInit, { once: true, passive: true });
  window.addEventListener("keydown", userGestureInit, { once: true, passive: true });
}

let activeKeyGain = null;
let activeSpaceGain = null;

const playKeystrokeSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Smoothly dampen previous keystroke over 15ms so rapid samples never pile up or distort
    if (activeKeyGain) {
      try {
        activeKeyGain.gain.cancelScheduledValues(now);
        activeKeyGain.gain.setValueAtTime(activeKeyGain.gain.value, now);
        activeKeyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      } catch {}
    }

    if (audioBuffers.keys.length > 0) {
      const buffer = audioBuffers.keys[Math.floor(Math.random() * audioBuffers.keys.length)];
      if (buffer) {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        // Organic pitch variation across keys (0.92 - 1.08)
        source.playbackRate.value = 0.92 + Math.random() * 0.16;
        gain.gain.setValueAtTime(0.48, now);
        // Play sample crisply and bound tail to 85ms for rapid-fire rhythmic clicks
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(now);
        source.stop(now + 0.095);
        activeKeyGain = gain;
        return;
      }
    }
  } catch {}
};

const playSpaceSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (activeSpaceGain) {
      try {
        activeSpaceGain.gain.cancelScheduledValues(now);
        activeSpaceGain.gain.setValueAtTime(activeSpaceGain.gain.value, now);
        activeSpaceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      } catch {}
    }

    if (audioBuffers.space) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBuffers.space;
      source.playbackRate.value = 0.97 + Math.random() * 0.06;
      gain.gain.setValueAtTime(0.48, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + 0.12);
      activeSpaceGain = gain;
      return;
    }

    playKeystrokeSound();
  } catch {}
};

const playCarriageBell = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (audioBuffers.bell) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = audioBuffers.bell;
      gain.gain.setValueAtTime(0.55, now);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      return;
    }
  } catch {}
};

// ── Dedicated PDF Canvas Vector Renderer Component ────────────────────────
const PdfCanvasViewer = ({ resumeUrl }) => {
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(() => Boolean(cachedRenderedCanvas));
  const [renderError, setRenderError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    let renderTask = null;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Instant path: if pre-rendered offscreen in memory, draw immediately (< 1ms!)
    if (cachedRenderedCanvas) {
      canvas.width = cachedRenderedCanvas.width;
      canvas.height = cachedRenderedCanvas.height;
      const context = canvas.getContext("2d");
      context.drawImage(cachedRenderedCanvas, 0, 0);
      setRendered(true);
      return;
    }

    const render = async () => {
      try {
        const offscreen = await preloadPdfPage(resumeUrl);
        if (isCancelled || !canvas) return;

        if (offscreen) {
          canvas.width = offscreen.width;
          canvas.height = offscreen.height;
          const context = canvas.getContext("2d");
          context.drawImage(offscreen, 0, 0);
          setRendered(true);
        } else {
          const pdf = await getPdfDocument(resumeUrl);
          if (isCancelled || !canvas) return;

          const page = await pdf.getPage(1);
          if (isCancelled || !canvas) return;

          const viewport = page.getViewport({ scale: 2.0 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const context = canvas.getContext("2d");
          renderTask = page.render({
            canvasContext: context,
            viewport: viewport,
          });

          await renderTask.promise;
          if (!isCancelled) {
            setRendered(true);
          }
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

// ── Authentic Rover 5000 Vintage Typewriter Keyboard Layout ───────────────
const KEYBOARD_ROWS = [
  ["2", "3", "4", "5", "6", "7", "8", "9", "0", "TAB"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "↵"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
];

const TypewriterResume = ({ resumeUrl = "/Resume.pdf" }) => {
  // States: "idle" | "typing" | "ready" | "closing"
  const [state, setState] = useState("idle");
  const [activeKey, setActiveKey] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [downloaded, setDownloaded] = useState(false);
  const [typingProgress, setTypingProgress] = useState(0);
  const [paperScrollTop, setPaperScrollTop] = useState(0);

  const containerRef = useRef(null);
  const paperScrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isActive = state !== "idle";
  const isTyping = state === "typing";
  const isReady = state === "ready";
  const isClosing = state === "closing";

  // Preload actual PDF document data and authentic audio samples on mount
  useEffect(() => {
    getPdfDocument(resumeUrl).catch(() => {});
    preloadAudioBuffers().catch(() => {});
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
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
      if (el.scrollHeight > el.clientHeight) {
        const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;
        if (!isAtTop && !isAtBottom) {
          e.preventDefault();
        }
        el.scrollTop += e.deltaY;
        setPaperScrollTop(el.scrollTop);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isActive]);

  // Start Typing Sequence with authentic human typist rhythm at high typing speed
  const handleStartTyping = () => {
    if (state !== "idle") return;
    preloadAudioBuffers().catch(() => {});
    preloadPdfPage(resumeUrl).catch(() => {});
    setState("typing");
    setTypingProgress(0);
    setPaperScrollTop(0);
    if (paperScrollRef.current) {
      paperScrollRef.current.scrollTop = 0;
    }

    let progress = 0;

    const stepTyping = () => {
      // Rapid typing speed: advance 2.0% per stroke (~50 rapid-fire strokes)
      progress += 2.0;
      const currentProgress = Math.min(progress, 100);
      setTypingProgress(currentProgress);

      // Depress keycaps with authentic typewriter rhythm (occasional spacebar strike)
      const isSpace = Math.random() < 0.16;
      if (isSpace) {
        setActiveKey("SPACE");
        if (soundEnabled) {
          playSpaceSound();
        }
      } else {
        const randomRow =
          KEYBOARD_ROWS[Math.floor(Math.random() * KEYBOARD_ROWS.length)];
        const randomChar =
          randomRow[Math.floor(Math.random() * randomRow.length)];
        setActiveKey(randomChar);
        if (soundEnabled) {
          playKeystrokeSound();
        }
      }

      if (currentProgress >= 100) {
        setActiveKey(null);
        if (soundEnabled) {
          playCarriageBell();
        }
        setTimeout(() => {
          setState("ready");
        }, 160);
        return;
      }

      // Fast, high-speed typewriter cadence: ~32-44ms for letters, ~65-75ms for spacebar
      const delay = isSpace ? 65 + Math.random() * 12 : 32 + Math.random() * 12;
      typingTimeoutRef.current = setTimeout(stepTyping, delay);
    };

    typingTimeoutRef.current = setTimeout(stepTyping, 25);
  };

  // Close handler: retracts paper into roller then restores buttons
  const handleClose = () => {
    if (state === "idle" || isClosing) return;
    if (soundEnabled) playKeystrokeSound();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setActiveKey(null);
    setState("closing");
    setTimeout(() => {
      setState("idle");
      setTypingProgress(0);
      setPaperScrollTop(0);
    }, 450);
  };

  // Download official PDF with tactile carriage sound
  const handleDownload = () => {
    if (soundEnabled) playCarriageBell();
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "Harshith-Medichelme-Resume.pdf";
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2400);
  };

  // Sound toggle button with audio feedback
  const handleToggleSound = () => {
    playKeystrokeSound();
    setSoundEnabled((prev) => !prev);
  };

  // Dynamic paper scroll tracker for top paper curl/fold effect
  const handlePaperScroll = (e) => {
    setPaperScrollTop(e.currentTarget.scrollTop);
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
            className="w-full max-w-[420px] sm:max-w-[460px] flex flex-col items-center"
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
                  onClick={handleToggleSound}
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
              SECTION 1: BACKGROUNDLESS VECTOR RESUME PDF WITH 3D TOP FOLD ROLL
              Backgroundless paper emerges from the roller. When scrolled down,
              the paper folds and rolls over at the top into a realistic cylinder!
              ─────────────────────────────────────────────────────────────────
            */}
            <div className="relative w-full h-[350px] flex justify-center items-end overflow-hidden mb-[-6px] z-10">
              <motion.div
                data-lenis-prevent="true"
                className="relative w-[90%] sm:w-[92%] bg-white rounded-t-sm shadow-[0_16px_40px_rgba(0,0,0,0.14),0_1px_3px_rgba(0,0,0,0.06)] border border-zinc-200/90 overflow-hidden z-10"
                initial={{ y: 360, opacity: 0.8 }}
                animate={{
                  y: isTyping ? 350 * (1 - typingProgress / 100) : isReady ? 0 : 360,
                  opacity: 1,
                }}
                transition={{
                  duration: isTyping ? 0.035 : 0.28,
                  ease: "easeOut",
                }}
              >
                {/* ── TOP REALISTIC 3D PAPER ROLL & FOLD (Activates when scrolled) ── */}
                <AnimatePresence>
                  {paperScrollTop > 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center"
                    >
                      {/* Photorealistic 3D Curled Paper Fold & Roll */}
                      <div className="relative w-full h-[26px] sm:h-[30px] bg-gradient-to-b from-[#ded9ce] via-[#ffffff] to-[#ece7dc] border-b border-[#c4bcab] shadow-[0_12px_24px_rgba(0,0,0,0.26)] overflow-hidden">
                        {/* Crisp Apex Crease Specular Light Line */}
                        <div className="absolute inset-x-0 top-[2px] h-[1.5px] bg-white opacity-95 shadow-[0_0_2px_rgba(255,255,255,0.8)]" />

                        {/* Subtle Paper Grain Overlay */}
                        <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_3px)]" />

                        {/* Cylindrical underside ambient shadow */}
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black/20 to-transparent" />

                        {/* Left Curled Paper Profile Loop */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 via-black/5 to-transparent border-r border-black/5" />

                        {/* Right Curled Paper Profile Loop */}
                        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-black/20 via-black/5 to-transparent border-l border-black/5" />
                      </div>

                      {/* Natural Progressive Cast Shadow onto the Document Below */}
                      <div className="w-full h-6 bg-gradient-to-b from-black/25 via-black/10 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scrollable Document Container (Sidebar Removed, Wheel & Touch Smooth) */}
                <div
                  ref={paperScrollRef}
                  data-lenis-prevent="true"
                  onScroll={handlePaperScroll}
                  className="relative w-full h-[350px] overflow-y-auto overflow-x-hidden bg-white overscroll-contain select-text [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  style={{
                    overscrollBehavior: "contain",
                    touchAction: "pan-y",
                    WebkitOverflowScrolling: "touch",
                  }}
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
                        transition={{ repeat: Infinity, duration: 0.16, ease: "linear" }}
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
              SECTION 2: ROVER 5000 DE LUXE RETRO CHASSIS & CARRIAGE
              Sculpted Cream Body, Radial Typebar Fan, Rover 5000 Badge,
              Black Carriage, and Stepped Keyboard with Red TAB Key!
              ─────────────────────────────────────────────────────────────────
            */}
            <div className="relative w-full z-20 bg-gradient-to-b from-[#f8f5ee] via-[#f1ebe0] to-[#e4ded0] rounded-3xl border border-[#d8d1c0] shadow-[0_22px_55px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.08),inset_0_2px_2px_rgba(255,255,255,0.9)] p-3 sm:p-4 flex flex-col items-center select-none">
              
              {/* Carriage Assembly: Knobs + Roller + Return Lever */}
              <div className="w-full relative flex items-center justify-between mb-2 px-0.5">
                
                {/* ── LEFT CARRIAGE END: Knob & Return Lever ── */}
                <div className="flex items-center gap-1.5">
                  {/* Authentic Curved Chrome Carriage Return Lever */}
                  <motion.div
                    animate={isTyping ? { rotate: [-16, 2, -16] } : { rotate: -16 }}
                    transition={{ repeat: Infinity, duration: 0.65 }}
                    whileTap={{ rotate: 6 }}
                    className="relative origin-bottom-right cursor-pointer"
                    title="Carriage Return Lever (Click to ring bell)"
                    onClick={() => {
                      if (soundEnabled) playCarriageBell();
                    }}
                  >
                    <div className="w-2.5 h-8 bg-gradient-to-t from-zinc-400 via-zinc-100 to-white rounded-t-full shadow-sm border border-zinc-400 hover:border-zinc-500" />
                    <div className="absolute top-0 -left-1.5 w-4 h-2.5 bg-gradient-to-r from-zinc-300 via-white to-zinc-200 rounded-sm shadow-sm border border-zinc-400" />
                  </motion.div>

                  {/* Left Platen Turn Knob (Authentic black ribbed dial) */}
                  <div
                    className="w-4 h-8 rounded-md bg-gradient-to-r from-[#2a2b2f] via-[#1a1b1e] to-[#2a2b2f] border border-zinc-700 shadow-sm flex flex-col justify-around py-0.5 px-0.5"
                    title="Platen Knob"
                  >
                    <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                  </div>
                </div>

                {/* ── CENTER: Platen Roller Cylinder & Paper Feed Slot ── */}
                <div className="flex-1 mx-2 relative flex flex-col">
                  {/* Paper shelf lip behind roller */}
                  <div className="w-full h-1 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-t-sm border-t border-zinc-400" />

                  {/* Platen Rubber Roller Bar */}
                  <div className="w-full h-5 bg-gradient-to-b from-[#1a1b1e] via-[#0e0f11] to-[#18191c] rounded-sm border-t border-b border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-between px-3 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#fff_8px,#fff_9px)]" />

                    {/* Polished Chrome Paper Bail Bar */}
                    <div className="w-full h-1 bg-gradient-to-r from-zinc-400 via-white to-zinc-400 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-10 flex items-center justify-around">
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full border border-zinc-400" />
                      <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full border border-zinc-400" />
                    </div>
                  </div>

                  {/* Character Column Margin Ruler Bar */}
                  <div className="w-full bg-[#18191d] border-t border-b border-zinc-800 flex items-center justify-between px-2 py-0.5 text-[7px] font-mono text-zinc-400 tracking-tighter">
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
                  className="w-4 h-8 rounded-md bg-gradient-to-r from-[#2a2b2f] via-[#1a1b1e] to-[#2a2b2f] border border-zinc-700 shadow-sm flex flex-col justify-around py-0.5 px-0.5"
                  title="Platen Knob"
                >
                  <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                  <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                  <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                  <div className="w-full h-0.5 bg-zinc-500/40 rounded-full" />
                </div>
              </div>

              {/* 
                ── Semicircular Type Basket & Radial Typebar Fan ──
                The iconic Rover 5000 fan of mechanical hammer strikers
              */}
              <div className="w-full flex flex-col items-center mb-2">
                <div className="relative w-[240px] sm:w-[270px] h-[48px] sm:h-[54px] bg-[#18191c] rounded-t-full border border-zinc-700/80 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] overflow-hidden flex justify-center items-end">
                  {/* Metallic radiating typebars */}
                  <svg className="w-full h-full" viewBox="0 0 240 54" preserveAspectRatio="none">
                    {Array.from({ length: 29 }).map((_, i) => {
                      const angle = (12 + (i * (168 - 12)) / 28) * (Math.PI / 180);
                      const x1 = 120 + 115 * Math.cos(angle);
                      const y1 = 54 - 50 * Math.sin(angle);
                      const x2 = 120 + 26 * Math.cos(angle);
                      const y2 = 54 - 14 * Math.sin(angle);
                      return (
                        <line
                          key={`typebar-${i}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={i % 2 === 0 ? "#71717a" : "#a1a1aa"}
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {/* Chrome anvil strike plate & screws */}
                    <path
                      d="M 98 54 Q 120 28 142 54 Z"
                      fill="url(#roverChromeAnvil)"
                      stroke="#52525b"
                      strokeWidth="1"
                    />
                    <circle cx="106" cy="46" r="1.5" fill="#27272a" />
                    <circle cx="134" cy="46" r="1.5" fill="#27272a" />
                    <defs>
                      <linearGradient id="roverChromeAnvil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f4f4f5" />
                        <stop offset="50%" stopColor="#d4d4d8" />
                        <stop offset="100%" stopColor="#71717a" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Active Type Hammer Strike */}
                  <motion.div
                    animate={isTyping ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={{ repeat: Infinity, duration: 0.12 }}
                    className="absolute bottom-0 w-3 h-3 bg-gradient-to-t from-zinc-500 via-zinc-200 to-white rounded-t-sm border border-zinc-600 shadow-sm flex items-center justify-center z-10"
                  >
                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                  </motion.div>
                </div>
              </div>

              {/* 
                ── ROVER 5000 de luxe Nameplate Badge Strip ──
              */}
              <div className="w-full bg-[#141416] rounded-sm py-1.5 px-3 border border-[#27272a] shadow-inner flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#f97316] text-xs">✤</span>
                  <span className="font-mono font-black text-xs sm:text-[13px] tracking-widest text-[#f97316]">
                    ROVER 5000
                  </span>
                </div>
                <span className="font-serif italic text-white/90 text-xs sm:text-[13px] tracking-wide">
                  de luxe
                </span>
              </div>

              {/* 
                ── SECTION 3: ROVER 5000 RETRO STEPPED KEYBOARD ──
                Authentic vintage dark charcoal keycaps with the signature red TAB key
              */}
              <div className="w-full bg-[#121316] p-1.5 sm:p-2.5 rounded-xl border border-zinc-800 shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)] flex flex-col items-center gap-1 sm:gap-1.5 overflow-hidden">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <div
                    key={`keyboard-row-${rowIndex}`}
                    className="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 w-full"
                  >
                    {row.map((char) => {
                      const isDepressed = activeKey === char;
                      const isRedTab = char === "TAB";
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
                          className={`relative rounded-md ${
                            isRedTab
                              ? "px-1.5 sm:px-2 min-w-[28px]"
                              : "w-[26px] h-[26px] xs:w-7 xs:h-7 sm:w-8 sm:h-8"
                          } shrink-0 flex items-center justify-center font-mono font-bold text-[9px] xs:text-[10px] sm:text-xs transition-colors ${
                            isRedTab
                              ? isDepressed
                                ? "bg-red-700 text-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
                                : "bg-[#dc2626] text-white border-t border-red-400 border-b border-red-950 shadow-[0_2.5px_0_#991b1b,0_3px_5px_rgba(0,0,0,0.4)] hover:bg-[#ef4444]"
                              : isDepressed
                              ? "bg-[#3f3f46] text-amber-300 border-amber-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
                              : "bg-[#232429] text-zinc-100 border-t border-zinc-600/40 border-b border-black shadow-[0_2.5px_0_#0f1013,0_3px_5px_rgba(0,0,0,0.4)] hover:bg-[#2c2d33] hover:text-white"
                          }`}
                        >
                          <span>{char}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {/* Rover 5000 Wide Spacebar Bar */}
                <div className="flex items-center justify-center w-full pt-1 pb-0.5">
                  <button
                    type="button"
                    onClick={() => handleUserKeyPress("SPACE")}
                    className="w-full max-w-[220px] sm:max-w-[260px] h-6 sm:h-7 rounded-md bg-[#232429] border-t border-zinc-600/40 border-b border-black text-zinc-400 text-[9px] font-mono tracking-widest shadow-[0_2.5px_0_#0f1013,0_3px_5px_rgba(0,0,0,0.4)] hover:bg-[#2c2d33] hover:text-zinc-200 active:translate-y-0.5 transition-all"
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
