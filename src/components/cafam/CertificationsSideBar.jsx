import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InterestCertificationsFetcher from "../../services/cafam/interestCertificationsFetcher";

const CertificationSideBarCafam  = ({ certificationsCafam }) => {


    const navigate = useNavigate();
    const [certifications, setCertifications] = useState([]);

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

        //console.log(certificationId)
        if (certificationId) {
            navigate(`/cafam/certificacion/${certificationId}`);
        }
        
    }


    


    return (
        <>
            <div id="wrapper-sideBar-certifications">
                {certificationsCafam.map(certification =>{

                    return (
                        <div
                            onClick={() => handleCertificationClick(certification.id)}
                            key={certification.id}
                            style = {{ cursor: "pointer"}}
                            className='certification-card-cafam'
                        >
                            <div className="container-img-card-cafam">
                                <img
                                    src={getImageUrl(certification.imagen_final)}
                                    alt="certificacion imagen"
                                    onError={handleImageError}
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                        height: "auto"
                                    }}
                                />
                            </div>
                            <h3>{certification.nombre}</h3>
                            <div className="tag-category-cafam">{certification.tema_certificacion.nombre}</div>
                        </div>
                    )
                })}
            </div>
        </>
    )



}

export default CertificationSideBarCafam;