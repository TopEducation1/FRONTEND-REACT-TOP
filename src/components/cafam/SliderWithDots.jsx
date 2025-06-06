import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCafam } from "../../context/cafam/CafamContext";

// University Image Arrays
const universidadesLatamImagenes = [
  {img: "assets/flags/BA-TE-ANDES.webp", universidad: "Universidad de los Andes"},
  {img: "assets/flags/BA-TE-MONTERREY.webp", universidad: "Tecnológico de Monterrey"},
  {img: "assets/flags/BA-TE-AUTONOMA-MEXICO.webp", universidad: "UNAM"},
  {img: "assets/flags/BA-TE-SEA.webp", universidad: "SAE-México"},
  {img: "assets/flags/BA-TE-CATOLICA-CHILE.webp", universidad: "Pontificia Universidad Catolica de Chile"},
  {img: "assets/Universidades/Universidad-de-Palermo.png", universidad: "Universidad de Palermo"},
  {img: "assets/Universidades/universidad-autónoma-metropolitana.png", universidad: "Universidad Autónoma Metropolitana"},
  {img: "assets/flags/BA-TE-NACIONAL.webp", universidad: "Universidad Nacional de Colombia"},
  {img: "assets/Universidades/Pontificia-Universidad-Católica-del-Perú.png", universidad: "Pontificia Universidad Catolica de Peru"},
];

const universidadesImagenes = [
  {img: "assets/flags/BA-TE-DUKE.webp", universidad: "Duke University"},
  {img: "assets/flags/BA-TE-YALE.webp", universidad: "Yale University"},
  {img: "assets/flags/BA-TE-STANFORD.webp", universidad: "Stanford University"},
  {img: "assets/flags/BA-TE-VIRGINIA.webp", universidad: "University of Virginia"},
  {img: "assets/flags/BA-TE-WESLEYAN.webp", universidad: "Wesleyan University"},
  {img: "assets/Universidades/University-of-Maryland-College-Park.png", universidad: "University of Maryland, College Park"},
  {img: "assets/Universidades/university-of-minnesota.png", universidad: "University of Minnesota"},
  {img: "assets/Universidades/University-of-California,-Irvine.png", universidad: "University of California, Irvine"},
  {img: "assets/edx/Universidad de Washington.png", universidad: "Universidad de Washington"},
  {img: "assets/Universidades/university-of-minnesota.png", universidad: "University of Minnesota"},
  {img: "assets/Universidades/University-of-California,-Irvine.png", universidad: "University of California, Irvine"},
  {img: "assets/edx/Universidad de Washington.png", universidad: "Universidad de Washington"}
];

// Slider Component
const SliderWithDots = ({ 
  images = [], 
  itemsPerSection = 4, 
  handleBannerClick,
  showAllDots = false 
}) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { onTagSelect } = useCafam();

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
        setItemsToShow(3);
      } else {
        setItemsToShow(5);
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
                  
                    handleLogoClick(universidad.universidad); // Asegúrate de pasar el nombre correcto
                  
                }}
              >
                <div className="card-content">
                  <img 
                    src={universidad.img} 
                    alt={universidad.universidad} 
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
const UniversitiesSection = ({handleLogoClick}) => {
  const navigate = useNavigate();

  return (
    <div className='w-full'>
      <h2 className='text-white text-4xl text-center'>Aprende de las mejores universidades de Latinoamérica...</h2>
      <SliderWithDots 
        images={universidadesLatamImagenes} 
        handleLogoClick={(university) => handleLogoClick("Universidad", university)}
      />
      <h2 className='text-white text-4xl text-center'>y de todo el mundo</h2>
      <SliderWithDots
        images={universidadesImagenes}
        showAllDots={true}
        handleLogoClick={(university) => handleLogoClick("Universidad", university)}
      />
    </div>
  );
};

export default UniversitiesSection;