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

    const handleCertificationClick = (certificationId) => {
        if (certificationId) {
            navigate(`/certificacion/${certificationId}`);
        }
    };

    // Verify platform data is correctly loaded
    const getPlatformImage = (certification) => {
        if (!certification.url_imagen_plataforma_certificacion) {
            // Fallback logic based on platform ID
            const platformId = certification.plataforma_certificacion_id;
            switch(platformId) {
                case 1:
                    return '/path/to/edx-logo.png';
                case 2:
                    return '/path/to/coursera-logo.png';
                case 3:
                    return '/path/to/masterclass-logo.png';
                default:
                    return null;
            }
        }
        return getImageUrl(certification.url_imagen_plataforma_certificacion);
    };

    return (
        <div className="wrapper-certifications">
            {certifications.map(certification => {
                const platformImage = getPlatformImage(certification);
                
                return (
                    <div
                        onClick={() => handleCertificationClick(certification.id)}
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