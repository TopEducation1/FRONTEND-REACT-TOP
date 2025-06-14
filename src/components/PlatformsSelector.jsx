import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const PlatformsSelector = ({platforms}) => {
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [zoomOrigin, setZoomOrigin] = useState(null);
    const [isZooming, setIsZooming] = useState(false);
    const navigate = useNavigate();

    const handleClick = (platform, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setIsZooming(true);

        setTimeout(() => {
            setSelectedPlatform(platform);
            setIsZooming(false); // Oculta el círculo después de la animación
        }, 800);
    };


    const handleItemMenuClick = (category, tag) => {
        const initialTags = {
            [category]: [tag]
        };

        const queryParams = new URLSearchParams({
            page: 1,
            page_size: 15,
            [category]: tag
        }).toString();

        navigate(`/explora/filter?${queryParams}`, {
            replace: true,
            state: { selectedTags: initialTags },
            
        });
        };


  return (
    <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 w-full">
      {platforms.map((platform, index) => (
        <div
          key={index}
          className="topic-circle"
          onClick={(e) => handleClick(platform, e)}
        >
          <div className="topic-cont-img">
            <img className='topic-img-f' src={`${platform.img}`} alt={platform.name}/>
            <img className='topic-img-b' src={`${platform.img}`} alt={platform.name}/>
          </div>
          <span className="category-name">{platform.name}</span>
        </div>
      ))}
        {isZooming && zoomOrigin && (
        <div
            className="zoom-circle"
            style={{
            left: `${zoomOrigin.x}px`,
            top: `${zoomOrigin.y}px`
            }}
        />
        )}


      {selectedPlatform && (
        <div className="popup-overlay" onClick={() => setSelectedPlatform(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPlatform.img} alt={selectedPlatform.name} onClick={() => handleItemMenuClick(selectedPlatform.type, selectedPlatform.name)} className="popup-img" />
            <h3 className='text-4xl text-neutral-950'>{selectedPlatform.name}</h3>
            <p className='text-2xl text-neutral-950'>{selectedPlatform.description}</p>
            <div className="university-buttons">
              <div className="university-buttons">
                {selectedPlatform.universities.map((uni, i) => (
                    <button key={i} onClick={() => handleItemMenuClick(uni.type, uni.name)}
                    className="uni-card"
                    >
                        <img src={`${uni.img}`} alt={uni.name} className="uni-img" />
                        <span className='text-neutral-950'>{uni.name}</span>
                    </button>
                ))}
                </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformsSelector;
