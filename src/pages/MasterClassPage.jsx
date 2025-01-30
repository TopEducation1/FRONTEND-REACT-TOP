import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";
import YouTubePlayer from "../components/YoutubePlayer";
import { Helmet } from 'react-helmet';

const MasterclassCertificationPage = () => {
    // Estados de la pagina de certificacion
    const { id } = useParams();
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [countSkills, setSkillsCount] = useState(0);
    // Estado para manejar la posición del pop up
    const [positionPopUp, setPositionPopUp] = useState(false);
    // Estado para maneajr la visibilidad del contenedor del pop up responsive
    const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);

    useEffect(() => {

        const handleResize = () => {
            setPositionPopUp(window.innerWidth < 1200);
        }

        window.addEventListener('resize', handleResize);

        handleResize(); // Verifica el anchoo de la pagina

        return () => {
            window.removeEventListener('resize', handleResize);
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
                        <YouTubePlayer url={certification.video_certificacion.url} />
                    </div>
                    <div id="wrapper-button-view-more-masterclass">
                        <button
                        onClick={() => window.open(certification.url_certificacion_original, '_blank')}>Ver en la página oficial
                        </button>
                    </div>
                </div>
                <div className="about-area-masterclass" id="wrapper-no-gap-short-info-masterclass">
                    <div id="wrapper-short-info-masterclass">
                        <ul>
                        <li><strong>Categoría: </strong> {certification.tema_certificacion.nombre}</li>
                        <li><strong>Instructor: </strong>Lewis Hamilton</li>
                        <li><strong>Duración de la clase: </strong>{certification.tiempo_certificacion}</li>

                        </ul>
                    </div>
                </div>
                <div className="about-area-masterclass">

                    <div id="about-masterclass">
                        <h1>Acerca de esta clase</h1>
                        <p>{certification.experiencia_certificacion}</p>
                    </div>
                </div>
                <div className="about-area-masterclass" >
                    <div id="widgets-learning-masterclass">
                        <h1>Habilidades que obtendrás</h1>
                        <div id="wrapper-widgets-learning">
                            
                        {certification.aprendizaje_certificacion.map((item) => {
            // Dividimos el string usando el guión como separador
            const habilidades = item.nombre.split(' - ');
            
            // Creamos un div para cada habilidad
            return habilidades.map((habilidad, index) => (
                <div key={index} className="skill-item">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                    {habilidad}
                </div>
            ));
        })}
                        </div>
                    </div>
                </div>
                <div className="about-area-masterclass" id="wrapper-modules-masterclass">
    <div id="container-modules-detail" className="grid-main-info-section">
        {certification.contenido_certificacion.contenido_certificacion.reduce((modules, content, index) => {
            // Si el contenido está vacío (""), lo ignoramos
            if (content === "") return modules;
            
            // Si el contenido comienza con "Lección", es un título
            if (content.startsWith("Lección")) {
                modules.push({
                    index: modules.length,
                    titulo: content,
                    descripcion: certification.contenido_certificacion.contenido_certificacion[index + 1] || ""
                });
            }
            return modules;
        }, []).map((modulo, index) => {
            const isExpanded = expandedIndex === index;
            return (
                <div
                    key={index}
                    className={`module-card ${isExpanded ? 'expanded' : 'closed'}`}
                >
                    <div className="first-row">
                        <div className="wrapper-info">
                            <h2>{modulo.titulo}</h2>
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
                                    {modulo.descripcion}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
    </div>
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
            
          </div>
          

            <div id="promotion-wrapper-masterclass-certification">
            {visibleContainerPopUp && (
                positionPopUp ? (
                    // Posición dentro del contenedor responsive
                    <div id="container-pop-up-responsive">
                        <button onClick={hadleClickButtonPopUp} id="close-pop">
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
    )
        </>


        


)
};

    

export default MasterclassCertificationPage;