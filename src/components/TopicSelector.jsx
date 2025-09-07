import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInView, motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "../components/AnimatedCounter";

// Swiper (móvil)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Fondo neuronal
import NeuronBackground from "./NeuronBackground";

const TopicSelector = ({ topics }) => {
  const [hoveredItem, setHoveredItem] = useState(null); // {topic, index}
  const [hoveredNodeId, setHoveredNodeId] = useState(null); // `${tIndex}-${i}`
  const [selectedTags, setSelectedTags] = useState({});
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.8 });
  const navigate = useNavigate();

  // --- Navegación con View Transitions (cuando existan)
  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(path));
    } else {
      navigate(path);
    }
  }

  // --- Clic en items/tags
  const handleItemMenuClick = (tagsObject) => {
    setSelectedTags((prev) => {
      const updated = { ...prev };
      for (const [category, tag] of Object.entries(tagsObject)) {
        if (!updated[category]) updated[category] = [tag];
        else if (!updated[category].includes(tag)) updated[category].push(tag);
      }
      const queryParams = new URLSearchParams();
      for (const [cat, tags] of Object.entries(updated)) {
        tags.forEach((tag) => queryParams.append(cat, tag));
      }
      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updated },
      });
      return updated;
    });
  };

  // --- Hover
  const handleMouseEnter = (topic, i, nodeId) => {
    setHoveredItem({ topic, index: i });
    setHoveredNodeId(nodeId);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isHoveringPopup) {
        setHoveredItem(null);
        setHoveredNodeId(null);
      }
    }, 150);
  };

  // --- Nodos para NeuronBackground (usa posiciones fijas en %)
  const nodes = useMemo(() => {
    const out = [];
    topics.forEach((topic, tIndex) => {
      topic.position.forEach((p, i) => {
        if (p.pos === "topicText" || p.pos === "topicImg") {
          out.push({
            id: `${tIndex}-${i}`,
            xPct: parseFloat(p.x),
            yPct: parseFloat(p.y),
          });
        }
      });
    });
    return out;
  }, [topics]);

  return (
    <div
      className="cloud-container relative flex flex-wrap justify-center gap-2 lg:block"
      ref={ref}
    >
      {/* Fondo neuronal (desktop/tablet) */}
      <NeuronBackground
        nodes={nodes}
        hoveredId={hoveredNodeId}
        k={3}
        maxDistPct={26}
        disableOnMobile={true}
      />

      {/* Centro: contador grande */}
      <div className="center-text-banner w-full">
        <h2 className="index-text hidden text-[#F6F4EF] text-[2rem] lg:text-[3rem] md:block text-center font-normal leading-[1.2em] mb-0">
          <AnimatedCounter end={14500} title="certificaciones" />
        </h2>
        <h2 className="md:hidden leading-[0.8em] text-[4rem]">
          <AnimatedCounter end={14500} />
          <br />
          <span className="text-[2.5rem] leading-[1em]">Certificaciones</span>
        </h2>
      </div>

      {/* --- VISTA MÓVIL: slider --- */}
      <div className="w-full md:hidden">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".boton-next",
            prevEl: ".boton-prev",
          }}
          spaceBetween={2}
          slidesPerView="auto"
          grabCursor={true}
          className="py-2 px-2"
        >
          {topics.map((topic, tIndex) =>
            topic.position.map((p, i) => {
              if (p.pos !== "topicImg") return null;
              const slideKey = `${topic.id || topic.name}-${tIndex}-${i}`;
              const nodeId = `${tIndex}-${i}`;
              return (
                <SwiperSlide
                  key={slideKey}
                  style={{ width: "100%" }}
                  className="!flex items-center gap-2 p-2"
                >
                  <div className="flex flex-wrap justify-center rounded-xl py-5 px-3 box-border bg-[#1c1c1c]">
                    <img
                      src={`/${topic.img}.png`}
                      alt={topic.name}
                      title={topic.name}
                      className="topic-img"
                      style={{ width: 100, height: 100, objectFit: "contain" }}
                      onMouseEnter={() => handleMouseEnter(topic, i, nodeId)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() =>
                        handleItemMenuClick({
                          [topic.type]: topic.name,
                        })
                      }
                    />
                    <h3 className="text-center w-full text-[1.5rem] font-bold my-3 leading-[1.2em]">
                      {topic.name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1">
                      {topic.universities?.map((uni, u) =>
                        uni.img ? (
                          <img
                            key={u}
                            onClick={() => {
                              if (uni.type === "Certificacion") {
                                window.location.href = uni.link;
                              } else {
                                handleItemMenuClick({
                                  [uni.type]: uni.name,
                                  [topic.type]: topic.name,
                                });
                              }
                            }}
                            className="relative rounded-full text-xs mx-1 py-1 cursor-pointer !object-contain whitespace-nowrap"
                            style={{ width: 60, height: 60 }}
                            src={uni.img}
                            title={uni.name}
                          />
                        ) : (
                          <button
                            key={u}
                            onClick={() =>
                              handleItemMenuClick({
                                [uni.type]: uni.name,
                                [topic.type]: topic.name,
                              })
                            }
                            className="bg-[#F6F4EF] text-[#0F090B] max-w-[80px] py-1 px-2 leading-[1em] rounded-xl text-[10px] font-medium"
                          >
                            {uni.name}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })
          )}
        </Swiper>

        <div className="flex justify-between mt-0 mx-3">
          <button className="boton-prev bg-[#F6F4EF] hover:bg-opacity-50 text-[2rem] text-[#0F090B] px-4 py-1 rounded-full">
            <FaChevronLeft />
          </button>
          <button className="boton-next bg-[#F6F4EF] hover:bg-opacity-50 text-[2rem] text-[#0F090B] px-4 py-1 rounded-full">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* --- DESKTOP/TABLET: elementos posicionados fijos --- */}
      {topics.map((topic, tIndex) =>
        topic.position.map((p, i) => {
          const nodeId = `${tIndex}-${i}`;
          return (
            <React.Fragment key={`${tIndex}-${i}`}>
              <div
                className="element lg:absolute"
                style={{
                  left: `${parseFloat(p.x)}%`,
                  top: `${parseFloat(p.y)}%`,
                }}
              >
                <div className="relative w-fit h-fit">
                  {/* TEXTO */}
                  {p.pos === "topicText" && (
                    <motion.div
                      className="topic-word element"
                      style={{
                        fontSize: `${parseFloat(p.size)}%`,
                        zIndex:
                          hoveredItem?.topic?.name === topic.name &&
                          hoveredItem?.index === i
                            ? 50
                            : 10,
                        cursor: "pointer",
                      }}
                      initial={{ opacity: 0, y: 0 }}
                      whileInView={{ opacity: 1, y: 10 }}
                      animate={
                        isInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 180 }
                      }
                      transition={{ duration: 0.6 }}
                      viewport={{ once: false, amount: 0.5 }}
                      onMouseEnter={() =>
                        handleMouseEnter(topic, i, nodeId)
                      }
                      onMouseLeave={handleMouseLeave}
                      onClick={() =>
                        handleItemMenuClick({
                          [topic.type]: topic.name,
                        })
                      }
                    >
                      {topic.name}
                    </motion.div>
                  )}

                  {/* BLUR */}
                  {p.pos === "topicBlur" && (
                    <motion.div
                      className="topic-blur element"
                      style={{
                        fontSize: `${parseFloat(p.size)}%`,
                        filter: "blur(2px)",
                        cursor: "pointer",
                      }}
                      initial={{ opacity: 0, y: 0 }}
                      whileInView={{ opacity: 1, y: 10 }}
                    >
                      {topic.name}
                    </motion.div>
                  )}

                  {/* IMAGEN */}
                  {p.pos === "topicImg" && (
                    <motion.img
                      src={`/${topic.img}.png`}
                      alt={topic.name}
                      title={topic.name}
                      className="topic-img"
                      style={{
                        width: `${(parseInt(p.size, 10) * 0.24).toFixed(1)}%`,
                        height: `${(parseInt(p.size, 10) * 0.24).toFixed(1)}%`,
                        zIndex:
                          hoveredItem?.topic?.name === topic.name &&
                          hoveredItem?.index === i
                            ? 50
                            : 10,
                        cursor: "pointer",
                        objectFit: "contain",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: true }}
                      onMouseEnter={() =>
                        handleMouseEnter(topic, i, nodeId)
                      }
                      onMouseLeave={handleMouseLeave}
                      onClick={() =>
                        handleItemMenuClick({
                          [topic.type]: topic.name,
                        })
                      }
                    />
                  )}
                </div>

                {/* --- POPUP circular --- */}
                <AnimatePresence>
                  {hoveredItem?.topic?.name === topic.name &&
                    hoveredItem?.index === i && (
                      <motion.div
                        className="absolute rounded-full shadow-xl p-4"
                        style={{
                          left: "-105px",
                          top: "-110px",
                          width: "240px",
                          height: "240px",
                          zIndex: 30,
                        }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onMouseEnter={() => setIsHoveringPopup(true)}
                        onMouseLeave={() => {
                          setIsHoveringPopup(false);
                          setHoveredItem(null);
                          setHoveredNodeId(null);
                        }}
                      >
                        <div className="flex flex-col items-center bg-[#0F090B]/80 shadow-[0_0_30px_15px_#0F090B] backdrop-blur-xs rounded-full justify-center w-full h-full text-center">
                          <div className="relative w-full h-full bg-center bg-cover bg-no-repeat bg-[url(./assets/category/animate-hth-top.svg)] mx-auto">
                            {topic.universities?.map((uni, u) => {
                              const radius = 50;
                              const angle = (u / 6) * 2 * Math.PI;
                              const x = radius * Math.cos(angle);
                              const y = radius * Math.sin(angle);

                              return uni.img ? (
                                <img
                                  key={u}
                                  onClick={() => {
                                    if (uni.type === "Certificacion") {
                                      window.location.href = uni.link;
                                    } else {
                                      handleItemMenuClick({
                                        [uni.type]: uni.name,
                                        [topic.type]: topic.name,
                                      });
                                    }
                                  }}
                                  className="absolute rounded-full text-xs px-2 py-1 cursor-pointer whitespace-nowrap !object-contain transform -translate-x-1/2 -translate-y-1/2"
                                  style={{ width: 60, height: 60,
                                    left: `${50 + x}%`,
                                    top: `${50 + y}%`,
                                   }}
                                  src={uni.img}
                                  title={uni.name}
                                  
                                />
                              ) : (
                                <button
                                  key={u}
                                  onClick={() =>
                                    handleItemMenuClick({
                                      [uni.type]: uni.name,
                                      [topic.type]: topic.name,
                                    })
                                  }
                                  className="absolute bg-[#F6F4EF] text-[#0F090B] max-w-[80px] py-1 px-2 leading-[1em] rounded-xl text-[10px] font-medium"
                                  style={{
                                    left: `${50 + x}%`,
                                    top: `${50 + y}%`,
                                  }}
                                >
                                  {uni.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

export default TopicSelector;
