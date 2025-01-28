import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";

const MasterClassCertificationPage = () => {
    // Estados de la pagina de certificacion
    const { id } = useParams();
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [countSkills, setSkillsCount] = useState(0);
    // Estado para manejar la posición del pop up
    const [positionPopUp, SetPositionPopUp] = useState(false);
    // Estado para maneajr la visibilidad del contenedor del pop up responsive
    const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);

    useEffect(() => {

        const handleRezise = () => {
            SetPositionPopUp(window.innerWidth < 1200);
        }

        window.addEventListener('resize', handleRezise);

        handleRezise(); // Verifica el anchoo de la pagina

        return () => {
            window.removeEventListener('resize', handleRezise);
        }

    }, []);

    const hadleClickButtonPopUp = () => {
        setVisibleContainerPopUp(false);

    }

    useEffect(() => {
        const loadCertification = async () => {
            try {
                setLoading(true);
                const data = await getCertificationById(id);
                setCertification(data);
                console.log("INFORMACIÓN ESPECIFICA DE LA CERTIFICACION");
                console.log(data);
            } catch (error) {
                setError(error.message);
                console.error('Error al cargar la certificación:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadCertification();
        }
    }, [id]);

    useEffect(() => {
        if (certification && certification.habilidades_certificacion) {
            const rows = Math.ceil(certification.habilidades_certificacion.length / 4);
            setSkillsCount(rows);
        }
    }, [certification]);

    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith('/') ? url : `/${url}`;
    };

    if (loading) {
        return <span className="loader-search"></span>;
    }

    if (error) {
        return (
            <div className="container-main-info">
                <div>Error: {error}</div>
            </div>
        );
    }

    

    if (!certification) {
        return (
            <div className="container-main-info">

                <div>No se encontró la certificación</div>
            </div>
        );
    }

    return (
        <div id="wrapper-full-content-masterclass" >

          <div id="content-masterclass-certification">
            <div id="about-masterclass-certification">
                <div  id="title-logo-masterclass" className="about-area-masterclass">
                    <div id="wrapper-logo-about-masterclass">
                        <img  src="/assets/logos/masterclass-hover.png" alt="logo-masterclass" />
                    </div>
                    <div id="wrapper-title-description-masterclass">
                        <h1>{certification.nombre}</h1>
                        <p>{certification.metadescripcion_certificacion}</p>
                    </div>
                </div>
                <div className="about-area-masterclass" id="wrapper-video-button-masterclass">
                    <div id="wrapper-video-masterclass">
                        <span>Video</span>
                    </div>
                    <div id="wrapper-button-view-more-masterclass">
                        <button>Ver en la página oficial
                        </button>
                    </div>
                </div>
                <div className="about-area-masterclass"></div>
                <div className="about-area-masterclass"></div>
                <div className="about-area-masterclass"></div>
                <div className="about-area-masterclass"></div>
                <div className="about-area-masterclass"></div>
            </div>
          </div>

            <div id="promotion-wrapper-masterclass-certification"></div>

        </div>
    )
};

export default MasterClassCertificationPage;