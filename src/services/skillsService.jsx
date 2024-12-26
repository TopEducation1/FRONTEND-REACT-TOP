import React, { useEffect, useState } from 'react';
import { endpoints } from '../config/api';

const Skills = () => {

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        fetch(endpoints.habilidades)
            .then(response => {
                if (!response.ok) {
                    throw new Error('BAD REQUEST');
                }

                return response.json();
            })

            .then(data => {
                setSkills(data);
                setLoading(false);
            })

            .catch(error => {
                setError(error.message);
                setLoading(false);
            });

    }, []);

    if (loading) return <p>Cargando Habilidades...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div className="wrapper-skills">
            <div className="skill-tag">
                <span>Habilidades</span>
            </div>
            {skills.map(skill => (
                <div key={skill.id} className='skill-tag'>
                    <span>{skill.hability_name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                </div>
            ))}
        </div>
    );

};

export default Skills;