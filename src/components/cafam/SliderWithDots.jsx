import React, { useState } from 'react';

const SliderWithDots = ({ images = [], itemsPerSection = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const totalSections = Math.ceil(images.length / itemsPerSection);

  const goToSection = (index) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) return null;

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <div 
          className="slider-content"
          style={{
            transform: `translateX(-${currentIndex * (100 / totalSections)}%)`,
            width: `${totalSections * 100}%`
          }}
        >
          {images.map((img, index) => (
            <div 
              key={index}
              className="slider-item"
              style={{ width: `${100 / (totalSections * itemsPerSection)}%` }}
            >
              <div className="slider-card">
                <div className="card-content">
                  <img 
                    src={img} 
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSections > 1 && (
        <div className="slider-dots">
          {[...new Array(totalSections)].map((_, index) => (
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