import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageSlider3D = ({ images = [], action }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  function navigateWithTransition(path) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  }

  const handleItemMenuClick = (category, tag) => {
    if (!category || !tag || !action) return;

    const categoryParam = category;
    const tagParam = encodeURIComponent(tag);

    const query = `idioma=en&idioma=es&${categoryParam}=${tagParam}&page=1&page_size=15`;
    navigateWithTransition(`/${action}/filter?${query}`);
  };

  const handleNext = () => {
    if (safeImages.length === 0) return;
    setCurrent((prev) => (prev + 1) % safeImages.length);
  };

  const handlePrev = () => {
    if (safeImages.length === 0) return;
    setCurrent((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  useEffect(() => {
    if (safeImages.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [current, safeImages.length]);

  const getOffset = (index) => {
    const length = safeImages.length;
    let offset = (index - current + length) % length;

    if (offset > length / 2) {
      offset -= length;
    }

    return offset;
  };

  const getSlideStyle = (index) => {
    const offset = getOffset(index);
    const abs = Math.abs(offset);

    if (abs > 4) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "translateX(0px) translateZ(-520px) scale(0.65)",
        zIndex: 0,
      };
    }

    const direction = offset < 0 ? -1 : 1;

    const xMap = {
      0: 0,
      1: 145,
      2: 250,
      3: 335,
      4: 400,
    };

    const scaleMap = {
      0: 1,
      1: 0.88,
      2: 0.76,
      3: 0.66,
      4: 0.58,
    };

    const opacityMap = {
      0: 1,
      1: 0.82,
      2: 0.5,
      3: 0.25,
      4: 0.08,
    };

    const rotate = offset === 0 ? 0 : direction * -9;
    const z = abs * -110;

    return {
      opacity: opacityMap[abs],
      pointerEvents: abs <= 1 ? "auto" : "none",
      transform: `translateX(${direction * xMap[abs]}px) translateZ(${z}px) rotateY(${rotate}deg) scale(${scaleMap[abs]})`,
      zIndex: 50 - abs,
    };
  };

  if (safeImages.length === 0) return null;

  return (
    <div className="relative mx-auto flex h-[360px] w-full max-w-[760px] items-center justify-center overflow-hidden px-10 md:h-[430px] md:max-w-[900px]">
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {safeImages.map((image, index) => {
          const isActive = index === current;

          return (
            <button
              key={image?.id || `${image?.src}-${index}`}
              type="button"
              onClick={() => handleItemMenuClick(image?.category, image?.link)}
              className="
                absolute
                h-[260px]
                w-[120px]
                cursor-pointer
                rounded-[24px]
                outline-none
                transition-all
                duration-500
                ease-[cubic-bezier(.22,.61,.36,1)]
                md:h-[360px]
                md:w-[190px]
              "
              style={getSlideStyle(index)}
              aria-label={`Ver ${image?.link || "elemento"}`}
            >
              <span
                className={`
                  block
                  h-full
                  w-full
                  transition-all
                  duration-500
                `}
              >
                <img
                  src={image?.src}
                  alt={`slide-${image?.id || index}`}
                  className={`
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-[1.03]
                    ${
                      isActive
                        ? "shadow-0"
                        : "grayscale-[0.15]"
                    }
                  `}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handlePrev}
        className="
          absolute
          left-2
          top-1/2
          z-50
          flex
          h-[48px]
          w-[48px]
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-black/10
          bg-white/90
          text-[1rem]
          text-neutral-700
          shadow-[0_14px_45px_rgba(0,0,0,0.08)]
          backdrop-blur-md
          transition-all
          duration-300
          hover:scale-105
          hover:bg-[#111111]
          hover:text-white
          active:scale-95
          md:h-[54px]
          md:w-[54px]
        "
        aria-label="Anterior"
      >
        <FaChevronLeft />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="
          absolute
          right-2
          top-1/2
          z-50
          flex
          h-[48px]
          w-[48px]
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-black/10
          bg-white/90
          text-[1rem]
          text-neutral-700
          shadow-[0_14px_45px_rgba(0,0,0,0.08)]
          backdrop-blur-md
          transition-all
          duration-300
          hover:scale-105
          hover:bg-[#111111]
          hover:text-white
          active:scale-95
          md:h-[54px]
          md:w-[54px]
        "
        aria-label="Siguiente"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-2">
        {safeImages.map((_, index) => {
          const isActive = index === current;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className="group flex items-center justify-center"
              aria-label={`Ir al slide ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-[4px] w-[40px] bg-[#1941cf]"
                    : "h-[4px] w-[10px] bg-neutral-300 group-hover:bg-[#1941cf]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSlider3D;