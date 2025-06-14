import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const topics = [
  {
    name: 'Aprendizaje de idioma',
    type: 'Tema',
    img: 'assets/temas/Aprendizaje de idioma',
    description: 'Aprender un idioma expande tu universo cultural y profesional. Conecta a través del inglés, francés, alemán y más, cultivando habilidades de comunicación global.',
    universities: [
      {
        name: 'University of Michigan',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-University of Michigan.webp'
      },
      {
        name: 'Columbia University',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-Columbia University.webp'
      },
      {
        name: 'Universidad de los Andes',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-Universidad de los Andes.webp'
      }
    ]
  },
  {
    name: 'Arte y humanidades',
    img: 'assets/temas/Arte y humanidades',
    type: 'Tema',
    description: 'Explora la historia, la filosofía y el arte para entender el sentido humano. Aprende análisis crítico, historia del arte y pensamiento ético.',
    universities: [
      {
        name: 'Universidad Austral',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-Universidad Austral.webp'
      },
      {
        name: 'Yad Vashem',
        type: 'Empresa',
        img: 'assets/companies/icons/Yad Vashem.png'
      },
      {
        name: 'Berklee college of music',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-Berklee college of music.webp'
      }
    ]
  },{
    name: 'Ciencias de datos',
    type: 'Tema',
    img: 'assets/temas/Ciencias de datos',
    description: 'Descifra patrones y genera valor con la información. Domina herramientas como SQL, Python, Power BI y la lógica detrás de la ciencia de datos.',
    universities: [
      {
        name: 'UNAM',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-UNAM.webp'
      },
      {
        name: 'Google',
        type: 'Empresa',
        img: 'assets/companies/icons/Google.png'
      },
      {
        name: 'Universidad de los Andes',
        type: 'Universidad',
        img: 'assets/universities/icons/TE-Universidad de los Andes.webp'
      }
    ]
  },
];


const TopicSelector = () => {
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
    <div className="block-circles">
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
            <h3 className='text-3xl'>{selectedTopic.name}</h3>
            <p>{selectedTopic.description}</p>
            <div className="university-buttons">
              <div className="university-buttons">
                {selectedTopic.universities.map((uni, i) => (
                    <button key={i} onClick={() => handleItemMenuClick(uni.type, uni.name)}
                    className="uni-card"
                    >
                        <img src={`${uni.img}`} alt={uni.name} className="uni-img" />
                        <span>{uni.name}</span>
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
