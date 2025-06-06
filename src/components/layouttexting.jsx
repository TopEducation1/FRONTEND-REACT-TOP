const CertificationsList = ({ certifications }) => {
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

        navigate('`/certificacion/$id=`')
    }

    return (
        <div className="wrapper-certifications">
            {certifications.length === 0 ? (
                <p>No hay certificaciones disponibles</p>
            ) : (
                certifications.map((certification) => {
                    const topicName = certification.tema_certificacion?.nombre || 'Sin categoría';
                    return (
                        <div
                            key={certification.id}
                            className="certification-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleCertificationClick(certification.id)}
                        >
                            <div className="container-img-card">
                                <img
                                    src={certification.universidad_certificacion?.univ_img || certification.empresa_certificacion?.empr_img || certification.imagen_final}
                                    alt="imagen-certificacion"
                                    onError={handleImageError}
                                    style={{
                                        display: 'block',
                                        maxWidth: '100%',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                            <div className="tags-card"><div className="tag-category" >{topicName}</div></div>
                            <h3>{certification.nombre}</h3>
                            <div className="tag-platform">
                                <img
                                    src={getImageUrl(certification.plataforma_certificacion.plat_img)}
                                    alt="platform-logo"
                                    onError={handleImageError}
                                    style={{
                                        display: 'block',
                                        maxWidth: '100%',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default CertificationsList;