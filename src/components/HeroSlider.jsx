import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import endpoints from '../config/api';

const HeroSlider = () => {
  const [authors, setAuthors] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // 🚀 Llamada al endpoint al montar el componente
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch(endpoints.originals);
        if (!res.ok) throw new Error("Error al cargar los datos");
        const data = await res.json();
        setAuthors(data);
      } catch (error) {
        console.error("Error cargando autores:", error);
      }
    };
    fetchAuthors();
  }, []);

  // Cambio automático cada 6 segundos
  useEffect(() => {
    if (authors.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % authors.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [authors]);

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % authors.length);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + authors.length) % authors.length);
  };

  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };

  // Si aún no se han cargado datos
  if (authors.length === 0 ) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-4">
        <svg
          className="animate-spin h-6 w-6 text-neutral-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="hero-container flex flex-wrap w-full mx-[0px] xl:mx-[-35px] lg:mx-[-20px] xl:!mt-0 items-center relative ">
      {/* Slider con imágenes */}
      <div className="hero-slider flex w-12/12 relative justify-center items-center h-[50vh]">
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
              onClick={() => navigateWithTransition(`/originals/${author.slug}`)}
              className={`slide-wrapper cursor-pointer ${position}`}
            >
              <img
                src={`${author.image}`}
                alt={author.name}
                className={`slide hover:shadow-[0px_0px_20px_5px_#F6F4EF] ${position}`}
              />
            </div>
          );
        })}

        {/* Botones */}
        
        <button
          onClick={goToPrev}
          className="absolute left-[5px] md:left-[-50px] lg:left-4 top-[112%] lg:top-1/2 transform -translate-y-1/2 bg-[#F6F4EF] text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full hover:bg-opacity-75 transition z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-[65px] lg:right-4 top-[112%] lg:top-1/2 transform -translate-y-1/2 bg-[#F6F4EF] text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full hover:bg-opacity-75 transition z-10"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Texto del autor */}
      <div className="hero-text flex w-12/12 w-full flex-[0_0_auto] flex-wrap mt-[0px] lg:!mt-[50px] xl:!mt-0 max-w-full text-center lg:text-left xl:text-left">
        <h2 className="text-[1.8rem] md:text-[2.2rem] !leading-[1.2em] !mb-5 md:mx-[-1.25rem] lg:mx-0 !mt-7 relative">
          ¿Qué hubiese aprendido<br />
          <span className="text-[#a8a8a8] text-[2.5rem] justify-center w-full md:justify-start top-italic !text-[4rem] mb-[-10px] flex mt-2 !leading-[1.2em]">
            {authors[current].name}
          </span> en 
          <span id="top">top</span><span id="education">.education</span>? 
        </h2>
        <p className="text-[#a8a8a8] text-[1.125rem] text-center md:text-left">
          {authors[current].extr}
        </p>
      </div>
    </div>
  );
};

export default HeroSlider;
