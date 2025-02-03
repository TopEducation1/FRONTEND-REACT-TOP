import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";
import { Helmet } from 'react-helmet';

const CertificationPage = () => {
    // Estados de la pagina de certificacion
    const { slug } = useParams();
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

    const handleClickButtonPopUp = () => {

        setVisibleContainerPopUp(false);

    }

    useEffect(() => {
        const loadCertification = async () => {
            try {
                setLoading(true);
                const data = await getCertificationById(slug);
                setCertification(data);
                //console.log("INFORMACIÓN ESPECIFICA DE LA CERTIFICACION");
                //console.log(data);
            } catch (error) {
                setError(error.message);
                //console.error('Error al cargar la certificación:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadCertification();
        }
    }, [slug]);

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
        <>
           

            {/**SEO ELEMENTS WITH REACT -HELMET */}
            <Helmet>
                <title>{certification.nombre}</title>
                <meta name="description" content={certification.metadescripcion_certificacion}/>
                <meta property="og:title" content={certification.metadescripcion_certificacion}/>
                <meta name="keywords" content={certification.palabra_clave_certificacion}/>
                <meta name="author" content="Top Education"/>
                <meta name="robots" content="index, follow" />
                <meta property="og:description" content={certification.metadescripcion_certificacion} />
                <meta property="og:type" content="website" />
            </Helmet>



            <div id="grid-main-content">
            
                {/* Main certification information */}
                <div className="container-main-info">
                    <div id="wrapper-logo-certification" className="grid-main-info-section">
                        <img src={getImageUrl(certification.url_imagen_universidad_certificacion)} alt="Logo de la certificación" />
                    </div>
                    <div id="wrapper-name-certification" className="grid-main-info-section">
                        <h1>{certification.nombre}</h1>
                    </div>
                    <div id="container-short-description" className="grid-main-info-section">
                        <p>{certification.metadescripcion_certificacion}</p>
                    </div>
                    <div id="container-button-url-original" className="grid-main-info-section">
                        <button onClick={() => window.open(certification.url_certificacion_original, '_blank')} className="button-url-original">Ver en la página oficial</button>
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

                    {/* Fast info section */}
                    <div id="container-fast-info" className="grid-main-info-section">
                        <div className="fast-info"><h3>Idioma</h3>{certification.lenguaje_certificacion}</div>
                        <div className="fast-info"><h3>Nivel</h3>{certification.nivel_certificacion}</div>
                        <div className="fast-info"><h3>Cronograma</h3>{certification.tiempo_certificacion}</div>
                    </div>

                    {/* Learning outcomes */}
                    {certification.aprendizaje_certificacion && certification.aprendizaje_certificacion.some(aprendizaje => aprendizaje.nombre.startsWith('x')) ? null : (
                        <div id="container-learning" className="grid-main-info-section">
                            <h2>¿Qué aprenderás?</h2>
                            <ul>
                                {certification.aprendizaje_certificacion?.map((aprendizaje, index) => (
                                    aprendizaje.nombre.startsWith(' ') ? null : (<li key={index}>{aprendizaje.nombre}</li>)
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Modules section */}
                    <div id="container-modules" className="grid-main-info-section">
                        <h2>{certification.contenido_certificacion.cantidad_modulos}</h2>
                        <p>{certification.contenido_certificacion.contenido_certificacion.join('\n')}</p>
                    </div>

                    {/* Skills section */}
                    {certification.habilidades_certificacion.some(habilidad => habilidad.nombre.startsWith('x')) ? null : (
                        <div id="container-skills" className="grid-main-info-section">
                            <h2>Habilidades que obtendrás</h2>
                            <div id="wrapper-tags-skills" style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gridTemplateRows: `repeat(${countSkills}, auto)`, width: "100%", columnGap: "5px", rowGap: "10px", padding: "" }}>
                                {certification.habilidades_certificacion.map((habilidad, index) => (
                                    <div className="skill-tag" key={index}>{habilidad.nombre}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div id="container-modules-detail" className="grid-main-info-section">
                        {certification.modulos_certificacion.map((modulo, index) => {
                            const isExpanded = expandedIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`module-card ${isExpanded ? 'expanded' : 'closed'}`} // La clase `expanded` se aplica aquí al contenedor principal de la tarjeta
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

                <div id="container-areas">
                    <div id="wrapper-title-areas"><h1>Explora áreas del conocimiento</h1></div>

                    <div id="wrapper-show-areas">

                        <div className="area-circle-object">
                            <img src="/assets/Areas-Conocimiento/area-conocimiento-1.png" alt="Área de Conocimiento 1" />
                        </div>

                        <div className="area-circle-object">
                            <img src="/assets/Areas-Conocimiento/area-conocimiento-2.png" alt="Área de Conocimiento 1" />
                        </div>
                        <div className="area-circle-object">
                            <img src="/assets/Areas-Conocimiento/area-conocimiento-3.png" alt="Área de Conocimiento 1" />
                        </div>

                    </div>
                </div>


                <div id="container-classes">
                    <div id="wrapper-title-classes"><h1>Clases recomendadas para ti</h1></div>

                    <div id="wrapper-slider-masterclass">

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


                <div id="container-promotion">
                    <div id="promotion-grid">
                        <div className="div-grid-promotion" id="upper-left-div">
                            <img src="/assets/banners/promotion-banner.jpg" />
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


                <div id="wrapper-right-column">
            {visibleContainerPopUp && (
                positionPopUp ? (
                    // Posición dentro del contenedor responsive
                    <div id="container-pop-up-responsive">
                        <button onClick={handleClickButtonPopUp} id="close-pop">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M18 6l-12 12" />
                                <path d="M6 6l12 12" />
                            </svg>
                        </button>
                        <RightPop />
                    </div>
                ) : (
                    // Posición original
                    <RightPop />
                )
            )}
            </div>



            </div>



        </>
    );
};

export default CertificationPage;