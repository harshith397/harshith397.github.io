import React, { useState, useEffect } from "react";

const MAILTO =
  "mailto:medichelmeharshith6@gmail.com?subject=Hey%20Harshith!&body=Hi%20Harshith%2C%20I%20came%20across%20your%20portfolio%20and...";

// ── Continuous Stop-Motion Frame Shots (Same Subject, Rapid Changing Shell) ──
const FRAMES = [
  {
    id: "brutalist",
    text: "CONNECT_NOW",
    style: {
      backgroundColor: "#FFE600",
      color: "#000000",
      border: "2.5px solid #000000",
      borderRadius: "0px",
      boxShadow: "4px 4px 0px #000000",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 900,
      fontSize: "14px",
      letterSpacing: "2px",
      textTransform: "uppercase",
      padding: "14px 34px",
    },
  },
  {
    id: "glass",
    text: "Connect Now",
    style: {
      backgroundColor: "rgba(255, 255, 255, 0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      color: "#18181b",
      border: "1px solid rgba(0, 0, 0, 0.14)",
      borderRadius: "9999px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: "14px",
      letterSpacing: "0.3px",
      padding: "14px 36px",
    },
  },
  {
    id: "neon",
    text: "CONTACT.EXE",
    style: {
      backgroundColor: "#13091f",
      color: "#00FFFF",
      border: "2px solid #FF007F",
      borderRadius: "6px",
      boxShadow: "0 0 18px rgba(255, 0, 127, 0.45), inset 0 0 8px rgba(0, 255, 255, 0.15)",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 800,
      fontSize: "13px",
      letterSpacing: "2.5px",
      textShadow: "0 0 6px #00FFFF",
      padding: "14px 32px",
    },
  },
  {
    id: "terminal",
    text: "$ connect_now",
    style: {
      backgroundColor: "#0d0d0d",
      color: "#00FF66",
      border: "1.5px solid #00FF66",
      borderRadius: "4px",
      boxShadow: "0 0 12px rgba(0, 255, 102, 0.25)",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontWeight: 700,
      fontSize: "13px",
      letterSpacing: "1px",
      padding: "14px 32px",
    },
  },
];

const CyclingButton = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Rapid stop-motion loop: snaps smoothly frame-by-frame without disappearing
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FRAMES.length);
    }, 280); // ~3.5 fps stop-motion cadence

    return () => clearInterval(interval);
  }, [isHovered]);

  const activeFrame = FRAMES[frameIndex];

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: "280px",
        height: "64px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      <a
        href={MAILTO}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className="flex items-center justify-center outline-none select-none transition-transform duration-100"
        style={{
          transform: isPressed
            ? "scale(0.96) translate3d(0, 2px, 0)"
            : isHovered
            ? "scale(1.03)"
            : "scale(1)",
        }}
      >
        <div
          key={activeFrame.id}
          className="flex items-center justify-center cursor-pointer whitespace-nowrap"
          style={{
            ...activeFrame.style,
            willChange: "transform, background-color, box-shadow",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {activeFrame.text}
        </div>
      </a>
    </div>
  );
};

export default CyclingButton;
