import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import endpoints from "../config/api";

const VISIBLE_NEIGHBORS = 2; // cuántos a cada lado

const HeroSlider = () => {
  const [authors, setAuthors] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Cargar datos
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(endpoints.originalsSlider);
        if (!res.ok) throw new Error("Error al cargar los datos");
        const data = await res.json();
        setAuthors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Autoplay cada 6s (pausado durante animación para evitar “saltos”)
  useEffect(() => {
    if (authors.length === 0) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => safeNext(), 6000);
    return () => clearInterval(intervalRef.current);
  }, [authors, current]);

  const safeNext = () => {
    if (isAnimating || authors.length === 0) return;
    setIsAnimating(true);
    setCurrent((c) => (c + 1) % authors.length);
    setTimeout(() => setIsAnimating(false), 600); // igual a la duración de la animación
  };

  const safePrev = () => {
    if (isAnimating || authors.length === 0) return;
    setIsAnimating(true);
    setCurrent((c) => (c - 1 + authors.length) % authors.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToNext = () => {
    clearInterval(intervalRef.current);
    safeNext();
  };

  const goToPrev = () => {
    clearInterval(intervalRef.current);
    safePrev();
  };

  const HeroSliderSkeleton = () => {
    return (
      <div className="flex w-full flex-wrap items-center py-20">
        <div className="relative flex h-[50vh] w-[50%] items-center justify-center md:h-[60vh]">
          <div className="relative h-[450px] w-[620px] max-w-full animate-pulse">
            <div className="absolute left-1/2 top-0 z-20 h-[450px] w-[250px] -translate-x-1/2 rounded-[24px] bg-neutral-300 shadow-[0_20px_60px_rgba(0,0,0,0.12)]" />
            <div className="absolute left-[18%] top-[80px] h-[310px] w-[160px] rounded-[18px] bg-neutral-200" />
            <div className="absolute right-[18%] top-[80px] h-[310px] w-[160px] rounded-[18px] bg-neutral-200" />
          </div>

          <div className="absolute left-4 top-1/2 h-[54px] w-[54px] -translate-y-1/2 rounded-full bg-white shadow-[0_14px_45px_rgba(0,0,0,0.08)]" />
          <div className="absolute right-4 top-1/2 h-[54px] w-[54px] -translate-y-1/2 rounded-full bg-white shadow-[0_14px_45px_rgba(0,0,0,0.08)]" />
        </div>

        <div className="mt-10 w-[50%] animate-pulse text-center lg:mt-16 lg:text-left">
          <div className="mx-auto h-6 w-[260px] rounded-full bg-neutral-200 lg:mx-0 lg:ml-15" />
          <div className="mx-auto mt-4 h-16 w-[420px] max-w-[80%] rounded-full bg-neutral-300 lg:mx-0 lg:ml-15" />
          <div className="mx-auto mt-6 h-5 w-[520px] max-w-[80%] rounded-full bg-neutral-200 lg:mx-0 lg:ml-15" />
          <div className="mx-auto mt-3 h-5 w-[420px] max-w-[70%] rounded-full bg-neutral-200 lg:mx-0 lg:ml-15" />

          <div className="mt-8 flex justify-center gap-2 lg:justify-start lg:pl-15">
            <span className="h-[4px] w-[30px] rounded-full bg-[#1941cf]/40" />
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={index} className="h-[4px] w-[10px] rounded-full bg-neutral-300" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };

  if (authors.length === 0) {
    return <HeroSliderSkeleton />;
  }

  // Función para calcular el “offset circular” de cada item respecto al current
  const getOffset = (i) => {
    const n = authors.length;
    // offset en rango [-floor(n/2), +floor(n/2)]
    let off = (i - current + n) % n;
    if (off > n / 2) off -= n; // toma el camino corto por el otro lado
    return off;
  };

  // Geometría del carrusel
  const slideW = 350;    // ancho base para separación (ajusta a tu diseño)
  const depth = 240;     // profundidad (translateZ negativo manda hacia el fondo)
  const tilt = 12;       // grados de rotación Y por paso
  const gap = slideW * 0.50; // separación horizontal entre vecinos

  return (
  <div className="hero-container flex flex-wrap w-full mx-0 xl:!mt-0 items-center relative">
    <div className="hero-slider relative flex w-full justify-center items-center h-[50vh] md:h-[60vh]">
      <div
        className="relative w-full h-full flex justify-center items-center"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        {authors.map((author, i) => {
          const off = getOffset(i);
          const isVisible = Math.abs(off) <= VISIBLE_NEIGHBORS;

          let x, z;

          if (off > 0) {
            x = off * gap * 1.2;
            z = -Math.abs(off) * (depth * 0.8);
          } else {
            x = off * gap * 0.7;
            z = -Math.abs(off) * (depth * 1.2);
          }

          const rY = off * -tilt;
          const zIndex = 100 - Math.abs(off);
          const opacity = isVisible ? 1 : 0;
          const scale = off === 0 ? 1 : 0.9;

          return (
            <div
              key={author.id ?? author.slug ?? i}
              onClick={() => navigateWithTransition(`/originals/${author.slug}`)}
              className="absolute flex items-center justify-center cursor-pointer will-change-transform transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)]"
              style={{
                transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rY}deg) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: opacity ? "auto" : "none",
                width: "250px",
                height: "450px",
              }}
            >
              <img
                src={author.image}
                alt={author.name}
                className="w-full h-full object-cover rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:shadow-[0_25px_80px_rgba(0,0,0,0.22)] hover:scale-[1.02] transition-all duration-500"
              />
            </div>
          );
        })}
      </div>

      {/* Flecha izquierda - se conserva */}
      <button
        onClick={goToPrev}
        disabled={isAnimating}
        className="absolute left-[5px] md:left-[-50px] lg:left-4 top-[112%] lg:top-1/2 -translate-y-1/2 bg-white/90 text-[#0F090B] text-[1.4rem] lg:text-[1.1rem] h-[48px] w-[48px] lg:h-[54px] lg:w-[54px] flex items-center justify-center rounded-full border border-black/10 shadow-[0_14px_45px_rgba(0,0,0,0.08)] backdrop-blur-md hover:bg-[#111111] hover:text-white hover:scale-105 transition-all duration-300 z-20 disabled:opacity-40"
      >
        <FaChevronLeft />
      </button>

      {/* Flecha derecha - se conserva */}
      <button
        onClick={goToNext}
        disabled={isAnimating}
        className="absolute right-[65px] lg:right-4 top-[112%] lg:top-1/2 -translate-y-1/2 bg-white/90 text-[#0F090B] text-[1.4rem] lg:text-[1.1rem] h-[48px] w-[48px] lg:h-[54px] lg:w-[54px] flex items-center justify-center rounded-full border border-black/10 shadow-[0_14px_45px_rgba(0,0,0,0.08)] backdrop-blur-md hover:bg-[#111111] hover:text-white hover:scale-105 transition-all duration-300 z-20 disabled:opacity-40"
      >
        <FaChevronRight />
      </button>
    </div>

    <div className="hero-text flex w-full flex-wrap mt-10 lg:mt-16 max-w-full text-center lg:text-left">
      <div className="pl-0 lg:pl-15">
        <h2 className="!font-['Montserrat'] text-[#0F090B] text-[1.8rem] md:text-[1.5rem] !leading-[1.2em] !mb-5 !mt-7 relative">
          ¿Qué hubiese aprendido
          <br />
          <span className="font-te-it text-[#1941cf] text-[3.4rem] md:!text-[4rem] justify-center w-full md:justify-start flex mt-2 mb-[-10px] !leading-[1.05em]">
            {authors[current].name}
          </span>{" "}
          en <span id="top">top</span>
          <span id="education">.education</span>?
        </h2>

        <p className="font-['Montserrat'] text-[#0F090B]/70 text-[1.125rem] text-center md:text-left px-5 lg:px-0 pr-0 lg:pr-20 leading-[1.3em]">
          {authors[current].extr}
        </p>

        {/* Nueva navegación inferior tipo referencia */}
        <div className="mt-8 flex items-center justify-center lg:justify-start gap-1 px-5 lg:px-0">
          {authors.map((_, index) => {
            const isActive = index === current;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!isAnimating) setCurrent(index);
                }}
                className="group flex items-center justify-center transition-all duration-300"
                aria-label={`Ir al slide ${index + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-[4px] w-[30px] bg-[#1941cf]"
                      : "h-[4px] w-[10px] bg-neutral-300 group-hover:bg-[#1941cf]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};

export default HeroSlider;
