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
  overflow-visible
  grid
  grid-cols-1
  gap-3
  md:grid-cols-3
  lg:grid-cols-3
  xl:grid-cols-4
`;


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
      if (typeof window === "undefined") {
        return;
      }

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
      if (typeof window === "undefined") {
        return;
      }

      setIsTouch(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };


    computeCols();
    detectTouch();

    window.addEventListener("resize", computeCols);

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

        queryParams.set(
          key,
          value
        );
      });


      navigateWithTransition(
        `/explora/filter?${queryParams.toString()}`
      );
    },
    [navigateWithTransition]
  );


  // ==========================================================
  // GRID
  // ==========================================================

  const colClass = useMemo(() => {
    if (
      !columns ||
      columns === 5
    ) {
      return GRID_COL_CLASSES;
    }

    const map = {
      2: `
        relative
        overflow-visible
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
      `,

      3: `
        relative
        overflow-visible
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        md:grid-cols-3
      `,

      4: `
        relative
        overflow-visible
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      `,

      6: `
        relative
        overflow-visible
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-6
      `,
    };

    return (
      map[columns] ||
      GRID_COL_CLASSES
    );
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

  const relatedItems = useMemo(() => {
    if (
      Array.isArray(topic?.items) &&
      topic.items.length
    ) {
      return topic.items;
    }

    if (
      Array.isArray(topic?.universities) &&
      topic.universities.length
    ) {
      return topic.universities;
    }

    if (
      Array.isArray(topic?.companies) &&
      topic.companies.length
    ) {
      return topic.companies;
    }

    return [];
  }, [
    topic?.items,
    topic?.universities,
    topic?.companies,
  ]);


  const isElevated =
    isTouch
      ? isActive
      : isHovered;

  const showOverlay =
    isElevated;


  // ==========================================================
  // PARALLAX SUAVE
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
        ? [4, -8]
        : [-8, 4]
  );


  const y = useSpring(
    yRaw,
    {
      stiffness: 150,
      damping: 28,
      mass: 0.15,
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
      el.scrollLeft > 6
    );

    setCanNext(
      maxScroll > 6 &&
      el.scrollLeft <
        maxScroll - 6
    );
  }, []);


  // recalcular cada vez que abre overlay
  useEffect(() => {
    if (!showOverlay) {
      return;
    }

    let frame1;
    let frame2;

    frame1 =
      requestAnimationFrame(() => {
        frame2 =
          requestAnimationFrame(() => {
            updateButtons();
          });
      });

    return () => {
      cancelAnimationFrame(frame1);

      if (frame2) {
        cancelAnimationFrame(frame2);
      }
    };
  }, [
    showOverlay,
    relatedItems.length,
    updateButtons,
  ]);


  // también recalcular resize
  useEffect(() => {
    window.addEventListener(
      "resize",
      updateButtons
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateButtons
      );
    };
  }, [updateButtons]);


  // ==========================================================
  // SLIDER
  // ==========================================================

  const scrollByAmount =
    useCallback(
      (direction) => {
        const el =
          trackRef.current;

        if (!el) return;


        const amount =
          Math.max(
            100,
            el.clientWidth * 0.8
          );


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
          350
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
        setIsActive(
          (current) =>
            !current
        );

        return;
      }


      if (topic?.filter) {
        onFilter(
          topic.filter
        );

        return;
      }


      if (topic?.id) {
        onFilter({
          tema_id:
            topic.id,
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
          onFilter(
            item.filter
          );

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

          return;
        }


        if (
          item?.id &&
          topic?.id
        ) {
          onFilter({
            tema_id:
              topic.id,

            item_id:
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
  // ANIMATION
  // ==========================================================

  const overlayVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },

    visible: {
      y: 0,
      opacity: 1,

      transition:
        shouldReduceMotion
          ? {
              duration: 0,
            }
          : {
              duration: 0.18,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            },
    },

    exit: {
      y: "100%",
      opacity: 0,

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
  // RENDER
  // ==========================================================

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
        delay:
          Math.min(
            idx * 0.025,
            0.12
          ),
      }}
      style={{
        y,

        zIndex:
          isElevated
            ? 20
            : 1,
      }}
      onMouseEnter={() => {
        if (!isTouch) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isTouch) {
          setIsHovered(false);
        }
      }}
      className={`
        group
        relative

        rounded-[28px]

        border
        border-black/5

        bg-white

        shadow-[0_10px_40px_rgba(0,0,0,0.04)]

        transition-[box-shadow,border-color]
        duration-150
        ease-out

        ${
          isElevated
            ? `
              border-black/10
              shadow-[0_18px_55px_rgba(0,0,0,0.10)]
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
              ? 1.01
              : 1,
        }}
        transition={{
          duration: 0.16,
          ease: "easeOut",
        }}
        className="
          relative
          z-[1]
          min-h-[220px]

          overflow-hidden

          rounded-[28px]
        "
      >

        <button
          type="button"
          onClick={
            handleTopicClick
          }
          className="
            block
            w-full
          "
          aria-label={`Abrir ${
            topic?.name ||
            "tema"
          }`}
        >

          <div
            className="
              flex
              min-h-[155px]
              w-full

              flex-col
              items-center
              justify-center

              px-6
              pb-5
              pt-8
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
                      src={imageUrl}
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

                        text-base
                        font-semibold
                        text-white
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

          </div>

        </button>


        <div
          className="
            px-5
            pb-5
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
      >
        {showOverlay && (
          <motion.div
            key="overlay"
            variants={
              overlayVariants
            }
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              absolute
              inset-0

              z-10

              flex
              items-end

              overflow-visible

              rounded-[28px]

              pointer-events-none
            "
          >

            <div
              className="
                pointer-events-auto

                relative

                w-full

                rounded-[28px]

                border
                border-black/5

                bg-[#F6F4EF]/[0.98]

                px-3
                pb-4
                pt-4

                shadow-[0_12px_40px_rgba(0,0,0,0.14)]

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

                    max-w-[90%]

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
              {/* SLIDER */}
              {/* ================================================= */}

              {relatedItems.length >
              0 ? (
                <div
                  className="
                    relative

                    mt-4
                    w-full

                    overflow-visible
                  "
                >

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
                      left-0
                      top-1/2

                      z-30

                      flex
                      h-9
                      w-9

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-black/10

                      bg-white

                      text-2xl
                      leading-none

                      text-black

                      shadow-md

                      transition-all
                      duration-150

                      hover:scale-105

                      disabled:
                      pointer-events-none

                      disabled:
                      opacity-20
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
                      right-0
                      top-1/2

                      z-30

                      flex
                      h-9
                      w-9

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-black/10

                      bg-white

                      text-2xl
                      leading-none

                      text-black

                      shadow-md

                      transition-all
                      duration-150

                      hover:scale-105

                      disabled:
                      pointer-events-none

                      disabled:
                      opacity-20
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
                      overflow-x-auto

                      px-11
                      pb-3
                      pt-3

                      scroll-smooth

                      snap-x
                      snap-mandatory

                      overscroll-x-contain

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
                                        y:
                                          -3,

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
                                className="
                                  group/related

                                  relative

                                  grid

                                  h-[78px]
                                  w-[78px]

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
                                title={
                                  item?.name
                                }
                                aria-label={
                                  item?.name
                                }
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
                                        max-h-[78%]
                                        max-w-[78%]

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
                                        h-11
                                        w-11

                                        place-items-center

                                        rounded-full

                                        bg-[#2563EB]

                                        text-sm
                                        font-semibold
                                        text-white
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
                                      h-11
                                      w-11

                                      place-items-center

                                      rounded-full

                                      bg-[#2563EB]

                                      text-sm
                                      font-semibold
                                      text-white
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

                                    left-1/2
                                    top-[calc(100%+6px)]

                                    z-40

                                    w-max
                                    max-w-[140px]

                                    -translate-x-1/2

                                    rounded-lg

                                    bg-[#0F090B]

                                    px-2
                                    py-1.5

                                    text-center

                                    text-[8px]
                                    leading-tight
                                    text-white

                                    opacity-0

                                    shadow-md

                                    transition-opacity
                                    duration-100

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
              ) : (
                <div
                  className="
                    mt-4
                    rounded-2xl

                    bg-black/[0.03]

                    px-4
                    py-4

                    text-center

                    text-[0.7rem]
                    text-black/50
                  "
                >
                  No hay elementos relacionados disponibles.
                </div>
              )}

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.article>
  );
}