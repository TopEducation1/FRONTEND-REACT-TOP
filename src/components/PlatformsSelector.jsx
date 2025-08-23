import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

const PlatformsSelector = ({ platforms }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedTags, setSelectedTags] = useState({});
  const [zoomOrigin, setZoomOrigin] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
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

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const handleClick = (platform, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setIsZooming(true);
    setTimeout(() => {
      setSelectedPlatform(platform);
      setIsZooming(false);
    }, 800);
  };

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

  // Posiciones animadas (desde exterior a posiciones cercanas al centro, sin colisión)
  const initialPositions = [
    { x: '-20%', y: '-50%' }, // top-left
    { x: '180%', y: '-50%' },  // top-right
    { x: '30%', y: '150%' },     // bottom-center
  ];

  const finalPositions = [
    { x: '15%', y: '0%' }, // izquierda arriba
    { x: '130%', y: '0%' },  // derecha arriba
    { x: '75%', y: '100%' },    // abajo al centro
  ];

  return (
    <section ref={sectionRef} className="w-full py-32 lg:py-0 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-5">
        
        {/* CONTENIDO A LA IZQUIERDA */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-[#F6F4EF] text-[2rem] md:text-[2.5rem] font-normal leading-[1.2em] mb-5">
            Forma equipos que <span className="top-italic text-[3.2rem] mt-2 block lg:text-[4.5rem] !leading-[1em]">aprenden y crecen</span>
          </h2>
          <p className="text-[1.125rem] lg:pr-15 text-[#a8a8a8] mb-8">
            Potencia las habilidades de tu equipo con certificaciones clave y seguimiento en tiempo real...
          </p>
          <Link to="/para-equipos" className="shadow-[0px_0px_10px_3px_#F6F4EF] bg-[#F6F4EF] !text-[#1c1c1c] text-[1rem] lg:text-[1.3rem] z-[11] !py-2 !px-5 !rounded-full">
            Conoce<span id="top">top</span><span id="education">.education</span> para equipos
          </Link>
        </div>

        {/* CÍRCULO DE PLATAFORMAS */}
        <div className="w-full lg:w-1/2 relative h-[400px]">
          {platforms.slice(0, 3).map((platform, index) => (
            <motion.div
              key={index}
              className="absolute topic-circle cursor-pointer"
              initial={initialPositions[index]}
              animate={isInView ? finalPositions[index] : initialPositions[index]}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onClick={(e) => handleClick(platform, e)}
            >
              <img
                className="max-w-[100px] lg:max-w-[180px] w-full h-auto object-contain"
                src={platform.img}
                alt={platform.name}
              />
              <span className="block mt-2 text-[#F6F4EF] text-center">{platform.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ZOOM CIRCLE */}
      {isZooming && zoomOrigin && (
        <div
          className="zoom-circle"
          style={{
            left: `${zoomOrigin.x}px`,
            top: `${zoomOrigin.y}px`,
          }}
        />
      )}

      {/* POPUP */}
      {selectedPlatform && (
        <div className="popup-overlay" onClick={() => setSelectedPlatform(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPlatform.img}
              alt={selectedPlatform.name}
              onClick={() =>
                handleItemMenuClick({
                  [selectedPlatform.type]: selectedPlatform.name,
                })
              }
              className="popup-img"
            />
            <h3 className="text-4xl text-[#0F090B]">{selectedPlatform.name}</h3>
            <p className="text-[1.2rem] leading-[1.2em] text-[#0F090B]">{selectedPlatform.description}</p>
            <div className="university-buttons">
              {selectedPlatform.universities.map((uni, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleItemMenuClick({
                      [uni.type]: uni.name,
                      [selectedPlatform.type]: selectedPlatform.name,
                    })
                  }
                  className="uni-card"
                >
                  <img src={uni.img} alt={uni.name} className="uni-img" />
                  <span className="!text-[#0F090B]">{uni.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlatformsSelector;
