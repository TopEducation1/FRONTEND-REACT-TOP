import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTransform, useSpring } from "framer-motion";

/**
 * Refactor para cumplir reglas de hooks:
 * - Parallax por tarjeta movido a un componente hijo (TopicCard) para no llamar hooks dentro de .map
 */

const GRID_COL_CLASSES =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";

export default function TopicGrid({ topics = [], columns = 5 }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Scroll global del contenedor para parallax suave
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

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
    typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

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
  const [isActive, setIsActive] = useState(false); // tap en móviles
  const [isHovered, setIsHovered] = useState(false); // hover en desktop

  const evenColumn = colCount > 0 ? (idx % colCount) % 2 === 0 : true;

  // Hooks de framer-motion dentro del componente (válido para ESLint rules-of-hooks)
  const yRaw = useTransform(scrollYProgress, [0, 1], evenColumn ? [8, -25] : [-25, 8]);
  const y = useSpring(yRaw, { stiffness: 60, damping: 20, mass: 0.2 });

  const showOverlay = isTouch ? isActive : isHovered;

  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.98, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.25, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.03 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
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
        <h3 className="text-center text-[1.2rem] font-semibold leading-tight text-[#F6F4EF]">
          {topic.name}
        </h3>
      </div>

      {/* Overlay con animación agradable */}
      <AnimatePresence initial={false}>
        {showOverlay && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center py-4 px-1"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {topic.description && (
              <motion.p variants={itemVariants} className="mb-3 text-center text-[.6rem] text-black/80 max-w-[85%]">
                {topic.description}
              </motion.p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
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
                    variants={itemVariants}
                    key={uniKey}
                    type="button"
                    onClick={click}
                    className="grid place-items-center rounded-full bg-white p-0 overflow-hidden w-[40px] h-[40px] shadow focus:outline-none focus:ring-2 focus:ring-[#0F090B]/30"
                    title={uni.name}
                    aria-label={uni.name}
                  >
                    <img src={uni.img} alt={uni.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                  </motion.button>
                ) : (
                  <motion.button
                    variants={itemVariants}
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

            <motion.div variants={itemVariants} className="absolute bottom-[0px] left-0 w-full text-center">
              <button
                type="button"
                className="rounded-[15px_15px_0px_0px] bg-[#0F090B] px-4 py-[7px] text-sm font-semibold text-white hover:opacity-90"
                onClick={() => onFilter({ [topic.type]: topic.name })}
              >{topic.name}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
