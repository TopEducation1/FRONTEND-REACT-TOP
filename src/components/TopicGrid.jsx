import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

const GRID_COL_CLASSES =
  "relative overflow-visible grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3";

export default function TopicGrid({ topics = [], columns = 5 }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [colCount, setColCount] = useState(5);
  const [touch, setTouch] = useState(false);

  
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

    setTouch(
      typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );

    window.addEventListener("resize", computeCols);
    return () => window.removeEventListener("resize", computeCols);
  }, [columns]);

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (filtersObject) => {
    const queryParams = new URLSearchParams();

    queryParams.set("idioma", "es");
    queryParams.set("page", "1");
    queryParams.set("page_size", "16");

    Object.entries(filtersObject || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      queryParams.set(key, value);
    });

    navigateWithTransition(`/explora/filter?idioma=en&${queryParams.toString()}`);
  };

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
          navigateWithTransition={navigateWithTransition}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function TopicCard({
  topic,
  idx,
  colCount,
  isTouch,
  onFilter,
  navigateWithTransition,
  scrollYProgress,
}) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef(null);

  const relatedItems = useMemo(
    () => topic?.items || topic?.universities || [],
    [topic]
  );

  const isElevated = isTouch ? isActive : isHovered;
  const showOverlay = isElevated;

  const evenColumn = colCount > 0 ? (idx % colCount) % 2 === 0 : true;

  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    evenColumn ? [8, -25] : [-25, 8]
  );

  const y = useSpring(yRaw, {
    stiffness: 60,
    damping: 20,
    mass: 0.2,
  });

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

  useEffect(() => {
    updateButtons();
  }, [relatedItems.length]);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth) * dir;

    el.scrollBy({
      left: amount,
      behavior: "smooth",
    });

    setTimeout(updateButtons, 220);
  };

  const handleTopicClick = () => {
    if (isTouch) {
      setIsActive((v) => !v);
      return;
    }

    if (topic?.filter) {
      onFilter(topic.filter);
      return;
    }

    if (topic?.id) {
      onFilter({ tema_id: topic.id });
    }
  };

  const handleRelatedClick = (item) => {
    if (item?.type === "certification" && item?.link) {
      navigateWithTransition(item.link);
      return;
    }

    if (item?.filter) {
      onFilter(item.filter);
      return;
    }

    if (item?.type === "university" && item?.id) {
      onFilter({
        tema_id: topic.id,
        universidad_id: item.id,
      });
      return;
    }

    if (item?.type === "company" && item?.id) {
      onFilter({
        tema_id: topic.id,
        empresa_id: item.id,
      });
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
  };

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
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const contentStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.05,
      },
    },
  };

  const itemUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.22,
        ease: "easeOut",
      },
    },
  };

  const imageUrl = topic.img
  ? topic.img.replace(
      "https://app.top.education",
      "https://top.education"
    )
  : null;

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="initial"
      animate="in"
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        group relative rounded-[28px] bg-white
        border border-black/5
        shadow-[0_10px_40px_rgba(0,0,0,0.04)]
        hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)]
        transition-all duration-500
      "
      style={{
        y,
        zIndex: isElevated ? 9999 : 1,
        transformStyle: "preserve-3d",
      }}
      onHoverStart={() => !isTouch && setIsHovered(true)}
      onHoverEnd={() => !isTouch && setIsHovered(false)}
      onFocus={() => !isTouch && setIsHovered(true)}
      onBlur={() => !isTouch && setIsHovered(false)}
      whileHover={!isTouch ? { scale: 1.04 } : undefined}
    >
      <button
        type="button"
        className="block w-full"
        onClick={handleTopicClick}
        aria-label={`Abrir ${topic.name}`}
      >
        <div
          className="
            relative w-full min-h-[150px]
            flex flex-col items-center justify-center
            px-6 pt-8 pb-5
            transition-transform duration-300
            group-hover:scale-[1.03]
            will-change-transform transform-gpu
          "
        >
          {topic.img ? (
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5"
              style={{
                backgroundColor: `${topic.color || "#5CC781"}22`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex justify-center items-center"
                style={{
                  backgroundColor: topic.color || "#5CC781",
                }}
              >
                <img
                  src={imageUrl}
                  alt={topic.name}
                  className="w-10 h-10 brightness-500 object-contain"
                  
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5"
              style={{
                backgroundColor: `${topic.color || "#5CC781"}22`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex justify-center items-center text-white !font-[Montserrat] font-semibold"
                style={{
                  backgroundColor: topic.color || "#5CC781",
                }}
              >
                {(topic?.name || "T").charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </button>

      <div className="px-5 pb-5 pt-0">
        <h3
          className="
            text-center !font-[Montserrat]
            text-[#0F090B] font-semibold
            leading-[1.2] text-[1rem] md:text-[1rem] px-4
          "
        >
          {topic.name}
        </h3>
      </div>

      <AnimatePresence initial={false}>
        {showOverlay && (
          <motion.div
            key="overlay"
            className="absolute inset-x-0 bottom-0 z-[10000] h-full backdrop-blur-sm flex items-end"
            variants={overlaySlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ willChange: "transform" }}
          >
            <motion.div
              variants={contentStagger}
              className="
                relative w-full rounded-t-[28px]
                bg-[#F6F4EF]/95 backdrop-blur-xl
                border-t border-black/5
                shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.25)]
                pt-4 pb-20 px-3 flex flex-col items-center
              "
            >
              <div className="mb-2 h-1.5 w-12 rounded-full bg-black/10" />

              <motion.h4
                variants={itemUp}
                className="text-[1rem] !font-[Montserrat] leading-5 font-semibold text-[#0F090B] text-center mb-1 cursor-pointer"
                onClick={handleTopicClick}
              >
                {topic.name}
              </motion.h4>

              {topic.description && (
                <motion.p
                  variants={itemUp}
                  className="mb-2 text-center text-[0.68rem] text-black/75 leading-snug max-w-[88%]"
                >
                  {topic.description}
                </motion.p>
              )}

              <motion.div
                variants={itemUp}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[108%] md:w-[150%] bottom-0"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => scrollByAmount(-1)}
                    disabled={!canPrev}
                    className="
                      pointer-events-auto absolute left-[-10px] top-1/2 -translate-y-1/2 z-20
                      w-9 h-9 rounded-full backdrop-blur-md shadow ring-white/5
                      !flex items-center justify-center leading-[1em]
                      hover:bg-white hover:text-black
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    aria-label="Anterior"
                  >
                    <span className="leading-0 flex mt-[-10px]">‹</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollByAmount(1)}
                    disabled={!canNext}
                    className="
                      pointer-events-auto absolute right-[-10px] top-1/2 -translate-y-1/2 z-20
                      w-9 h-9 rounded-full backdrop-blur-md shadow ring-white/5
                      !flex items-center justify-center leading-[1em]
                      hover:bg-white hover:text-black
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    aria-label="Siguiente"
                  >
                    <span className="leading-0 flex mt-[-10px]">›</span>
                  </button>

                  <div
                    ref={trackRef}
                    onScroll={updateButtons}
                    className="
                      pointer-events-auto overflow-x-auto scroll-smooth px-4 pb-2
                      snap-x snap-mandatory
                      [&::-webkit-scrollbar]:hidden rounded-2xl
                    "
                    style={{ scrollbarWidth: "none" }}
                  >
                    <ul className="flex gap-3 items-center pt-5 min-w-full">
                      {relatedItems.map((item, u) => {
                        const itemKey = `${topic.id ?? topic.name}-${item.id ?? u}`;

                        return (
                          <li key={itemKey} className="snap-start shrink-0">
                            <motion.button
                              whileHover={{ y: -8, scale: 1.05 }}
                              transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 18,
                              }}
                              onClick={() => handleRelatedClick(item)}
                              type="button"
                              className="
                                group/uni relative grid place-items-center
                                rounded-2xl bg-white border border-black/5
                                shadow-sm hover:shadow-lg
                                transition-all duration-300
                                w-[78px] h-[78px]
                              "
                              title={item?.name}
                              aria-label={item?.name}
                            >
                              {item?.img ? (
                                <img
                                  src={item.img}
                                  alt={item?.name}
                                  className="max-w-[80%] max-h-[80%] rounded-sm object-contain"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";

                                    const fallback =
                                      e.currentTarget.nextElementSibling;

                                    if (fallback) {
                                      fallback.style.display = "grid";
                                    }
                                  }}
                                />
                              ) : null}

                              <span
                                style={{
                                  display: item?.img ? "none" : "grid",
                                }}
                                className="
                                  h-11 w-11 place-items-center rounded-full
                                  bg-[#2563EB] text-sm font-semibold text-white
                                  !font-[Montserrat]
                                "
                              >
                                {(item?.initial || item?.name || "T")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <span
                                className="
                                  pointer-events-none absolute top-[60px] left-1/2 -translate-x-1/2
                                  w-[128%] rounded-md bg-[#F6F4EF]
                                  text-black text-[8px] leading-[1em]
                                  px-1 py-1 shadow opacity-0 scale-95
                                  transition-all duration-200 z-100
                                  group-hover/uni:opacity-100 group-hover/uni:scale-100
                                "
                              >
                                {item?.name}
                              </span>
                            </motion.button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}