import React, { useEffect, useState } from 'react';
import { endpoints } from '../config/api';

const Universities = () => {

    const [universities, setUniversities] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect (() => {
        fetch(endpoints.universidades)
        .then(response => {
            if(!response.ok) {
                throw new Error('BAD REQUEST');
            }

            return response.json();
    })

    .then(data => {
        setUniversities(data);
        setLoading(false);
    })

    .catch(error => {
        setError(error.message);
        setLoading(false);
    });

},[]);

    if (loading) return <p>Cargando Universidades...</p>;
    if (error) return <p>Error: {error}</p>;


    return (        
        <div className="wrapper-universities">
          <div className="university-tag">
              <span>Universidades</span>
          </div>
            {universities.map(university => (
                <div key={university.id} className='university-tag'>                    
                        <span>{university.university_name}</span>
                </div>
            ))}        
        </div>
    );

    };

export default Universities;