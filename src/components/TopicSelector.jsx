import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView, motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "../components/AnimatedCounter";

// Importaciones necesarias
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Importa Navigation desde el path correcto
import { Navigation } from "swiper/modules";

const TopicSelector = ({ topics }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedTags, setSelectedTags] = useState({});
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);

  const ref = useRef();
  const isInView = useInView(ref, { amount: 0.8 });
  const navigate = useNavigate();

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (tagsObject) => {
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      for (const [category, tag] of Object.entries(tagsObject)) {
        if (!updatedTags[category]) {
          updatedTags[category] = [tag];
        } else if (!updatedTags[category].includes(tag)) {
          updatedTags[category].push(tag);
        }
      }
      const queryParams = new URLSearchParams();
      for (const [cat, tags] of Object.entries(updatedTags)) {
        tags.forEach((tag) => queryParams.append(cat, tag));
      }
      navigateWithTransition(`/explora/filter?${queryParams.toString()}`, {
        replace: true,
        state: { selectedTags: updatedTags },
      });
      return updatedTags;
    });
  };

  const handleMouseEnter = (topic, i) => {
  setHoveredItem({ topic, index: i });
};

const handleMouseLeave = () => {
  setTimeout(() => {
    if (!isHoveringPopup) {
      setHoveredItem(null);
    }
  }, 150);
};

  return (
    <div className="cloud-container relative flex flex-wrap justify-center gap-2 lg:block" ref={ref}>
      <div className="center-text-banner w-full">
        <h2 className="index-text hidden text-[#F6F4EF] text-[2rem] lg:text-[3rem] md:block text-center font-normal leading-[1.2em] mb-0">
          <AnimatedCounter end={14500} title="certificaciones" />
        </h2>
        <h2 className='md:hidden leading-[0.8em] text-[4rem]'><AnimatedCounter end={14500}/><br></br><span className='text-[2.5rem] leading-[1em]'>Certificaciones</span></h2>
      </div>
      <div className='w-full md:hidden'>
        <Swiper
          modules={[Navigation]}
          navigation={{
                nextEl: '.boton-next',
                prevEl: '.boton-prev',
              }}
          spaceBetween={2}
          slidesPerView="auto"
          grabCursor={true}
          className="py-2 px-2"
        >
          {topics.map((topic, index) =>
            topic.position.map((p, i) => (
              p.pos === 'topicImg' && (
              <SwiperSlide
                key={topic.id}
                style={{ width: "100%" }}
                className="!flex items-center gap-2 p-2"
              >
                <div className='flex flex-wrap justify-center rounded-xl py-5 px-3 box-border bg-[#1c1c1c]'>
                  {p.pos === 'topicImg' && (
                    <img
                      src={`/${topic.img}.png`}
                      alt={topic.name}
                      title={topic.name}
                      className={`topic-img w-[100px] h-[100px]`}
                      
                      onMouseEnter={() => handleMouseEnter(topic, i)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() =>
                        handleItemMenuClick({
                          [topic.type]: topic.name,
                        })
                      }
                    />
                    
                  )}
                  <h3 className='text-center w-full text-[1.5rem] font-bold my-3 leading-[1.2em]'>{topic.name}</h3>
                  <div className='flex flex-wrap justify-center gap-1'>
                    {topic.universities?.map((uni, i) => {
                      return (
                        <img
                          key={i}
                          onClick={() => {
                            if (uni.type === "Certificacion") {
                              // Redirige a la URL que trae uni.link
                              window.location.href = uni.link;
                            } else {
                              // Mantener comportamiento normal
                              handleItemMenuClick({
                                [uni.type]: uni.name,
                                [topic.type]: topic.name,
                              });
                            }
                          }}
                          className="relative rounded-full text-xs mx-1 py-1 cursor-pointer !object-contain whitespace-nowrap w-[60px] h-[60px]"
                          src={uni.img}
                          title={uni.name}
                        />
                      )                    
                    })}
                  </div>
                  
                </div>
                
              </SwiperSlide>
              
              )
            ))
          )}
        </Swiper>
        <div className="flex justify-between mt-0 mx-3">
          <button className="boton-prev bg-[#F6F4EF] hover:bg-opacity-50 text-[2rem] text-[#0F090B] px-4 py-1 rounded-full"><FaChevronLeft /></button>
          <button className="boton-next bg-[#F6F4EF] hover:bg-opacity-50   text-[2rem] text-[#0F090B] px-4 py-1 rounded-full"><FaChevronRight /></button>
        </div>
      </div>

      {topics.map((topic, index) =>
        topic.position.map((p, i) => (
          <React.Fragment 
            key={`${index}-${i}`}  
          >
            <div className={`element lg:left-[${parseFloat(p.x)}%] top-[${parseFloat(p.y)}%] lg:absolute`}
              >
              <div className='relative w-fit h-fit '>
                {/* Texto */}
                {p.pos === 'topicText' && (
                  <motion.div
                    className="topic-word element"
                    style={{
                      fontSize: `${parseFloat(p.size)}%`,
                      zIndex: hoveredItem?.topic?.name === topic.name &&
                  hoveredItem?.index === i
                    ? 50
                    : 10,
                      cursor: 'pointer',
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 180 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false, amount: 0.5 }}
                    onMouseEnter={() => handleMouseEnter(topic, i)}
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

                {/* Blur */}
                {p.pos === 'topicBlur' && (
                  <motion.div
                    className="topic-blur element"
                    style={{
                      fontSize: `${parseFloat(p.size)}%`,
                      filter: 'blur(2px)',
                      cursor: 'pointer',
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 10 }}
                    
                  >
                    {topic.name}
                  </motion.div>
                )}

                {/* Imagen */}
                {p.pos === 'topicImg' && (
                  <motion.img
                    src={`/${topic.img}.png`}
                    alt={topic.name}
                    title={topic.name}
                    className={`topic-img w-[100px] h-[100px] lg:w-[${(parseInt(p.size, 10) * 0.24).toFixed(1)}%] lg:h-[${(parseInt(p.size, 10) * 0.24).toFixed(1)}%]`}
                    style={{
                      zIndex: hoveredItem?.topic?.name === topic.name &&
                  hoveredItem?.index === i
                    ? 50
                    : 10,
                      cursor: 'pointer',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    onMouseEnter={() => handleMouseEnter(topic, i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() =>
                      handleItemMenuClick({
                        [topic.type]: topic.name,
                      })
                    }
                  />
                  
                )}
              </div>
              {/* POPUP - detrás del elemento con hover */}
              
              <AnimatePresence className="bg-[#c80303] flex relative">
                {hoveredItem?.topic?.name === topic.name &&
                      hoveredItem?.index === i && (
                  <motion.div
                    className="absolute rounded-full shadow-xl p-4"
                    style={{
                      left: '-105px',
                      top: '-110px',
                      width: '240px',
                      height: '240px',
                      zIndex: 30, // detrás del texto/imágenes
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onMouseEnter={() => setIsHoveringPopup(true)}
                          onMouseLeave={() => {
                            setIsHoveringPopup(false);
                            setHoveredItem(null);
                          }}
                  >
                    <div className="flex flex-col items-center bg-[#0F090B]/80 shadow-[0px_0px_30px_15px_#0F090B] backdrop-blur-xs rounded-full justify-center w-full h-full text-center ">
                      <div className="relative w-full h-full bg-center bg-cover bg-no-repeat bg-[url(./assets/category/animate-hth-top.svg)] mx-auto">
                        {topic.universities?.map((uni, i) => {
                          const radius = 50;
                          const angle = (i / 6) * 2 * Math.PI;
                          const x = radius * Math.cos(angle);
                          const y = radius * Math.sin(angle);

                          return uni.img ? (
                            <img
                              key={i}
                              onClick={() => {
                                if (uni.type === "Certificacion") {
                                  // Redirige a la URL que trae uni.link
                                  window.location.href = uni.link;
                                } else {
                                  // Mantener comportamiento normal
                                  handleItemMenuClick({
                                    [uni.type]: uni.name,
                                    [topic.type]: topic.name,
                                  });
                                }
                              }}
                              className="absolute rounded-full text-xs px-2 py-1 cursor-pointer whitespace-nowrap !object-contain w-[60px] h-[60px] transform -translate-x-1/2 -translate-y-1/2"
                              src={uni.img}
                              title={uni.name}
                              style={{
                                left: `${50 + x}%`,
                                top: `${50 + y}%`,
                              }}
                            />
                          ) : (
                            <button
                              key={i}
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
        ))
      )}

      
    </div>
  );
};

export default TopicSelector;
