import  { useNavigate } from 'react-router-dom';


const TopicCircles = ({ topic, image, tag }) => {

    const navigate = useNavigate();


    const handleTopicClick = (e) => {
        e.preventDefault();

        const initialTags = {
            "Tema": [tag]
        };

        navigate('/library', {
            state: {selectedTags: initialTags}
        });
    };



    return (
    <div class="topic-circle">
        <a href="https://www.top.education/certificaciones/habilidades/crecimiento-personal">
            <img src={image} alt={topic}/>
            <span class="category-name">{topic}</span>
        </a>
    </div>
    );
}

export default TopicCircles;