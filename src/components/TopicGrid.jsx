import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { useNavigate } from "react-router-dom";


const GRID_COL_CLASSES = `
  relative
  grid
  grid-cols-1
  gap-3
  md:grid-cols-3
  lg:grid-cols-3
  xl:grid-cols-4
`;


const CARD_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};


const OVERLAY_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};


export default function TopicGrid({
  topics = [],
  columns = 5,
}) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [colCount, setColCount] = useState(5);
  const [isTouch, setIsTouch] = useState(false);


  // ==========================================================
  // RESPONSIVE
  // ==========================================================

  useEffect(() => {
    const computeCols = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;

      let base = 1;

      if (width >= 1280) {
        base = Math.min(columns || 5, 5);
      } else if (width >= 1024) {
        base = Math.min(columns || 5, 4);
      } else if (width >= 768) {
        base = Math.min(columns || 5, 3);
      } else if (width >= 640) {
        base = Math.min(columns || 5, 2);
      }

      setColCount(base);
    };


    const detectTouch = () => {
      if (typeof window === "undefined") return;

      setIsTouch(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };


    computeCols();
    detectTouch();

    window.addEventListener(
      "resize",
      computeCols,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "resize",
        computeCols
      );
    };
  }, [columns]);


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const navigateWithTransition = useCallback(
    (path) => {
      if (!path) return;

      if (
        typeof document !== "undefined" &&
        document.startViewTransition
      ) {
        document.startViewTransition(() => {
          navigate(path);
        });

        return;
      }

      navigate(path);
    },
    [navigate]
  );


  const handleItemMenuClick = useCallback(
    (filtersObject) => {
      const queryParams =
        new URLSearchParams();

      queryParams.set("idioma", "es");
      queryParams.set("page", "1");
      queryParams.set("page_size", "16");


      Object.entries(
        filtersObject || {}
      ).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return;
        }

        queryParams.set(key, value);
      });


      navigateWithTransition(
        `/explora/filter?${queryParams.toString()}`
      );
    },
    [navigateWithTransition]
  );


  // ==========================================================
  // GRID CLASSES
  // ==========================================================

  const colClass = useMemo(() => {
    if (!columns || columns === 5) {
      return GRID_COL_CLASSES;
    }

    const map = {
      2: `
        relative
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
      `,

      3: `
        relative
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        md:grid-cols-3
      `,

      4: `
        relative
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      `,

      6: `
        relative
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-6
      `,
    };

    return map[columns] || GRID_COL_CLASSES;
  }, [columns]);


  return (
    <div
      ref={containerRef}
      className={colClass}
    >
      {topics.map((topic, idx) => (
        <TopicCard
          key={
            topic.id ??
            `${topic.name}-${idx}`
          }
          topic={topic}
          idx={idx}
          colCount={colCount}
          isTouch={isTouch}
          onFilter={handleItemMenuClick}
          navigateWithTransition={
            navigateWithTransition
          }
          scrollYProgress={
            scrollYProgress
          }
        />
      ))}
    </div>
  );
}


// ============================================================
// TOPIC CARD
// ============================================================

