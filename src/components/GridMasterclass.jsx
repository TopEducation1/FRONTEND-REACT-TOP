import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import masterclassGridFetcher from '../services/MasterclassGridFetcher';

const GridMasterclass = () => {

    const navigate = useNavigate();


    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ certifications, setCertifications] = useState([]);

    const AMOUNT = 3;

    const loadMasterclassData = useCallback( async() => {

        setLoading(true);

        try {

            const fetchData = await masterclassGridFetcher.getMasterclassGrid(AMOUNT);

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

            <div id="wrapper-masterclass-grid-3">

                <h1 id="title-masterclass-grid-3">Sigue explorando</h1>

                <div id="masterclass-grid-3">

                    {certifications.map(certification => {

                        const imageUrl =
                        `/${certification.url_imagen_universidad_certificacion}` ;
                        console.log(imageUrl);

                        return (

                            <div
                            onClick={() => handleCertificationClick(certification)}
                            key={certification.id}
                            className="masterclass-card-grid-3">
                                <img src={imageUrl} alt={certification.nombre} />
                                <h1>
                                    {certification.nombre}
                                </h1>
                            </div>
                        )

                    })}
                </div>

                    <a href="/explora"><button id="button-watch-more-masterclass-3">Ver más certificaciones</button></a>
                

            </div>

        </>
    )



};



export default GridMasterclass;