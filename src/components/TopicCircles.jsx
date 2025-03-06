import  { useNavigate } from 'react-router-dom';


const TopicCircles = ({ topic, image, tag }) => {

    const navigate = useNavigate();


    const handleTopicClick = (e) => {
        e.preventDefault();

        const initialTags = {
            "Tema": [tag]
        };

        // Navegar a la biblioteca con los tags 
        navigate('/explora', {
            state: {selectedTags: initialTags},
            replace: true
        });


        // Evitar que nos lleve a la parte de abajo de la pagina
        window.scrollTo(0, 0);
    };



    return (
    <div class="topic-circle">
        <a onClick={handleTopicClick}>
            <img src={image} alt={topic}/>
            <span class="category-name">{topic}</span>
        </a>
    </div>
    );
}

export default TopicCircles;