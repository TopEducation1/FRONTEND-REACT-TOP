import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const ImageSlider3D = ({images,action}) => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    const handleItemMenuClick = (category, tag) => {
        console.log(category, tag);
  
        const initialTags = {
            [category]: [tag]
        };
        navigate(`/${action}/filter?page=1&page_size=15&`, {
            state: {selectedTags: initialTags},
            replace: true
        });
        // Redirigir a la página con los parámetros correspondientes
        //navigate(`/explora/filter/?category=${category}&tag=${tag}`);
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
        <button className="nav-button left-button" onClick={handlePrev}> ‹</button>
      {images.map((image) => (
        <img
          key={image?.id}
          src={image?.src}
          alt={`slide-${image?.id}`}
          className={`slide ${getClass(image?.id)}`}
          onClick={() => handleItemMenuClick(image?.category, image?.link)}
        />
      ))}
      <button className="nav-button right-button" onClick={handleNext}>›</button>
    </div>
  );
};

export default ImageSlider3D;
