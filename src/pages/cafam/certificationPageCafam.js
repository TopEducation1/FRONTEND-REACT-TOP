import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import getCertificationById from "../../services/getCertificationById";
import InterestCertificationsFetcher from "../../services/cafam/interestCertificationsFetcher";
import CertificationSideBarCafam from "../../components/cafam/CertificationsSideBar";

const CertificationPageCafam = () => {
    // Estados de la pagina de certificacion
    const { slug } = useParams();
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [countSkills, setSkillsCount] = useState(0);
    
    // Estado para manejar la posición del pop up
    const [positionPopUp, setPositionPopUp] = useState(false);
    const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);
    const [certifications, setCertifications] = useState([]);

    // Resize effect to handle sidebar positioning
    useEffect(() => {
        const handleResize = () => {
            setPositionPopUp(window.innerWidth < 1200);
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Fetch certifications
    useEffect(() => {
        const fetchCertificationsCafam = async () => {
            try {
                const data = await InterestCertificationsFetcher.getCertifications(7);
                setCertifications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificationsCafam();
    }, []);

    // Load specific certification
    useEffect(() => {
        const loadCertification = async () => {
            try {
                setLoading(true);
                const data = await getCertificationById(slug);
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

        if (slug) {
            loadCertification();
        }
    }, [slug]);

    // Calculate skills rows
    useEffect(() => {
        if (certification && certification.habilidades_certificacion) {
            const rows = Math.ceil(certification.habilidades_certificacion.length / 4);
            setSkillsCount(rows);
        }
    }, [certification]);

    // Image URL helper
    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith('/') ? url : `/${url}`;
    };

    // Loading state
    if (loading) {
        return <span className="loader-search"></span>;
    }

    // Error state
    if (error) {
        return (
            <div className="container-main-info">
                <div>Error: {error}</div>
            </div>
        );
    }

    // No certification found
    if (!certification) {
        return (
            <div className="container-main-info-cafam">
                <div>No se encontró la certificación</div>
            </div>
        );
    }

    return (
        <div id="grid-main-content-cafam" className={`grid-layout-${positionPopUp ? 'mobile' : 'desktop'}`}>
            {/* Main certification information */}
            <div className="container-main-info-cafam">
                {/* Logo */}
                <div id="wrapper-logo-certification" className="grid-main-info-section">
                    <img src={getImageUrl(certification.url_imagen_universidad_certificacion)} alt="Logo de la certificación" />
                </div>

                {/* Name */}
                <div id="wrapper-name-certification" className="grid-main-info-section">
                    <h1>{certification.nombre}</h1>
                </div>

                {/* Short Description */}
                <div id="container-short-description" className="grid-main-info-section">
                    <p>{certification.metadescripcion_certificacion}</p>
                </div>

                {/* Original URL Button */}
                <div id="container-button-url-original-cafam" className="grid-main-info-section">
                    <button 
                        onClick={() => window.open(certification.url_certificacion_original, '_blank')} 
                        className="button-url-original-cafam"
                    >
                        Ver en la página oficial
                    </button>
                </div>

                {/* Instructors */}
                <div id="container-instructors" className="grid-main-info-section">
                    <h2><b>Instructor/es</b></h2>
                    <ul>
                        {certification.instructores_certificacion.map((instructor, index) => (
                            <li key={index}>{instructor.name}</li>
                        ))}
                    </ul>
                </div>

                {/* Fast Info Section */}
                <div id="container-fast-info" className="grid-main-info-section">
                    <div className="fast-info-cafam"><h3>Idioma</h3>{certification.lenguaje_certificacion}</div>
                    <div className="fast-info-cafam"><h3>Nivel</h3>{certification.nivel_certificacion}</div>
                    <div className="fast-info-cafam"><h3>Cronograma</h3>{certification.tiempo_certificacion}</div>
                </div>

                {/* Learning Outcomes */}
                {certification.aprendizaje_certificacion && !certification.aprendizaje_certificacion.some(aprendizaje => aprendizaje.nombre.startsWith('x')) && (
                    <div id="container-learning" className="grid-main-info-section">
                        <h2>¿Qué aprenderás?</h2>
                        <ul>
                            {certification.aprendizaje_certificacion?.map((aprendizaje, index) => (
                                !aprendizaje.nombre.startsWith(' ') ? 
                                    <li key={index}>{aprendizaje.nombre}</li> : 
                                    null
                            ))}
                        </ul>
                    </div>
                )}

                {/* Modules Section */}
                <div id="container-modules" className="grid-main-info-section">
                    <h2>{certification.contenido_certificacion.cantidad_modulos}</h2>
                    <p>{certification.contenido_certificacion.contenido_certificacion.join('\n')}</p>
                </div>

                {/* Skills Section */}
                {!certification.habilidades_certificacion.some(habilidad => habilidad.nombre.startsWith('x')) && (
                    <div id="container-skills" className="grid-main-info-section">
                        <h2>Habilidades que obtendrás</h2>
                        <div 
                            id="wrapper-tags-skills" 
                            style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(3, auto)", 
                                gridTemplateRows: `repeat(${countSkills}, auto)`, 
                                width: "100%", 
                                columnGap: "5px", 
                                rowGap: "10px" 
                            }}
                        >
                            {certification.habilidades_certificacion.map((habilidad, index) => (
                                <div className="skill-tag" key={index}>{habilidad.nombre}</div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modules Detail */}
                <div id="container-modules-detail" className="grid-main-info-section">
                    {certification.modulos_certificacion.map((modulo, index) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <div
                                key={index}
                                className={`module-card ${isExpanded ? 'expanded' : 'closed'}`}
                            >
                                <div className="first-row">
                                    <div className="wrapper-info">
                                        <h2>{modulo.titulo}</h2>
                                        <span>{modulo.duracion}</span>
                                        <span>Incluye: {modulo.incluye.join(" + ")}</span>
                                    </div>
                                    <div
                                        className="wrapper-row"
                                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 9l6 6l6 -6" />
                                        </svg>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="second-row">
                                        <div className="content-module-container">
                                            <div className="content-module">
                                                {modulo.contenido}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Areas of Knowledge */}
            <div id="container-areas-cafam">
                <div id="wrapper-title-areas-cafam"><h1>Explora áreas del conocimiento</h1></div>
                <div id="wrapper-show-areas-cafam">
                    <div className="area-circle-object">
                        <img src="/assets/Areas-Conocimiento/area-conocimiento-1.png" alt="Área de Conocimiento 1" />
                    </div>
                    <div className="area-circle-object">
                        <img src="/assets/Areas-Conocimiento/area-conocimiento-2.png" alt="Área de Conocimiento 2" />
                    </div>
                    <div className="area-circle-object">
                        <img src="/assets/Areas-Conocimiento/area-conocimiento-3.png" alt="Área de Conocimiento 3" />
                    </div>
                </div>
            </div>

            {/* Classes */}
            <div id="container-classes-cafam">
                <div id="wrapper-title-classes-cafam"><h1>Clases recomendadas para ti</h1></div>
                <div id="wrapper-slider-masterclass-cafam">
                    <div className="card-masterclass">
                        <img src="/assets/MasterClass/masterclass-1.png" alt="masterclass-imagen" />
                    </div>
                    <div className="card-masterclass">
                        <img src="/assets/MasterClass/masterclass-2.png" alt="masterclass-imagen" />
                    </div>
                    <div className="card-masterclass">
                        <img src="/assets/MasterClass/masterclass-3.png" alt="masterclass-imagen" />
                    </div>
                </div>
            </div>

            {/* Promotion Section */}
            <div id="container-promotion-cafam">
                <div id="promotion-grid-cafam">
                    <div className="div-grid-promotion" id="upper-left-div">
                        <img src="/assets/banners/promotion-banner.jpg" alt="Promotion Banner" />
                    </div>
                    <div className="div-grid-promotion" id="upper-right-div">
                        <h2>Con Top Education, ahorras dinero y tienes más contenidos</h2>
                        <p>Imagina tener acceso ilimitado al catalogo de edX, Masterclass, y Coursera, todo en una sola plataforma y por menos de la mitad del precio que pagarias por las tres plataformas.</p>
                    </div>
                    <div className="div-grid-promotion" id="bottom-div">
                        <button id="button-join-now-grid">¡Únete ahora!</button>
                    </div>
                </div>
            </div>

            {/* Sidebar Positioning Logic */}
            {positionPopUp ? (
                <div id="container-certifications-interest-mobile" className="certifications-sidebar-mobile">
                    <CertificationSideBarCafam certificationsCafam={certifications} />
                </div>
            ) : (
                <div id="wrapper-right-column">
                    <div id="container-certifications-interest-cafam">
                        <h2>Te puede interesar</h2>
                        <CertificationSideBarCafam certificationsCafam={certifications} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificationPageCafam;