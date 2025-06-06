import React, { useState } from 'react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const CertificationsListCafam = memo(({ certifications }) => {
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
    
    const getImageUrl = useCallback((url) => {
        if (!url) return null;
        return url.startsWith('/') ? url : `/${url}`;
    });

    if (!Array.isArray(certifications)) {
        return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;
    }
    if(certifications.length==0){
        return <h3 className='text-3xl'>Sin resultados</h3>
    }

    return (
        <>
        {error && <div className="error-message">{error}</div>}
        <div className="wrapper-certifications-plataform">
            {certifications.map(certification => {
                return (
                    <div
                        onClick={() => { handleCertificationClick(certification) }}
                        key={certification.id}
                        className="certification-card"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="container-img-card">
                            <img
                                src={getImageUrl(certification.universidad_certificacion?.univ_img || certification.empresa_certificacion?.empr_img || certification.imagen_final)}
                                alt="imagen-certificacion"
                                onError={handleImageError}
                                style={{
                                    
                                    display: 'block',
                                    maxWidth: '100%',
                                    height: 'auto'
                                }}
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
                                src={certification.plataforma_certificacion.plat_img}
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

export default CertificationsListCafam;