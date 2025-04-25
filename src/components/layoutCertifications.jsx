import React, { useState } from 'react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';


// Uso de memo => Evita que el componente se renderice si sus props no cambian (Se usa para optimización al momento de cargar las certificaciones)


const CertificationsList = memo(({ certifications }) => {
    const navigate = useNavigate();
    const host = window.location.hostname;
    const [error, setError] = useState(null);

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

            let path;
            // Define the path based on the platform ID
            switch (certification.plataforma_certificacion_id) {
                case 1:
                    path = `/certificacion/edx/${certification.slug}`;
                    break;
                case 2:
                    path = `/certificacion/coursera/${certification.slug}`;
                    break;
                case 3:
                    path = `/certificacion/masterclass/${certification.slug}`;
                    break;
                default:
                    // Fallback to generic path if platform ID is not recognized
                    path = `/certificacion/${certification.slug}`;
            }

            navigate(path);
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Error al navegar a la certificación');
        }
    };

    const getImageUrl = useCallback((url) => {
        if (!url) return null;
        return url.startsWith('/') ? url : `/${url}`;
      }, []);
      
      const getPlatformImage = useCallback((certification) => {
        if (certification.url_imagen_plataforma_certificacion) {
          return getImageUrl(certification.url_imagen_plataforma_certificacion);
        }
        const platformImages = {
          1: '/assets/Plataformas/edx-logo.png',
          2: '/assets/Plataformas/coursera-logo.png',
          3: '/assets/Plataformas/masterclass-logo.png'
        };
        return platformImages[certification.plataforma_certificacion_id] || '/images/platforms/default-platform.png';
      }, []);

    if (!Array.isArray(certifications)) {
        return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;
    }

    return (
        <>
            {error && <div className="error-message">{error}</div>}
            
            <div className="wrapper-certifications">
                {certifications.map(certification => {
                    const platformImage = getPlatformImage(certification);

                    // Render a different card for masterclass
                    if (certification.plataforma_certificacion_id === 3) {
                        return (
                            <div
                                onClick={() => handleCertificationClick(certification)}
                                key={certification.id}
                                className="certification-card"
                            >
                                <div className="container-img-card">
                                    <img
                                        src={getImageUrl(certification.imagen_final)}
                                        alt="imagen-certificacion"
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="tags-card">
                                    <div className={`tag-category ${certification.tema_certificacion?.tem_col || 'tag-verde'}`}>
                                        {certification.tema_certificacion?.nombre || 'Sin categoría'}
                                    </div>
                                </div>
                                <div className="title-certification">
                                    <h3>{certification.nombre}</h3>
                                    <p className="masterclass-description">
                                        {certification.descripcion || ''}
                                    </p>
                                </div>
                                <div className="tag-platform">
                                    <img
                                        src={`http://${host}:3000/${certification.plataforma_certificacion.plat_img}`}
                                        alt={certification.plataforma_certificacion.nombre}
                                        onError={handleImageError}
                                    />
                                </div>
                            </div>
                        );
                    }

                    // Default card for other certifications
                    return (
                        <div
                            onClick={() => handleCertificationClick(certification)}
                            key={certification.id}
                            className="certification-card"
                        >
                            <div className="container-img-card">
                                <img
                                    src={getImageUrl(certification.imagen_final)}
                                    alt="imagen-certificacion"
                                    onError={handleImageError}
                                />
                            </div>
                            <div className="tags-card">
                                <div className={`tag-category ${certification.tema_certificacion?.tem_col || 'tag-verde'}`}>
                                    {certification.tema_certificacion?.nombre || 'Sin categoría'}
                                </div>
                            </div>
                            <div className="title-certification">
                                <h3>{certification.nombre}</h3>
                            </div>                              
                            <div className="tag-platform">
                                <img
                                    src={`http://${host}:3000/${certification.plataforma_certificacion.plat_img}`}
                                    alt={certification.plataforma_certificacion.nombre}
                                    onError={handleImageError}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
});

export default CertificationsList;