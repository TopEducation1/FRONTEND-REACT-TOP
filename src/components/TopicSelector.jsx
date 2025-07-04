import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TopicSelector = ({topics}) => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [zoomOrigin, setZoomOrigin] = useState(null);
    const [isZooming, setIsZooming] = useState(false);
    const navigate = useNavigate();

    const handleClick = (topic, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setIsZooming(true);

        setTimeout(() => {
            setSelectedTopic(topic);
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
    <div className="grid grid-cols-3 lg:grid-cols-7 gap-4">
      {topics.map((topic, index) => (
        <div
          key={index}
          className="topic-circle"
          onClick={(e) => handleClick(topic, e)}
        >
          <div className="topic-cont-img">
            <img className='topic-img-f' src={`${topic.img}-g.png`} alt={topic.name}/>
            <img className='topic-img-b' src={`${topic.img}.png`} alt={topic.name}/>
          </div>
          <span className="category-name">{topic.name}</span>
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


      {selectedTopic && (
        <div className="popup-overlay" onClick={() => setSelectedTopic(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={`${selectedTopic.img}.png`} alt={selectedTopic.name} onClick={() => handleItemMenuClick(selectedTopic.type, selectedTopic.name)} className="popup-img" />
            <h3 className='text-4xl text-neutral-950'>{selectedTopic.name}</h3>
            <p className='text-2xl text-neutral-950'>{selectedTopic.description}</p>
            <div className="university-buttons">
              <div className="university-buttons">
                {selectedTopic.universities.map((uni, i) => (
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

export default TopicSelector;
