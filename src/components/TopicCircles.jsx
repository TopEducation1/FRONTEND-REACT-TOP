import React from 'react';
import { useEffect, useState } from 'react';
import  { useNavigate } from 'react-router-dom';


const TopicCircles = ({ topic, image, tag, type }) => {

    const navigate = useNavigate();
    const handleTopicClick = (e) => {
        e.preventDefault();

        const initialTags = {
            [type]: [tag]
        };

        // Navegar a la biblioteca con los tags 
        const img = e.currentTarget.querySelector('.topic-circle img');
        img.classList.add('scale-animation'); // Añade la clase de animación
        
        
        setTimeout(()=>{navigate('/explora', {
            state: {selectedTags: initialTags},
            replace: true
        })}, 1000); // 5000 milisegundos = 5 segundos
    };
    const [style, setStyle] = useState({});

    useEffect(() => {
        const randomX = `${Math.floor(Math.random() * 200 - 100)}%`; // entre -100% y +100%
        const randomY = `${Math.floor(Math.random() * 200 - 100)}%`;

        setStyle({
        '--x': randomX,
        '--y': randomY,
        });
    }, []);

    return (
    <div class="topic-circle animated" onClick={handleTopicClick} style={style}>
        <div className='topic-cont-img'>
            <img className='topic-img-f' src={`assets/temas/${topic}-g.png`} alt={topic}/>
            <img className='topic-img-b' src={`assets/temas/${topic}.png`} alt={topic}/>
        </div>
        <span class="category-name">{topic}</span>
    </div>
    );
}

export default TopicCircles;

