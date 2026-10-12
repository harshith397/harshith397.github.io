import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const sectionIds = ["Me", "About", "Skills", "Work", "Connect"];

// Formats section id into readable label
const formatLabel = (id) => (id === "Me" ? "Home" : id.replace(/([A-Z])/g, " $1").trim());

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Me");

  const { scrollY } = useScroll();

  // ── Fluid Scroll Dynamics Matching Gowtham Oleti's Site Physics ────────
  // Gowtham only condenses the horizontal gap & width while preserving height & legibility:
  // • top: 1.5rem (24px) -> 1rem (16px)
  // • horizontal nav padding: 1.5rem (24px) -> 1rem (16px)
  // • gap between nav items: relaxed (14px) -> compact (4px)
  // • NO aggressive downscaling, NO shrinking font sizes!
  const rawTop = useTransform(scrollY, [0, 100], [24, 16]);
  const rawNavPaddingX = useTransform(scrollY, [0, 100], [20, 12]);
  const rawNavPaddingY = useTransform(scrollY, [0, 100], [10, 8]);
  const rawItemGap = useTransform(scrollY, [0, 100], [10, 4]);
  const rawItemPaddingX = useTransform(scrollY, [0, 100], [18, 14]);

  const springTop = useSpring(rawTop, { stiffness: 150, damping: 30, mass: 0.5 });
  const springNavPaddingX = useSpring(rawNavPaddingX, { stiffness: 150, damping: 30, mass: 0.5 });
  const springNavPaddingY = useSpring(rawNavPaddingY, { stiffness: 150, damping: 30, mass: 0.5 });
  const springItemGap = useSpring(rawItemGap, { stiffness: 150, damping: 30, mass: 0.5 });
  const springItemPaddingX = useSpring(rawItemPaddingX, { stiffness: 150, damping: 30, mass: 0.5 });

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      setIsScrolled(v > 50);
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (id) => {
    scrollToId(id);
    setActiveSection(id);
    setIsOpen(false);
  };

  return (
    <motion.header
      style={{ top: springTop }}
      className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      {/* ── MOBILE NAV ── */}
      <div className="lg:hidden flex flex-col items-center w-full max-w-[220px] pointer-events-auto">
        <div
          className={`flex items-center justify-between w-full rounded-full transition-all duration-300 ${
            isScrolled ? "px-3.5 py-2 shadow-md" : "px-4 py-2.5 shadow-lg"
          } bg-white/85 backdrop-blur-xl border border-black/[0.08]`}
        >
          {/* Hamburger */}
          <button
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <span className="relative block h-4 w-4">
              <span
                className={`absolute block w-4 h-[1.5px] bg-zinc-800 transition-all duration-300 ${
                  isOpen ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute block w-4 h-[1.5px] bg-zinc-800 top-[7px] transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute block w-4 h-[1.5px] bg-zinc-800 transition-all duration-300 ${
                  isOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>

          {/* Active section name */}
          <span className="text-sm font-semibold text-zinc-900 tracking-wide text-center">
            {formatLabel(activeSection)}
          </span>

          {/* Spacer to keep text centered */}
          <div className="w-8 h-8" />
        </div>

        {/* Mobile Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 w-full rounded-2xl p-2 bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
            >
              {sectionIds.map((id) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(id);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-black/5"
                    }`}
                  >
                    <span>{formatLabel(id)}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP NAV (Gowtham Width-Condensing Fluid Dock) ── */}
      <motion.div
        style={{
          paddingLeft: springNavPaddingX,
          paddingRight: springNavPaddingX,
          paddingTop: springNavPaddingY,
          paddingBottom: springNavPaddingY,
          gap: springItemGap,
        }}
        className={`hidden lg:flex items-center rounded-full pointer-events-auto transition-shadow duration-300 ${
          isScrolled
            ? "shadow-[0_12px_36px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]"
            : "shadow-[0_18px_48px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]"
        } bg-white/85 backdrop-blur-2xl border border-black/[0.07]`}
      >
        {sectionIds.map((id) => {
          const isActive = activeSection === id;
          return (
            <motion.a
              key={id}
              href={`#${id}`}
              style={{
                paddingLeft: springItemPaddingX,
                paddingRight: springItemPaddingX,
              }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(id);
              }}
              className={`relative py-2 text-sm font-medium tracking-tight rounded-full whitespace-nowrap select-none transition-colors duration-200 ${
                isActive ? "text-white" : "text-zinc-600 hover:text-black hover:bg-black/[0.04]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeSection"
                  className="absolute inset-0 bg-zinc-900 rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10">{formatLabel(id)}</span>
            </motion.a>
          );
        })}
      </motion.div>
    </motion.header>
  );
}

export default Header;