import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CertificationsList = ({ certifications }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

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
        try {
            if (!certification) {
                throw new Error('No certification data provided');
            }

            const platformId = certification.plataforma_certificacion_id;
            let path;

            switch (platformId) {
                case 1:
                    path = `/certificacion/edx/${certification.id}`;
                    break;
                case 2:
                    path = `/certificacion/coursera/${certification.id}`;
                    break;
                case 3:
                    path = `/certificacion/masterclass/${certification.id}`;
            }

            console.log('Navigating to:', path);
            navigate(path);
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Error al navegar a la certificación');
        }
    };

    const getPlatformImage = (certification) => {
        if (certification.url_imagen_plataforma_certificacion) {
            return getImageUrl(certification.url_imagen_plataforma_certificacion);
        }

        const platformImages = {
            1: '/assets/Plataformas/Edx Mini logo.png',
            2: '/assets/Plataformas/Coursera mini logo.png',
            3: '/assets/Plataformas/MasterClass logo mini.svg'
        };

        return platformImages[certification.plataforma_certificacion_id] || '/images/platforms/default-platform.png';
    };

    if (!Array.isArray(certifications)) {
        return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;
    }

    return (
        <>
            {error && <div className="error-message">{error}</div>}
            
            <div className="wrapper-certifications">
                {certifications.map(certification => {
                    const platformImage = getPlatformImage(certification);
                    
                    return (
                        <div
                            onClick={() => handleCertificationClick(certification)}
                            key={certification.id}
                            className="certification-card"
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

                            <div id="container-title-certification">
                            <h3>{certification.nombre}</h3>
                            </div>
                            
                            
                            <div id="container-tags-card">
                            
                            
                            <div className="tag-category">
                                {certification.tema_certificacion?.nombre || 'Sin categoría'}
                            </div>

                            <div className="tag-platform">
                                <img
                                    src={platformImage}
                                    alt={`${certification.plataforma_certificacion?.nombre || 'platform'}-logo`}
                                    onError={handleImageError}
                                    style={{
                                        display: 'block',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                            </div>
                            
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CertificationsList;