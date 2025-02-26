import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CertificationsListCCafam = ({ certifications }) => {
    const navigate = useNavigate();
    // Estado para manejar la carga
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith('/') ? url : `/${url}`;
    };
    
    const handleImageError = (e) => {
        console.error('Error loading image:', e.target.src);
        // Mantener la imagen pero con un estilo que indique error
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
                    path = `/cafam/certificacion/edx/${certification.slug}`;
                    break;
                case 2:
                    path = `/cafam/certificacion/coursera/${certification.slug}`;
                    break;
                case 3:
                    path = `/cafam/certificacion/masterclass/${certification.slug}`;
                    break;
                default:
                    // Fallback to generic path if platform ID is not recognized
                    path = `/cafam/certificacion/${certification.slug}`;
            }
    
            navigate(path);
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Error al navegar a la certificación');
        }
    };

    return (
        <div className="wrapper-certifications-cafam">
            {certifications.map(certification => {
                const topicName = certification.tema_certificacion?.nombre || 'Sin categoría';

                return (
                    <div
                        onClick={() => { handleCertificationClick(certification) }}
                        key={certification.id}
                        className='certification-card-cafam'
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="container-img-card-cafam">
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

                        <div id="container-title-certification-cafam">
                        <h3>{certification.nombre}</h3>
                        </div>
                        
                        <div id="container-tags-card-cafam">
                        <div className="tag-platform-cafam">
                            <img
                                src={getImageUrl(certification.url_imagen_plataforma_certificacion)}
                                alt="platform-logo" 
                                onError={handleImageError}
                                style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    height: 'auto'
                                }}
                            />
                        </div>
                        <div className="tag-category-cafam">{certification.tema_certificacion.nombre}</div>
                        </div>
                        
                    </div>
                );
            })}
        </div>
    );
};

export default CertificationsListCCafam;