import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import masterclassGridFetcher from '../services/MasterclassGridFetcher';

const GridMasterclass = () => {

    const navigate = useNavigate();

    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ certifications, setCertifications] = useState([]);

    const amount = 6;
    const shuffledCertifications = [...certifications].sort(() => Math.random() - 0.5);

    const loadMasterclassData = useCallback( async() => {

        setLoading(true);

        try {

            const fetchData = await masterclassGridFetcher.getMasterclassGrid(amount);

            if (fetchData && Array.isArray(fetchData)) {

                setCertifications(fetchData);

                
            } else {
                setCertifications([]);
                setError('Invalid data form received')
            } 
        } catch (error) {

            setError('Error loading blogs');
            setCertifications([]);
        } finally  {

            setLoading(false);
        }
    }, []);

    useEffect(() => {

        loadMasterclassData();
    }, [loadMasterclassData]);


    const handleCertificationClick = (certification) => {

        try {

            if(!certification) {

                throw new Error("No certification data provided");
            }

            const path = `/certificacion/${certification.slug}`;
            navigate(path);
            
        } catch (error) {

            setError("Error al navegar hacia la certificación");
        }
    };


    if (!Array.isArray(certifications)) {

        return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;
    }

    return (
        <>
            <div className='wrapwrapper'>
                <div className='container m-auto py-[4.5rem] xl:!py-24 lg:!py-24 md:!py-24'>
                    <h2 className='text-white text-4xl'>Sigue explorando</h2>
                    <div className='grid grid-cols-3 gap-4 mt-5'>
                        {shuffledCertifications.map(certification => {
                            return (
                                <div
                                onClick={() => handleCertificationClick(certification)}
                                key={certification.id}
                                className="card">
                                    <img className='rounded-lg' src={certification.universidad_certificacion?.univ_img || certification.empresa_certificacion?.empr_img || certification.imagen_final} alt={certification.nombre} />
                                    <h2 className='text-white my-1 leading-[1.2em] text-[1.3rem] !font-[Lora]'>{certification.nombre}</h2>
                                </div>
                            )

                        })}
                    </div>
                    <a href="/explora" className='shadow-[0px_0px_10px_3px_#F6F4EF] bg-[#F6F4EF] block w-[350px] text-center m-auto mt-10 !text-[#1c1c1c] text-[1.3rem] z-[11] !py-2 !px-5 !rounded-full'>Ver más certificaciones</a> 
                </div>  
            </div>
        </>
    )
};

export default GridMasterclass;