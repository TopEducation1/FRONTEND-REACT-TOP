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
    <div class="topic-circle">
        <a onClick={handleTopicClick} >
            <img src={image} alt={topic}/>
            <span class="category-name">{topic}</span>
        </a>
    </div>
    );
}

export default TopicCircles;

