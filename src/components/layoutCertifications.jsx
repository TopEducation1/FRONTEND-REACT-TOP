import React, { useState } from 'react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
// Uso de memo => Evita que el componente se renderice si sus props no cambian (Se usa para optimización al momento de cargar las certificaciones)
const CertificationsList = memo(({ certifications }) => {
    const navigate = useNavigate();
    
    function navigateWithTransition(path) {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
            navigate(path);
            });
        } else {
            navigate(path);
        }
    }
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
            let path  = `/certificacion/${certification.plataforma_certificacion.nombre.toLowerCase()}/${certification.slug}`;

            navigateWithTransition(path);
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Error al navegar a la certificación');
        }
    };

    
    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith('') ? url : `${url}`;
    };

    if (!Array.isArray(certifications)) {
        return <div className="error-message">Error: No se pudieron cargar las certificaciones</div>;
    }

   const dateValue = (c) => {
    const raw =
        c?.fecha_creado_cert;

    const t = raw ? new Date(raw).getTime() : NaN;

    // Si no hay fecha válida, se va al final
    return Number.isFinite(t) ? t : 0;
};

const sortedCertifications = [...certifications].sort(
    (a, b) => dateValue(b) - dateValue(a) // DESC = actuales → antiguos
);
    return (
        <>
            {error && <div className="error-message">{error}</div>}
            <div className="wrapper-certifications">
                {sortedCertifications.map(certification => {
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
                                        src={getImageUrl(certification.imagen_final || certification.universidad_certificacion?.univ_img|| certification.empresa_certificacion?.empr_img)}
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
                                <div className='flex'>
                                    <div className='tag-uem'>
                                        <img
                                            src={getImageUrl(certification.universidad_certificacion?.univ_img|| certification.empresa_certificacion?.empr_img)}
                                            alt="imagen-certificacion"
                                            onError={handleImageError}
                                        />
                                    </div>
                                    <div className="tag-platform">
                                        <img
                                            src={certification.plataforma_certificacion.plat_img}
                                            alt={certification.plataforma_certificacion.nombre}
                                            onError={handleImageError}
                                        />
                                    </div>
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
                            <div className="container-img-card min-h-[200px] !max-h-[200px] overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={getImageUrl(certification.imagen_final || certification.universidad_certificacion?.univ_img|| certification.empresa_certificacion?.empr_img)}
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
                            <div className='flex justify-between w-full items-end px-2 pb-3'>
                                    <div className="w-auto bg-neutral-200 flex items-center rounded-xl max-h-[30px] overflow-hidden"> 
                                        {(certification.universidad_certificacion?.univ_img ||
                                        certification.empresa_certificacion?.empr_img) && (
                                        <img
                                            className="max-w-[120px] max-h-[35px] w-full"
                                            src={getImageUrl(
                                            certification.universidad_certificacion?.univ_img ||
                                            certification.empresa_certificacion?.empr_img
                                            )}
                                            alt="imagen-certificacion"
                                            onError={handleImageError}
                                        />
                                        )}
                                    </div>
                                    <div className="w-auto bg-neutral-200 rounded-xl px-3 py-2">
                                        <img
                                         className='max-w-[80px] max-h-[20px]'
                                            src={certification.plataforma_certificacion.plat_img}
                                            alt={certification.plataforma_certificacion.nombre}
                                            onError={handleImageError}
                                        />
                                    </div>
                                </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
});


export default CertificationsList;