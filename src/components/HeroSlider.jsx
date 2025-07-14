import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const HeroSlider = ({ authors }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Cambio automático cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % authors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [authors.length]);

  // Funciones de navegación manual
  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % authors.length);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + authors.length) % authors.length);
  };

  // ✅ Función para navegar con transición
  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };

  return (
    <div className="hero-container flex flex-wrap w-full mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] xl:!mt-0 items-center relative">
      {/* Slider con imágenes */}
      <div className="hero-slider flex w-12/12 relative justify-center items-center">
        {authors.map((author, index) => {
          const position =
            index === current
              ? "center"
              : index === (current + 1) % authors.length
              ? "right"
              : index === (current - 1 + authors.length) % authors.length
              ? "left"
              : "hidden";

          return (
            <div
              key={index}
              onClick={() => navigateWithTransition(author.link)}
              className={`slide-wrapper cursor-pointer ${position}`}
            >
              <img
                src={`/${author.image}`}
                alt={author.name}
                className={`slide ${position}`}
              />
              
            </div>
          );
        })}

        {/* Botones de navegación */}
        <button
          onClick={goToPrev}
          className="absolute left-[-50px] lg:left-4 top-1/2 transform -translate-y-1/2 bg-[#0F090B] bg-opacity-50 text-[#F6F4EF] px-4 py-2 rounded-full hover:bg-opacity-75 transition z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-0 lg:right-4 top-1/2 transform -translate-y-1/2 bg-[#0F090B] bg-opacity-50 text-[#F6F4EF] px-4 py-2 rounded-full hover:bg-opacity-75 transition z-10"
        >
          <FaChevronRight />
        </button>
      </div>
      {/* Texto del autor */}
      <div className="hero-text flex w-12/12  w-full flex-[0_0_auto] flex-wrap  mt-[0px] lg:!mt-[50px] xl:!mt-0 max-w-full text-center lg:text-left xl:text-left">
        <h2 className="!text-[2.2rem] !leading-[1.2em] !mb-5 md:mx-[-1.25rem] lg:mx-0 !mt-7 relative">
          ¿Qué hubiese aprendido<br></br>
          <span className="text-[#a8a8a8] top-italic !text-[4rem] mb-[-10px] flex mt-2 !leading-[1.2em]">{authors[current].name}</span> en 
          <span id="top">top</span><span id="education">.education</span>? 
        </h2>
          <p className="text-[#a8a8a8] text-[1.125rem] text-left">{authors[current].description}</p>
      </div>
      
    </div>
  );
};

export default HeroSlider;