function TopicCard({
  topic,
  idx,
  colCount,
  isTouch,
  onFilter,
  navigateWithTransition,
  scrollYProgress,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const [isActive, setIsActive] =
    useState(false);

  const [isHovered, setIsHovered] =
    useState(false);

  const [canPrev, setCanPrev] =
    useState(false);

  const [canNext, setCanNext] =
    useState(false);


  const trackRef = useRef(null);


  // ==========================================================
  // ITEMS
  // ==========================================================

  const relatedItems = useMemo(
    () =>
      topic?.items ||
      topic?.universities ||
      [],
    [topic]
  );


  const isElevated =
    isTouch
      ? isActive
      : isHovered;


  const showOverlay =
    isElevated;


  // ==========================================================
  // PARALLAX
  // ==========================================================

  const evenColumn =
    colCount > 0
      ? (idx % colCount) % 2 === 0
      : true;


  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion
      ? [0, 0]
      : evenColumn
        ? [3, -5]
        : [-4, 4]
  );


  const y = useSpring(
    yRaw,
    {
      stiffness: 170,
      damping: 30,
      mass: 0.12,
    }
  );


  // ==========================================================
  // SLIDER STATE
  // ==========================================================

  const updateButtons = useCallback(() => {
    const el = trackRef.current;

    if (!el) return;

    const maxScroll =
      el.scrollWidth -
      el.clientWidth;

    setCanPrev(
      el.scrollLeft > 4
    );

    setCanNext(
      el.scrollLeft <
        maxScroll - 4
    );
  }, []);


  useEffect(() => {
    const frame =
      requestAnimationFrame(
        updateButtons
      );

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [
    relatedItems.length,
    showOverlay,
    updateButtons,
  ]);


  // ==========================================================
  // SLIDER SCROLL
  // ==========================================================

  const scrollByAmount =
    useCallback(
      (direction) => {
        const el =
          trackRef.current;

        if (!el) return;


        const cardWidth = 78;
        const gap = 12;

        const visibleItems =
          Math.max(
            1,
            Math.floor(
              el.clientWidth /
                (cardWidth + gap)
            )
          );


        const amount =
          visibleItems *
          (cardWidth + gap);


        el.scrollBy({
          left:
            amount * direction,

          behavior:
            shouldReduceMotion
              ? "auto"
              : "smooth",
        });


        window.setTimeout(
          updateButtons,
          320
        );
      },
      [
        shouldReduceMotion,
        updateButtons,
      ]
    );


  // ==========================================================
  // TOPIC CLICK
  // ==========================================================

  const handleTopicClick =
    useCallback(() => {
      if (isTouch) {
        setIsActive((current) =>
          !current
        );

        return;
      }


      if (topic?.filter) {
        onFilter(topic.filter);
        return;
      }


      if (topic?.id) {
        onFilter({
          tema_id: topic.id,
        });
      }
    }, [
      isTouch,
      topic,
      onFilter,
    ]);


  // ==========================================================
  // RELATED CLICK
  // ==========================================================

  const handleRelatedClick =
    useCallback(
      (item) => {
        if (
          item?.type ===
            "certification" &&
          item?.link
        ) {
          navigateWithTransition(
            item.link
          );

          return;
        }


        if (item?.filter) {
          onFilter(item.filter);
          return;
        }


        if (
          item?.type ===
            "university" &&
          item?.id
        ) {
          onFilter({
            tema_id:
              topic?.id,

            universidad_id:
              item.id,
          });

          return;
        }


        if (
          item?.type ===
            "company" &&
          item?.id
        ) {
          onFilter({
            tema_id:
              topic?.id,

            empresa_id:
              item.id,
          });
        }
      },
      [
        navigateWithTransition,
        onFilter,
        topic?.id,
      ]
    );


  // ==========================================================
  // IMAGE
  // ==========================================================

  const imageUrl =
    topic?.img || null;


  // ==========================================================
  // ANIMATIONS
  // ==========================================================

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 8,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  };


  const overlayVariants = {
    hidden: {
      opacity: 0,
      y: "100%",
    },

    visible: {
      opacity: 1,
      y: "0%",

      transition:
        shouldReduceMotion
          ? {
              duration: 0,
            }
          : OVERLAY_TRANSITION,
    },

    exit: {
      opacity: 0,
      y: "100%",

      transition:
        shouldReduceMotion
          ? {
              duration: 0,
            }
          : {
              duration: 0.12,
              ease: "easeIn",
            },
    },
  };


  // ==========================================================
  // HOVER
  // ==========================================================

  const handleMouseEnter =
    useCallback(() => {
      if (isTouch) return;

      setIsHovered(true);
    }, [isTouch]);


  const handleMouseLeave =
    useCallback(() => {
      if (isTouch) return;

      setIsHovered(false);
    }, [isTouch]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="visible"
      transition={{
        duration: 0.22,
        ease: "easeOut",
        delay:
          Math.min(
            idx * 0.02,
            0.12
          ),
      }}
      style={{
        y,

        zIndex:
          isElevated
            ? 5
            : 1,
      }}
      onMouseEnter={
        handleMouseEnter
      }
      onMouseLeave={
        handleMouseLeave
      }
      className={`
        relative
        isolate

        min-h-[220px]

        overflow-hidden

        rounded-[28px]

        border
        border-black/5

        bg-white

        shadow-[0_10px_35px_rgba(0,0,0,0.045)]

        transition-[box-shadow,border-color]
        duration-150
        ease-out

        ${
          isElevated
            ? `
              border-black/10
              shadow-[0_18px_45px_rgba(0,0,0,0.10)]
            `
            : ""
        }
      `}
    >

      {/* ==================================================== */}
      {/* BASE */}
      {/* ==================================================== */}

      <motion.div
        animate={{
          scale:
            isElevated &&
            !shouldReduceMotion
              ? 1.012
              : 1,
        }}
        transition={
          CARD_TRANSITION
        }
        className="
          relative
          z-[1]

          flex
          min-h-[220px]
          flex-col
        "
      >

        <button
          type="button"
          onClick={
            handleTopicClick
          }
          aria-label={`Abrir ${
            topic?.name ||
            "tema"
          }`}
          className="
            flex
            w-full
            flex-1
            flex-col
            items-center
            justify-center

            px-6
            pb-5
            pt-8

            focus:outline-none
          "
        >

          {/* ICON */}

          <div
            className="
              mb-5
              flex
              h-[72px]
              w-[72px]
              items-center
              justify-center

              rounded-2xl

              transition-transform
              duration-150
              ease-out
            "
            style={{
              backgroundColor:
                `${
                  topic?.color ||
                  "#5CC781"
                }22`,
            }}
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-full
              "
              style={{
                backgroundColor:
                  topic?.color ||
                  "#5CC781",
              }}
            >

              {imageUrl ? (
                <>
                  <img
                    src={
                      imageUrl
                    }
                    alt={
                      topic?.name ||
                      ""
                    }
                    className={`
                      h-10
                      w-10
                      object-contain

                      ${
                        /\.svg(?:$|[?#])/i.test(
                          imageUrl
                        )
                          ? "brightness-500"
                          : ""
                      }
                    `}
                    loading="lazy"
                    draggable="false"
                    onError={
                      (event) => {
                        event.currentTarget.style.display =
                          "none";

                        const fallback =
                          event
                            .currentTarget
                            .nextElementSibling;

                        if (fallback) {
                          fallback.style.display =
                            "grid";
                        }
                      }
                    }
                  />

                  <span
                    style={{
                      display:
                        "none",
                    }}
                    className="
                      h-10
                      w-10
                      place-items-center

                      rounded-full

                      text-base
                      font-semibold
                      text-white

                      !font-[Montserrat]
                    "
                  >
                    {(
                      topic?.name ||
                      "T"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </>
              ) : (
                <span
                  className="
                    grid
                    h-10
                    w-10
                    place-items-center

                    rounded-full

                    text-base
                    font-semibold
                    text-white

                    !font-[Montserrat]
                  "
                >
                  {(
                    topic?.name ||
                    "T"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}

            </div>

          </div>

        </button>


        {/* TITLE */}

        <div
          className="
            px-5
            pb-6
          "
        >
          <h3
            className="
              px-4

              text-center

              !font-[Montserrat]

              text-[1rem]
              font-semibold
              leading-[1.2]

              text-[#0F090B]
            "
          >
            {topic?.name}
          </h3>
        </div>

      </motion.div>


      {/* ==================================================== */}
      {/* OVERLAY */}
      {/* ==================================================== */}

      <AnimatePresence
        initial={false}
        mode="sync"
      >
        {showOverlay && (
          <motion.div
            key="topic-overlay"
            variants={
              overlayVariants
            }
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              absolute
              inset-0
              z-20

              flex
              items-end

              overflow-hidden

              rounded-[28px]

              pointer-events-auto
            "
            style={{
              willChange:
                "transform, opacity",
            }}
          >

            <div
              className="
                relative

                w-full

                rounded-t-[26px]

                border-t
                border-black/5

                bg-[#F6F4EF]/[0.98]

                px-3
                pb-4
                pt-4

                shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.25)]

                backdrop-blur-md
              "
            >

              {/* HANDLE */}

              <div
                className="
                  mx-auto
                  mb-3

                  h-1
                  w-10

                  rounded-full

                  bg-black/10
                "
              />


              {/* TITLE */}

              <button
                type="button"
                onClick={
                  handleTopicClick
                }
                className="
                  block
                  w-full

                  text-center

                  !font-[Montserrat]

                  text-[0.95rem]
                  font-semibold
                  leading-5

                  text-[#0F090B]
                "
              >
                {topic?.name}
              </button>


              {/* DESCRIPTION */}

              {topic?.description && (
                <p
                  className="
                    mx-auto
                    mt-1

                    max-w-[92%]

                    text-center

                    text-[0.68rem]
                    leading-snug

                    text-black/65
                  "
                >
                  {
                    topic.description
                  }
                </p>
              )}


              {/* ================================================= */}
              {/* INTERNAL SLIDER */}
              {/* ================================================= */}

              {relatedItems.length >
                0 && (
                <div
                  className="
                    relative
                    mt-4
                    w-full
                  "
                >

                  {/* FADE LEFT */}

                  {canPrev && (
                    <div
                      className="
                        pointer-events-none

                        absolute
                        bottom-0
                        left-0
                        top-0
                        z-10

                        w-10

                        bg-gradient-to-r
                        from-[#F6F4EF]
                        to-transparent
                      "
                    />
                  )}


                  {/* FADE RIGHT */}

                  {canNext && (
                    <div
                      className="
                        pointer-events-none

                        absolute
                        bottom-0
                        right-0
                        top-0
                        z-10

                        w-10

                        bg-gradient-to-l
                        from-[#F6F4EF]
                        to-transparent
                      "
                    />
                  )}


                  {/* PREV */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollByAmount(-1)
                    }
                    disabled={
                      !canPrev
                    }
                    aria-label="Anterior"
                    className="
                      absolute
                      left-1
                      top-1/2
                      z-30

                      flex
                      h-8
                      w-8

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-black/5

                      bg-white/95

                      text-xl
                      text-black

                      shadow-md

                      transition-all
                      duration-150

                      hover:scale-105
                      hover:bg-white

                      active:scale-95

                      disabled:
                      pointer-events-none

                      disabled:
                      opacity-0
                    "
                  >
                    ‹
                  </button>


                  {/* NEXT */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollByAmount(1)
                    }
                    disabled={
                      !canNext
                    }
                    aria-label="Siguiente"
                    className="
                      absolute
                      right-1
                      top-1/2
                      z-30

                      flex
                      h-8
                      w-8

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-black/5

                      bg-white/95

                      text-xl
                      text-black

                      shadow-md

                      transition-all
                      duration-150

                      hover:scale-105
                      hover:bg-white

                      active:scale-95

                      disabled:
                      pointer-events-none

                      disabled:
                      opacity-0
                    "
                  >
                    ›
                  </button>


                  {/* TRACK */}

                  <div
                    ref={trackRef}
                    onScroll={
                      updateButtons
                    }
                    className="
                      relative
                      z-20

                      overflow-x-auto

                      px-10
                      py-3

                      scroll-smooth

                      snap-x
                      snap-mandatory

                      overscroll-x-contain

                      touch-pan-x

                      [&::-webkit-scrollbar]:
                      hidden
                    "
                    style={{
                      scrollbarWidth:
                        "none",

                      WebkitOverflowScrolling:
                        "touch",
                    }}
                  >

                    <ul
                      className="
                        flex
                        min-w-max
                        items-center
                        gap-3
                      "
                    >

                      {relatedItems.map(
                        (
                          item,
                          relatedIndex
                        ) => {

                          const itemKey =
                            `${
                              topic?.id ??
                              topic?.name
                            }-${
                              item?.id ??
                              relatedIndex
                            }`;


                          return (
                            <li
                              key={
                                itemKey
                              }
                              className="
                                shrink-0
                                snap-start
                              "
                            >

                              <motion.button
                                type="button"
                                onClick={() =>
                                  handleRelatedClick(
                                    item
                                  )
                                }
                                whileHover={
                                  shouldReduceMotion
                                    ? undefined
                                    : {
                                        y: -2,
                                        scale:
                                          1.025,
                                      }
                                }
                                whileTap={{
                                  scale:
                                    0.97,
                                }}
                                transition={{
                                  duration:
                                    0.12,

                                  ease:
                                    "easeOut",
                                }}
                                title={
                                  item?.name
                                }
                                aria-label={
                                  item?.name
                                }
                                className="
                                  group/related

                                  relative

                                  grid
                                  h-[76px]
                                  w-[76px]

                                  place-items-center

                                  rounded-2xl

                                  border
                                  border-black/5

                                  bg-white

                                  shadow-sm

                                  transition-shadow
                                  duration-150

                                  hover:shadow-md
                                "
                              >

                                {/* IMAGE */}

                                {item?.img ? (
                                  <>
                                    <img
                                      src={
                                        item.img
                                      }
                                      alt={
                                        item?.name ||
                                        ""
                                      }
                                      className="
                                        max-h-[74%]
                                        max-w-[74%]

                                        rounded-sm

                                        object-contain
                                      "
                                      loading="lazy"
                                      draggable="false"
                                      onError={
                                        (
                                          event
                                        ) => {
                                          event.currentTarget.style.display =
                                            "none";

                                          const fallback =
                                            event
                                              .currentTarget
                                              .nextElementSibling;

                                          if (
                                            fallback
                                          ) {
                                            fallback.style.display =
                                              "grid";
                                          }
                                        }
                                      }
                                    />

                                    <span
                                      style={{
                                        display:
                                          "none",
                                      }}
                                      className="
                                        h-10
                                        w-10

                                        place-items-center

                                        rounded-full

                                        bg-[#2563EB]

                                        text-sm
                                        font-semibold
                                        text-white

                                        !font-[Montserrat]
                                      "
                                    >
                                      {(
                                        item?.initial ||
                                        item?.name ||
                                        "T"
                                      )
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase()}
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    className="
                                      grid
                                      h-10
                                      w-10

                                      place-items-center

                                      rounded-full

                                      bg-[#2563EB]

                                      text-sm
                                      font-semibold
                                      text-white

                                      !font-[Montserrat]
                                    "
                                  >
                                    {(
                                      item?.initial ||
                                      item?.name ||
                                      "T"
                                    )
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </span>
                                )}


                                {/* TOOLTIP */}

                                <span
                                  className="
                                    pointer-events-none

                                    absolute

                                    bottom-[calc(100%+7px)]
                                    left-1/2
                                    z-40

                                    w-max
                                    max-w-[145px]

                                    -translate-x-1/2
                                    translate-y-1

                                    rounded-lg

                                    bg-[#0F090B]

                                    px-2
                                    py-1.5

                                    text-center

                                    text-[8px]
                                    leading-tight
                                    text-white

                                    opacity-0

                                    shadow-lg

                                    transition-all
                                    duration-150

                                    group-hover/related:
                                    translate-y-0

                                    group-hover/related:
                                    opacity-100
                                  "
                                >
                                  {
                                    item?.name
                                  }
                                </span>

                              </motion.button>

                            </li>
                          );
                        }
                      )}

                    </ul>

                  </div>

                </div>
              )}

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.article>
  );
}