import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Galaxy from "../components/GalaxyBackground"; // <<--- Fondo oficial Bits (OGL)

/**
 * Grid 5×N con:
 * - Parallax por columnas
 * - Overlay que sube
 * - Slider absoluto 150% con controles y tooltips
 * - Z-index dinámico para superponer el card en hover/tap
 */

const GRID_COL_CLASSES =
  "relative overflow-visible grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0";

export default function TopicGrid({ topics = [], columns = 5 }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [colCount, setColCount] = useState(5);

  useEffect(() => {
    const computeCols = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1920;
      let base = 1;
      if (w >= 1280) base = Math.min(columns || 5, 5);
      else if (w >= 1024) base = Math.min(columns || 5, 4);
      else if (w >= 768) base = Math.min(columns || 5, 3);
      else if (w >= 640) base = Math.min(columns || 5, 2);
      else base = 1;
      setColCount(base);
    };
    computeCols();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", computeCols);
      return () => window.removeEventListener("resize", computeCols);
    }
  }, [columns]);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    const queryParams = new URLSearchParams();
    for (const [cat, tag] of Object.entries(tagsObject)) {
      if (Array.isArray(tag)) tag.forEach((t) => queryParams.append(cat, t));
      else queryParams.append(cat, tag);
    }
    navigateWithTransition(`/explora/filter?${queryParams.toString()}`);
  };

  const isTouchDevice = () =>
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const colClass = useMemo(() => {
    if (!columns || columns === 5) return GRID_COL_CLASSES;
    const map = {
      2: "relative overflow-visible grid grid-cols-1 sm:grid-cols-2 gap-3",
      3: "relative overflow-visible grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
      4: "relative overflow-visible grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
      6: "relative overflow-visible grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
    };
    return map[columns] || GRID_COL_CLASSES;
  }, [columns]);

  const touch = isTouchDevice();

  return (
    <div ref={containerRef} className={colClass}>
      {/* 🌌 Fondo Bits Galaxy - detrás del grid 
      <Galaxy
        className="absolute inset-0 -z-10 pointer-events-none"
        transparent
        density={1}
        hueShift={140}
        starSpeed={0.5}
        speed={1.0}
        twinkleIntensity={0.3}
        glowIntensity={0.3}
        saturation={0.0}
        mouseRepulsion={true}
        repulsionStrength={2}
        rotationSpeed={0.1}
        autoCenterRepulsion={0}
      />*/}

      {topics.map((topic, idx) => (
        <TopicCard
          key={topic.id ?? `${topic.name}-${idx}`}
          topic={topic}
          idx={idx}
          colCount={colCount}
          isTouch={touch}
          onFilter={handleItemMenuClick}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function TopicCard({ topic, idx, colCount, isTouch, onFilter, scrollYProgress }) {
  const [isActive, setIsActive] = useState(false);   // tap en móviles
  const [isHovered, setIsHovered] = useState(false); // hover en desktop
  const isElevated = isTouch ? isActive : isHovered; // para z-index dinámico

  const evenColumn = colCount > 0 ? (idx % colCount) % 2 === 0 : true;

  // Parallax por columnas
  const yRaw = useTransform(scrollYProgress, [0, 1], evenColumn ? [8, -25] : [-25, 8]);
  const y = useSpring(yRaw, { stiffness: 60, damping: 20, mass: 0.2 });

  const showOverlay = isElevated;

  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
  };

  const overlaySlide = {
    hidden: { y: "100%", opacity: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 26, mass: 0.6 },
    },
    exit: { y: "100%", opacity: 0.9, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  const contentStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  };

  const itemUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  };

  // --- Slider state & handlers
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setCanPrev(!atStart);
    setCanNext(!atEnd);
  };

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 1) * dir; // 100% del ancho visible
    el.scrollBy({ left: amount, behavior: "smooth" });
    // ajustar estado tras el scroll
    setTimeout(updateButtons, 220);
  };

  useEffect(() => {
    updateButtons();
  }, [topic?.universities?.length]);

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="initial"
      animate="in"
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative bg-[#1c1c1c]/80 ring-1 ring-white/5 hover:ring-white/10 shadow-sm"
      style={{
        y,
        zIndex: isElevated ? 9999 : 1, // << superposición al hover/tap
        transformStyle: "preserve-3d",
      }}
      onHoverStart={() => !isTouch && setIsHovered(true)}
      onHoverEnd={() => !isTouch && setIsHovered(false)}
      onFocus={() => !isTouch && setIsHovered(true)}
      onBlur={() => !isTouch && setIsHovered(false)}
      whileHover={!isTouch ? { scale: 1.04 } : undefined}
    >
      {/* Imagen del topic */}
      <button
        type="button"
        className="block w-full"
        onClick={() => {
          if (isTouch) setIsActive((v) => !v);
          else onFilter({ [topic.type]: topic.name });
        }}
        aria-label={`Abrir ${topic.name}`}
      >
        <div className="w-full aspect-[4/3] flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-[1.03] will-change-transform transform-gpu">
          {topic.img ? (
            <img
              src={topic.img.startsWith("/") ? topic.img : `/${topic.img}-t.png`}
              alt={topic.name}
              className={`h-full w-full object-contain drop-shadow-[0_0_30px_${topic.color}]`}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-white/60 text-sm">
              Sin imagen
            </div>
          )}
        </div>
      </button>

      {/* Título base */}
      <div className="px-5 pb-5 pt-0">
        <h3 className="text-center text-[1.2rem] font-semibold font-monts leading-tight text-[#F6F4EF]">
          {topic.name}
        </h3>
      </div>

      {/* Overlay que sube desde abajo */}
      <AnimatePresence initial={false}>
        {showOverlay && (
          <motion.div
            key="overlay"
            className="absolute inset-x-0 bottom-0 z-[10000] h-full  backdrop-blur-sm flex items-end"
            variants={overlaySlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ willChange: "transform" }}
          >
            {/* Panel interno (relative para posicionar el slider absoluto) */}
            <motion.div
              variants={contentStagger}
              className="relative w-full rounded-t-2xl bg-white/80 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.25)] pt-4 pb-20 px-3 flex flex-col items-center"
            >
              {/* Handler visual */}
              <div className="mb-2 h-1.5 w-12 rounded-full bg-black/10" />

              {/* Título arriba */}
              <motion.h4
                variants={itemUp}
                className="text-[1rem] leading-5 font-semibold text-[#0F090B] text-center mb-1"
              >
                {topic.name}
              </motion.h4>

              {/* Descripción pequeña */}
              {topic.description && (
                <motion.p
                  variants={itemUp}
                  className="mb-2 text-center text-[0.68rem] text-black/75 leading-snug max-w-[88%]"
                >
                  {topic.description}
                </motion.p>
              )}

              {/* --- SLIDER ABSOLUTO 150% con controles --- */}
              <motion.div
                variants={itemUp}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[108%] md:w-[150%] bottom-0"
              >
                <div className="relative">
                  {/* Controles */}
                  <button
                    type="button"
                    onClick={() => scrollByAmount(-1)}
                    disabled={!canPrev}
                    className="pointer-events-auto absolute left-[-10px] top-1/2 -translate-y-1/2 z-20 grid place-items-center
                               w-9 h-9 rounded-full backdrop-blur-md shadow ring-white/5 !flex items-center justify-center leading-[1em]
                               hover:bg-white hover:text-black  disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Anterior"
                  >
                    <span className="leading-0 flex mt-[-10px]">‹</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollByAmount(1)}
                    disabled={!canNext}
                    className="pointer-events-auto absolute right-[-10px] top-1/2 -translate-y-1/2 z-20 grid place-items-center
                               w-9 h-9 rounded-full backdrop-blur-md shadow ring-white/5 !flex items-center justify-center leading-[1em]
                               hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Siguiente"
                  >
                    <span className="leading-0 flex mt-[-10px]">›</span>
                  </button>

                  {/* Pista scrollable */}
                  <div
                    ref={trackRef}
                    onScroll={updateButtons}
                    className="pointer-events-auto overflow-x-auto  scroll-smooth px-4 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden rounded-2xl"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <ul className="flex gap-3 items-center pt-5 min-w-full">
                      {(topic.universities || []).map((uni, u) => {
                        const uniKey = `${topic.id ?? topic.name}-${u}`;
                        const click = () => {
                          if (uni?.type === "Certificacion" && uni?.link) {
                            window.open(uni.link, "_blank");
                          } else if (uni?.type && uni?.name) {
                            onFilter({ [uni.type]: uni.name, [topic.type]: topic.name });
                          }
                        };

                        return (
                          <li key={uniKey} className="snap-start shrink-0">
                            <motion.button
                              whileHover={{ y: -8, scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 250, damping: 18 }}
                              onClick={click}
                              type="button"
                              className="group/uni relative grid place-items-center rounded-2xl bg-white/90 shadow-sm hover:shadow-md ring-1 ring-black/5 
                                         w-[72px] h-[72px]"
                              title={uni?.name}
                              aria-label={uni?.name}
                            >
                              {uni?.img ? (
                                <img
                                  src={uni.img}
                                  alt={uni?.name}
                                  className="max-w-[80%] max-h-[80%] rounded-sm object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="px-2 text-[10px] font-medium text-[#0F090B] truncate">
                                  {uni?.name || "Universidad"}
                                </span>
                              )}

                              {/* Tooltip */}
                              <span
                                className="pointer-events-none absolute top-[60px] left-1/2 -translate-x-1/2 w-[128%]
                                           rounded-md bg-[#0F090B] text-white text-[8px] leading-[1em] px-1 py-1 shadow
                                           opacity-0 scale-95 transition-all duration-200 z-100
                                           group-hover/uni:opacity-100 group-hover/uni:scale-100 "
                              >
                                {uni?.name}
                              </span>
                            </motion.button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
              {/* --- /SLIDER --- */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
