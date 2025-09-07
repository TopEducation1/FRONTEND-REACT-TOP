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
        const res = await fetch(endpoints.originals);
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

  const navigateWithTransition = (url) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(url));
    } else {
      navigate(url);
    }
  };

  if (authors.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-4">
        <svg
          className="animate-spin h-6 w-6 text-neutral-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="ml-2 text-neutral-700">Cargando...</span>
      </div>
    );
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
    <div className="hero-container flex flex-wrap w-full mx-[0px]  xl:!mt-0 items-center relative">
      {/* Slider con perspectiva para 3D */}
      <div className="hero-slider relative flex w-full justify-center items-center h-[50vh]">
        <div
          className="relative w-full h-full flex justify-center items-center"
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          {authors.map((author, i) => {
            const off = getOffset(i); // … -2, -1, 0, +1, +2 …
            const isVisible = Math.abs(off) <= VISIBLE_NEIGHBORS;

            // Posición 3D: los vecinos se van hacia el fondo y a los lados
            let x, z;
            if (off > 0) {
              // 👉 a la derecha: más visible
              x = off * gap * 1.2;   // más separado
              z = -Math.abs(off) * (depth * 0.8); // menos al fondo
            } else {
              // 👈 a la izquierda: menos visible
              x = off * gap * 0.7;   // más junto
              z = -Math.abs(off) * (depth * 1.2); // más al fondo
            }

            const rY = off * -tilt; // gira hacia el centro

            // z-index: más cerca (off=0) arriba
            const zIndex = 100 - Math.abs(off);
            const opacity = isVisible ? 1 : 0;
            const pointer = isVisible ? "auto" : "none";
            const scale = off === 0 ? 1 : 0.9;

            return (
              <div
                key={author.id ?? author.slug ?? i}
                onClick={() => navigateWithTransition(`/originals/${author.slug}`)}
                className="absolute will-change-transform transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] cursor-pointer"
                style={{
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rY}deg)`,
                  zIndex,
                  opacity,
                  pointerEvents: opacity ? "auto" : "none",
                  width: "250px",   // contenedor fijo ancho
                  height: "450px",  // contenedor fijo alto
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover rounded-xl hover:shadow-[0px_0px_20px_5px_#F6F4EF]"
                />
              </div>

            );
          })}
        </div>

        {/* Botones */}
        <button
          onClick={goToPrev}
          disabled={isAnimating}
          className="absolute left-[5px] md:left-[-50px] lg:left-4 top-[112%] lg:top-1/2 -translate-y-1/2 bg-[#F6F4EF] text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full hover:bg-opacity-75 transition z-10 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={goToNext}
          disabled={isAnimating}
          className="absolute right-[65px] lg:right-4 top-[112%] lg:top-1/2 -translate-y-1/2 bg-[#F6F4EF] text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full hover:bg-opacity-75 transition z-10 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Texto del autor */}
      <div className="hero-text flex w-full flex-wrap mt-[0px] lg:!mt-[50px] xl:!mt-0 max-w-full text-center lg:text-left xl:text-left">
        <div className="pl-0 lg:pl-15">
          <h2 className="text-[1.8rem] md:text-[2.2rem] !leading-[1.2em] !mb-5 !mt-7 relative">
            ¿Qué hubiese aprendido<br />
            <span className="text-[#a8a8a8] text-[2.5rem] justify-center w-full md:justify-start top-italic !text-[4rem] mb-[-10px] flex mt-2 !leading-[1.2em]">
              {authors[current].name}
            </span>{" "}
            en <span id="top">top</span>
            <span id="education">.education</span>?
          </h2>
          <p className="text-[#a8a8a8] text-[1.125rem] text-center md:text-left px-5 lg:px-0 pr-0 lg:pr-20">
            {authors[current].extr}
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default HeroSlider;
