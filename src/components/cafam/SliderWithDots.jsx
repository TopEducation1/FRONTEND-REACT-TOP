import React, { useState, useEffect, useRef } from 'react';

const SliderWithDots = ({ images = [], itemsPerSection = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const sliderRef = useRef(null);

  // Ajuste responsivo
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsToShow(1);
      } else if (width < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    // Establecer estado inicial
    handleResize();

    // Listener de resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular número total de secciones
  const totalSections = Math.ceil(images.length / itemsToShow);

  // Navegación entre secciones
  const goToSection = (index) => {
    setCurrentIndex(index);
  };

  // Renderizado condicional si no hay imágenes
  if (images.length === 0) return null;

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <div 
          ref={sliderRef}
          className="slider-content"
          style={{
            display: 'flex',
            transform: `translateX(-${(currentIndex * 100) / totalSections}%)`,
            transition: 'transform 0.5s ease',
            width: `${totalSections * 100}%`
          }}
        >
          {images.map((img, index) => (
            <div 
              key={index} 
              className="slider-item"
              style={{
                width: `${100 / (totalSections * itemsToShow)}%`,
                flexShrink: 0,
                padding: '0 10px',
                boxSizing: 'border-box'
              }}
            >
              <div className="slider-card">
                <div className="card-content">
                  <img 
                    src={img} 
                    alt={`Slide ${index + 1}`} 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSections > 1 && (
        <div className="slider-dots">
          {[...Array(totalSections)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSection(index)}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              aria-label={`Ir a la sección ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderWithDots;