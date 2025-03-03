import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// University Image Arrays
const universidadesLatamImagenes = [
  {img: "assets/cafam/latinoamérica/andes.png", universidad: "Universidad de los Andes"},
  {img: "assets/cafam/latinoamérica/tec.png", universidad: "Tecnológico de Monterrey"},
  {img: "assets/Universidades/UNAM.png", universidad: "UNAM"},
  {img: "assets/Universidades/SAE-México.png", universidad: "SAE-México"},
  {img: "assets/Universidades/Pontificia-Universidad-Católica-de-Chile.png", universidad: "Pontificia Universidad Catolica de Chile"},
  {img: "assets/Universidades/Universidad-de-Palermo.png", universidad: "Universidad de Palermo"},
  {img: "assets/Universidades/universidad-autónoma-metropolitana.png", universidad: "Universidad Autónoma Metropolitana"},
  {img: "assets/Universidades/Universidad-nacional-de-colombia.png", universidad: "Universidad Nacional de Colombia"},
  {img: "assets/Universidades/Pontificia-Universidad-Católica-del-Perú.png", universidad: "Pontificia Universidad Catolica de Peru"},
];

const universidadesImagenes = [
  {img: "assets/cafam/mundo/duke.png", universidad: "Duke University"},
  {img: "assets/cafam/mundo/yale.png", universidad: "Yale University"},
  {img: "assets/cafam/mundo/stanford.png", universidad: "Stanford University"},
  {img: "assets/Universidades/University-of-Maryland-College-Park.png", universidad: "University of Maryland, College Park"},
  {img: "assets/Universidades/University-of-Virginia.png", universidad: "University of Virginia"},
  {img: "assets/Universidades/Wesleyan-University.png", universidad: "Wesleyan University"},
  {img: "assets/Universidades/university-of-minnesota.png", universidad: "University of Minnesota"},
  {img: "assets/Universidades/University-of-California,-Irvine.png", universidad: "University of California, Irvine"},
];

// Slider Component
const SliderWithDots = ({ 
  images = [], 
  itemsPerSection = 3, 
  handleBannerClick,
  showAllDots = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoClick = (university) => {
    const initialTags = {
      "Universidad": [university]
    };
    console.log(initialTags);

    navigate('/cafam/', {
      state: { selectedTags: initialTags },
      replace: true
    });
  };

  // Responsive adjustment
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

    // Set initial state
    handleResize();

    // Resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate total sections
  const totalSections = Math.ceil(images.length / itemsToShow);

  // Navigate between sections
  const goToSection = (index) => {
    setCurrentIndex(index);
  };

  // Render nothing if no images
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
          {images.map((universidad, index) => (
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
              <div 
                className="slider-card"
                onClick={(e) => {
                  e.preventDefault();
                  if (handleBannerClick) {
                    handleBannerClick(universidad.universidad); // Asegúrate de pasar el nombre correcto
                  }
                }}
              >
                <div className="card-content">
                  <img 
                    src={universidad.img} 
                    alt={universidad.universidad} 
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

      {(totalSections > 1 || showAllDots) && (
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

// Universities Section Component
const UniversitiesSection = ({handleBannerClick}) => {
  const navigate = useNavigate();


  return (
    <div id="universities-cafam-section">
      <div id="upper-section-universities" className="block-universities">
        <div className="wrapper-title-cafam-universities">
          <h1>Aprende de las mejores universidades de Latinoamérica...</h1>
        </div>
        <div id="wrapper-upper-universities-cafam">
          <div id="wrapper-slider-upper-universities">
            <SliderWithDots 
              images={universidadesLatamImagenes} 
              handleBannerClick={(university) => handleBannerClick("Universidad", university)}
            />
          </div>
        </div>
      </div>
      <div id="lower-section-universities" className="block-universities">
        <div id="wrapper-lower-universities-cafam">
          <div className="wrapper-title-cafam-universities">
            <h1>y de todo el mundo</h1>
          </div>
          
          <div id="wrapper-slider-lower-universities">
            <SliderWithDots
              images={universidadesImagenes}
              showAllDots={true}
              handleBannerClick={(university) => handleBannerClick("Universidad", university)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversitiesSection;