import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CertificationsList = ({ certifications }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith('/') ? url : `/${url}`;
    };
    
    const handleImageError = (e) => {
        console.error('Error loading image:', e.target.src);
        e.target.style.opacity = '0.5';
        e.target.style.backgroundColor = '#f0f0f0';
    };

    const handleCertificationClick = (certification) => {

        if(certification) {
            const platformId = certification.plataforma_certificacion_id;

            if(platformId === 1) {
                navigate(`/certificacion/edx/${certification.id}`);
            } else if ( platformId === 2) {
                navigate(`/certificacion/coursera/${certification.id}`);
            } else {
                navigate(`/certificacion/${certification.id}`);
            }
        } else {
            console.log("nollega");
        }
    };

    // Función mejorada para obtener la imagen de la plataforma
    const getPlatformImage = (certification) => {
        if (certification.url_imagen_plataforma_certificacion) {
            return getImageUrl(certification.url_imagen_plataforma_certificacion);
        }

        // Mapa de IDs de plataforma a rutas de imagen
        const platformImages = {
            1: '/assets/Plataformas/Edx Mini logo.svg',
            2: '/assets/Plataformas/Coursera mini logo.png',
            3: '/assets/Plataformas/MasterClass logo mini.svg'
        };

        const platformId = certification.plataforma_certificacion_id;
        return platformImages[platformId] || '/images/platforms/default-platform.png';
    };


    return (
        <div className="wrapper-certifications">
            {certifications.map(certification => {
                const platformImage = getPlatformImage(certification);
                return (
                    <div
                        onClick={() => handleCertificationClick(certification)}
                        key={certification.id}
                        className='certification-card'
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="container-img-card">
                            <img
                                src={getImageUrl(certification.imagen_final)}
                                alt="imagen-certificacion"
                                onError={handleImageError}
                                style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    height: 'auto'
                                }}
                            />
                        </div>
                        <h3>{certification.nombre}</h3>
                        <div className="tag-platform">
                            <img
                                src={platformImage}
                                alt={`${certification.plataforma_certificacion?.nombre || 'platform'}-logo`}
                                onError={handleImageError}
                                style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    height: 'auto'
                                }}
                            />
                        </div>
                        <div className="tag-category">
                            {certification.tema_certificacion?.nombre || 'Sin categoría'}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CertificationsList;