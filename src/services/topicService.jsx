import React, { useEffect, useState } from 'react';
import { endpoints } from '../config/api';


const Topics = () => {

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect (() => {
        fetch(endpoints.temas)
        .then(response => {
            if(!response.ok) {
                throw new Error('BAD REQUEST');
            }

            return response.json();
    })

    .then(data => {
        setTopics(data);
        setLoading(false);
    })

    .catch(error => {
        setError(error.message);
        setLoading(false);
    });

},[]);

    if (loading) return <p>Cargando Temas...</p>;
    if (error) return <p>Error: {error}</p>;


    return (        
        <div className="wrapper-topics">
          <div className="topic-tag">
              <span>Temas</span>
          </div>
            {topics.map(topic => (
                <div key={topic.id} className='topic-tag'>                    
                        <span>{topic.topic_name}</span>
                </div>
            ))}        
        </div>
    );

    };

export default Topics;