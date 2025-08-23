import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageSlider3D = ({images,action}) => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

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
        console.log(category, tag);

      const categoryParam = category; // asegura que esté en minúsculas
      const tagParam = encodeURIComponent(tag); // codifica y pone en minúscula

      const query = `${categoryParam}=${tagParam}&page=1&page_size=15`;
      navigateWithTransition(`/${action}/filter?${query}`);
    };

    useEffect(() => {
        const interval = setInterval(() => {
        handleNext();
    }, 3000); // cambia cada 3 segundos
    return () => clearInterval(interval);
    }, [current]);
  
    const handleNext = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };
    
    const handlePrev = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };
    
    const getClass = (index) => {
        const diff = (index - current + images.length) % images.length;
        if (diff === 0) return "center";
        if (diff === 1 || diff === -images.length + 1) return "right";
        if (diff === 2 || diff === -images.length + 2) return "right-far";
        if (diff === 3 || diff === -images.length + 3) return "right-tre";
        if (diff === 4 || diff === -images.length + 4) return "right-fou";
        if (diff === images.length - 1) return "left";
        if (diff === images.length - 2) return "left-far";
        if (diff === images.length - 3) return "left-tre";
        if (diff === images.length - 4) return "left-fou";
        return "hidden";
    };

  return (
    <div className="slider-container">
        <button className="nav-button left-button bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full" onClick={handlePrev}><FaChevronLeft /></button>
      {images.map((image) => (
        <img
          key={image?.id}
          src={image?.src}
          alt={`slide-${image?.id}`}
          className={`slide ${getClass(image?.id)}`}
          onClick={() => handleItemMenuClick(image?.category, image?.link)}
        />
      ))}
      <button className="nav-button right-button bg-[#F6F4EF] hover:bg-[#F6F4EF]/70 text-[#0F090B] text-[1.8rem] lg:text-[2rem] px-4 py-1 lg:py-2 rounded-full" onClick={handleNext}><FaChevronRight /></button>
    </div>
  );
};

export default ImageSlider3D;
