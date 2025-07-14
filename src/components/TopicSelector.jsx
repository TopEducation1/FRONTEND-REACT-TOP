import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView, motion } from "framer-motion";

const TopicSelector = ({ topics }) => {
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
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

  const handleItemMenuClick = (category, tag) => {
    const initialTags = { [category]: [tag] };
    const queryParams = new URLSearchParams({
      page: 1,
      page_size: 15,
      [category]: tag,
    }).toString();

    navigateWithTransition(`/explora/filter?${queryParams}`, {
      replace: true,
      state: { selectedTags: initialTags },
    });
  };

  const handleMouseEnter = (topic, event) => {
    const containerRect = ref.current.getBoundingClientRect();
    const rect = event.currentTarget.getBoundingClientRect();

    // Calcula posición relativa al contenedor
    const relativeX = rect.left - containerRect.left;
    const relativeY = rect.top - containerRect.top;

    setHoveredTopic(topic);
    setPopupPosition({ x: relativeX, y: relativeY });
  };


  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isHoveringPopup) {
        setHoveredTopic(null);
        setPopupPosition(null);
      }
    }, 150); // pequeña demora para permitir entrar al popup
  };

  return (
    <div className="cloud-container relative" ref={ref}>

      <div className="center-text-banner">
        <h2 className="index-text text-[#F6F4EF] text-3xl lg:text-[3rem] text-center font-normal leading-[1.2em] mb-0">
          +13.000 certificaciones
        </h2>
      </div>

      {topics.map((topic, index) =>
        topic.position.map((p, i) => (
          <React.Fragment key={`${index}-${i}`}>
            {/* Texto */}
            {p.pos === 'topicText' && (
              <motion.div
                className="topic-word"
                style={{
                  position: 'absolute',
                  left: `${parseFloat(p.x)}%`,
                  top: `${parseFloat(p.y)}%`,
                  fontSize: `${parseFloat(p.size)}%`,
                  zIndex: hoveredTopic?.name === topic.name ? 50 : 10,
                  cursor: 'pointer',
                }}
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 180 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false, amount: 0.5 }}
                onMouseEnter={(e) => handleMouseEnter(topic, e)}
                onMouseLeave={handleMouseLeave}
              >
                {topic.name}
              </motion.div>
            )}
            {p.pos === 'topicBlur' && (
              <motion.div
                className="topic-blur"
                style={{
                  position: 'absolute',
                  left: `${parseFloat(p.x)}%`,
                  top: `${parseFloat(p.y)}%`,
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
                src={`${topic.img}.png`}
                alt={topic.name}
                title={topic.name}
                className="topic-img"
                style={{
                  position: 'absolute',
                  left: `${parseFloat(p.x)}%`,
                  top: `${parseFloat(p.y)}%`,
                  width: `${(parseInt(p.size, 10) * 0.24).toFixed(1)}%`,
                  height: `${(parseInt(p.size, 10) * 0.24).toFixed(1)}%`,
                  zIndex: hoveredTopic?.name === topic.name ? 50 : 10,
                  cursor: 'pointer',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
                onMouseEnter={(e) => handleMouseEnter(topic, e)}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </React.Fragment>
        ))
      )}

      {/* POPUP - detrás del elemento con hover */}
      {hoveredTopic && popupPosition && (
        <motion.div
          className="absolute rounded-full bg-white shadow-xl p-4"
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
            width: '240px',
            height: '240px',
            transform: 'translate(-50%, -50%)',
            zIndex: 30, // detrás del texto/imágenes
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setIsHoveringPopup(true)}
          onMouseLeave={() => {
            setIsHoveringPopup(false);
            setHoveredTopic(null);
            setPopupPosition(null);
          }}
        >
          <div className="flex flex-col items-center justify-center w-full h-full text-center">
            {hoveredTopic.img?.trim() && (
              <img
                src={`${hoveredTopic.img}.png`}
                onClick={() => handleItemMenuClick(hoveredTopic.type, hoveredTopic.name)}
                alt={hoveredTopic.name}
                className="w-[60px] h-[60px] object-contain mb-2 cursor-pointer"
              />
            )}
            <p className="text-base text-neutral-800 font-semibold leading-tight">
              {hoveredTopic.name}
            </p>
            <p className="text-xs text-neutral-600 mt-1 px-2 line-clamp-3">
              {hoveredTopic.description}
            </p>
            <div className="flex flex-wrap justify-center gap-1 mt-2 px-1">
              {hoveredTopic.universities?.map((uni, i) => (
                <button
                  key={i}
                  onClick={() => handleItemMenuClick(uni.type, uni.name)}
                  className={`rounded-full text-xs px-2 py-1 ${
                    uni.img
                      ? 'bg-white text-neutral-800 border border-neutral-300'
                      : 'bg-neutral-900 text-white'
                  }`}
                >
                  {uni.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TopicSelector;
