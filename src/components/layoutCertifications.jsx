import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CertificationsList = ({ certifications }) => {
    const navigate = useNavigate();
    // Estado para manejar la carga
    const [loading, setLoading] = useState(true);

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

    const handleCertificationClick = (certificationId) => {

        console.log(certificationId)
        if (certificationId) {
            navigate(`/certificacion/${certificationId}`);
        }
        
    }

    return (
        <div className="wrapper-certifications">
            {certifications.map(certification => {
                const topicName = certification.tema_certificacion?.nombre || 'Sin categoría';

                return (
                    <div
                        onClick={() => { handleCertificationClick(certification.id) }}
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
                        <div className="tag-category">{certification.tema_certificacion.nombre}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default CertificationsList;