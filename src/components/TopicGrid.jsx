import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Grid 5×N con:
 * - Parallax suave por columnas (pares suben / impares bajan al hacer scroll)
 * - Hover/Tap que revela un panel que SUBE desde la parte inferior
 */

const GRID_COL_CLASSES =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";

export default function TopicGrid({ topics = [], columns = 5 }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Scroll global del contenedor para parallax suave
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [colCount, setColCount] = useState(5);

  // Detecta columnas actuales según breakpoints + prop columns
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
      2: "grid grid-cols-1 sm:grid-cols-2 gap-3",
      3: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
      4: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
      6: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
    };
    return map[columns] || GRID_COL_CLASSES;
  }, [columns]);

  const touch = isTouchDevice();

  return (
    <div ref={containerRef} className={colClass}>
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
  const [isActive, setIsActive] = useState(false);  // tap en móviles
  const [isHovered, setIsHovered] = useState(false); // hover en desktop

  const evenColumn = colCount > 0 ? (idx % colCount) % 2 === 0 : true;

  // Parallax por columnas (pares suben, impares bajan)
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    evenColumn ? [8, -25] : [-25, 8]
  );
  const y = useSpring(yRaw, { stiffness: 60, damping: 20, mass: 0.2 });

  const showOverlay = isTouch ? isActive : isHovered;

  // Card fade-in
  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
  };

  // Overlay que SUBE desde abajo
  const overlaySlide = {
    hidden: { y: "100%", opacity: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 26,
        mass: 0.6,
      },
    },
    exit: {
      y: "100%",
      opacity: 0.9,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  // Stagger del contenido interno
  const contentStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  };

  // Ítems que aparecen de abajo hacia arriba
  const itemUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  };

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="initial"
      animate="in"
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative rounded-2xl bg-[#1c1c1c]/80 ring-1 ring-white/5 hover:ring-white/10 shadow-sm overflow-hidden"
      style={{ y }}
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
        <div className="w-full aspect-[4/3] flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-[1.03]">
          {topic.img ? (
            <img
              src={topic.img.startsWith("/") ? topic.img : `/${topic.img}.png`}
              alt={topic.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-white/60 text-sm">
              Sin imagen
            </div>
          )}
        </div>
      </button>

      {/* Título */}
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
            className="absolute inset-x-0 bottom-0 z-10 h-full bg-white/50 backdrop-blur-sm flex items-end"
            variants={overlaySlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ willChange: "transform" }}
          >
            {/* Panel interno */}
            <motion.div
              variants={contentStagger}
              className="w-full rounded-t-2xl bg-white shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.25)] pt-4 pb-0 px-3 flex flex-col items-center"
            >
              {/* Handler visual opcional */}
              <div className="mb-2 h-1.5 w-12 rounded-full bg-black/10" />

              {/* Descripción */}
              {topic.description && (
                <motion.p
                  variants={itemUp}
                  className="mb-2 text-center text-[.72rem] text-black/80 leading-snug"
                >
                  {topic.description}
                </motion.p>
              )}

              {/* Logos / chips */}
              <div className="flex flex-wrap items-center justify-center gap-1 mb-0">
                {(topic.universities || []).map((uni, u) => {
                  const uniKey = `${topic.id ?? topic.name}-${u}`;
                  const click = () => {
                    if (uni?.type === "Certificacion" && uni?.link) {
                      window.open(uni.link, "_blank");
                    } else if (uni?.type && uni?.name) {
                      onFilter({ [uni.type]: uni.name, [topic.type]: topic.name });
                    }
                  };
                  return uni?.img ? (
                    <motion.button
                      variants={itemUp}
                      key={uniKey}
                      type="button"
                      onClick={click}
                      className="grid place-items-center rounded-full bg-white p-0 overflow-hidden w-[40px] h-[40px] shadow focus:outline-none focus:ring-2 focus:ring-[#0F090B]/30"
                      title={uni.name}
                      aria-label={uni.name}
                    >
                      <img
                        src={uni.img}
                        alt={uni.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    </motion.button>
                  ) : (
                    <motion.button
                      variants={itemUp}
                      key={uniKey}
                      type="button"
                      onClick={click}
                      className="rounded-xl bg-[#0F090B] px-2 py-1 text-[11px] font-medium text-white max-w-[140px] truncate shadow focus:outline-none focus:ring-2 focus:ring-[#0F090B]/30"
                      title={uni?.name || "Universidad"}
                    >
                      {uni?.name || "Universidad"}
                    </motion.button>
                  );
                })}
              </div>

              {/* CTA inferior pegado al borde */}
              <motion.div variants={itemUp} className="w-full text-center">
                <button
                  type="button"
                  className="inline-block rounded-[12px_12px_0_0] bg-[#1c1c1c]/90 px-4 py-[7px] text-[.8rem] font-semibold text-white hover:opacity-90"
                  onClick={() => onFilter({ [topic.type]: topic.name })}
                >
                  {topic.name}
                </button>
              </motion.div>
            </motion.div>

            {/* Cortina gradiente opcional para acentuar el origen inferior */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
