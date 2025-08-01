import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView, motion, AnimatePresence } from "framer-motion";

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
    <div className="cloud-container relative" ref={ref}>

      <div className="center-text-banner">
        <h2 className="index-text text-[#F6F4EF] text-3xl lg:text-[3rem] text-center font-normal leading-[1.2em] mb-0">
          +13.000 certificaciones
        </h2>
      </div>

      {topics.map((topic, index) =>
        topic.position.map((p, i) => (
          <React.Fragment 
            key={`${index}-${i}`}  
          >
            <div className=' absolute'
              style={{
                left: `${parseFloat(p.x)}%`,
                top: `${parseFloat(p.y)}%`,}}>
              <div className='relative w-fit h-fit '>
                {/* Texto */}
                {p.pos === 'topicText' && (
                  <motion.div
                    className="topic-word"
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
                    className="topic-blur"
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
                    className="topic-img"
                    style={{
                      width: `${(parseInt(p.size, 10) * 0.24).toFixed(1)}%`,
                      height: `${(parseInt(p.size, 10) * 0.24).toFixed(1)}%`,
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
              left: '-100px',
              top: '-100px',
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
            <div className="flex flex-col items-center bg-[#0F090B]/50 backdrop-blur-xs rounded-full justify-center w-full h-full text-center">
              {/*hoveredTopic.img?.trim() && (
                <img
                  src={`${hoveredTopic.img}.png`}
                  onClick={() => handleItemMenuClick(hoveredTopic.type, hoveredTopic.name)}
                  alt={hoveredTopic.name}
                  className="w-[60px] h-[60px] object-contain mb-2 cursor-pointer"
                />
              )
              <p className="text-base text-neutral-800 font-semibold leading-tight">
                {hoveredTopic.name}
              </p>
              <p className="text-xs text-neutral-600 mt-1 px-2 line-clamp-3">
                {hoveredTopic.description}
              </p>*/}
              <div className="relative w-full h-full bg-center bg-cover bg-no-repeat bg-[url(./assets/category/animate-hth-top.svg)] mx-auto">
                {topic.universities?.map((uni, i) => {
                  const radius = 50;
                  const angle = (i / 6) * 2 * Math.PI;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);

                  return uni.img ? (
                    <img
                      key={i}
                      onClick={() =>
                        handleItemMenuClick({
                          [uni.type]: uni.name,
                          [topic.type]: topic.name,
                        })
                      }
                      className="absolute rounded-full text-xs px-2 py-1 cursor-pointer whitespace-nowrap w-[60px] transform -translate-x-1/2 -translate-y-1/2"
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
