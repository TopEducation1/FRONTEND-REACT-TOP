import React from 'react';
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

    return (
    <div class="topic-circle" onClick={handleTopicClick}>
        <div className='topic-cont-img'>
            <img className='topic-img-f' src={`assets/temas/${topic}-g.png`} alt={topic}/>
            <img className='topic-img-b' src={`assets/temas/${topic}.png`} alt={topic}/>
        </div>
        <span class="category-name">{topic}</span>
    </div>
    );
}

export default TopicCircles;

