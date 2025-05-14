import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import getCertificationById from "../services/getCertificationById";
import RightPop from "../components/RightPop";
import YouTubePlayer from "../components/YoutubePlayer";
import { Helmet } from 'react-helmet';

const CertificationPage = () => {
    // Estados de la pagina de certificacion
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('tab1');
    const [certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [countSkills, setSkillsCount] = useState(0);
    // Estado para manejar la posición del pop up
    const [positionPopUp, SetPositionPopUp] = useState(false);
    // Estado para maneajr la visibilidad del contenedor del pop up responsive
    const [visibleContainerPopUp, setVisibleContainerPopUp] = useState(true);
    const host = window.location.hostname;

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
        <div className="w-full bg-[#F8F7F2]">
            <div className="container  mx-auto py-25 md:py-50px lg:py-60px 2xl:py-100px ">
            {/*<span class="w-2/15 lg:w-2/15 aspect-square bg-gradient-to-tr from-red-500 to-red-900 absolute top-20 lg:left-20 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
            <span class="w-2/15 lg:w-2/15 aspect-square bg-gradient-to-tr from-green-500 to-green-900 absolute top-50 lg:right-20 rounded-full skew-y-0 blur-2xl opacity-40 skew-x-12 rotate-90" data-astro-source-loc="99:5"></span>
                 Main certification information */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-start-1 lg:col-span-8 space-y-[35px] pb-8 border-1 border-[#ECECEC] rounded-[15px] z-1">
                        <div className="container-main-info">
                            <div className="cert-int px-8 pt-8">
                                <h1 className="text-size-32 md:text-4xl mb-2 font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-10 md:leading-10 aos-init aos-animate">{certification.nombre}</h1>
                                <p className="text-sm md:text-lg text-contentColor dark:contentColor-dark mb-25px !leading-[1.2em] aos-init aos-animate">{certification.metadescripcion_certificacion}</p>
                                <div className="border-b border-[#E5E5E5] pb-[25px] flex xs:flex-wrap items-start gap-[60px] lg:gap-[40px] xs:gap-[20px] mt-5 mb-[20px]">
                                    <div className="flex w-2/8 items-start gap-[10px] border-l border-[#CDCDCD] first:border-none pl-[10px] first:pl-0">
                                        <div>
                                            <h6 className="font-bold text-edblue leading-[1.2]">Idioma:</h6>
                                            <p class="text-[14px] text-edgray leading-[1.1em]">{(certification.lenguaje_certificacion ==='NONE')?'Ingles (subtitulado: Español)':certification.lenguaje_certificacion}</p>
                                        </div>
                                    </div>
                                    {(certification.nivel_certificacion ==='NONE')? null :(
                                        <div className="flex w-3/8 items-start gap-[10px] border-l border-[#CDCDCD] first:border-none pl-[10px] first:pl-0">
                                        <div>
                                            <h6 className="font-bold text-edblue leading-[1.2]">Nivel:</h6>
                                            <p class="text-[14px] text-edgray leading-[1.1em]">{(certification.nivel_certificacion ==='NONE')?'No aplica':certification.nivel_certificacion}</p>
                                        </div>
                                    </div>
                                    )}
                                    <div className="flex w-3/8 items-center gap-[10px] border-l border-[#CDCDCD] first:border-none pl-[10px] first:pl-0">
                                        <div>
                                            <h6 className="font-bold text-edblue leading-[1.2]">Cronograma:</h6>
                                            <p class="text-[14px] text-edgray leading-[1.1em] ">{certification.tiempo_certificacion}</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            {(certification.plataforma_certificacion.nombre != 'MasterClass')?null:(
                                <div id="wrapper-video-masterclass" className="px-8 py-1">
                                    <YouTubePlayer url={certification.video_certificacion.url} />
                                </div>
                                
                             )}
                             <div className="nav-tab-wrapper px-8 py-5 w-full">
                                <ul id="tabs-nav" class="flex course-tab mb-8 w-auto">
                                    <li>
                                    <a className={`px-4 py-2 rounded ${activeTab === 'tab1' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setActiveTab('tab1')}>
                                    Descripción
                                    </a>
                                    </li>
                                    <li>
                                    <a className={`px-4 py-2 rounded ${activeTab === 'tab2' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setActiveTab('tab2')}>
                                    Habilidades
                                    </a>
                                    </li>
                                    <li>
                                    <a className={`px-4 py-2 rounded ${activeTab === 'tab3' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`} onClick={() => setActiveTab('tab3')}>
                                    Contenido
                                    </a>
                                    </li>
                                </ul>
                                <div className="w-full">
                                    {activeTab === 'tab1' && <div className="cert-cont w-full">
                                            <h2 className="text-size-32 md:text-3xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate">¿Qué aprenderás?</h2>
                                            {certification.aprendizaje_certificacion && certification.aprendizaje_certificacion.some(aprendizaje => aprendizaje.nombre.startsWith('x')) ? null : (<ul className="ml-10 mt-5 list-disc">
                                                {certification.aprendizaje_certificacion?.map((aprendizaje, index) => (
                                                    aprendizaje.nombre.startsWith(' ') ? null : (<li key={index}>{aprendizaje.nombre}</li>)
                                                ))}
                                            </ul>)}
                                        </div>
                                    }
                                    {activeTab === 'tab2' && <div id="widgets-learning-masterclass" className="w-full">
                                        <h2 className="text-size-32 md:text-3xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate my-5">Habilidades que obtendrás</h2>
                                            {(certification.plataforma_certificacion && certification.plataforma_certificacion.nombre == 'MasterClass')?( 
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
                                            ):(certification.habilidades_certificacion.some(habilidad => habilidad.nombre.startsWith('x'))) ? null : (
                                                <div id="wrapper-tags-skills" style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gridTemplateRows: `repeat(${countSkills}, auto)`, width: "100%", columnGap: "5px", rowGap: "10px", padding: "" }}>
                                                    {certification.habilidades_certificacion.map((habilidad, index) => (
                                                        <div className=" btn btn-col-1 font-bold py-2 px-4 rounded-full" key={index}>{habilidad.nombre}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    }
                                    {activeTab === 'tab3' && <div className="grid-main-info-section cert-habi w-full gap-5">
                                        <h2 className="text-size-32 md:text-3xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 mb-3 aos-init aos-animate">Contenido</h2>
                                        {(certification.contenido_certificacion && certification.plataforma_certificacion.nombre === 'MasterClass')?(
                                            certification.contenido_certificacion.contenido_certificacion.reduce((modules, content, index) => {
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
                                                        className={`module-card mb-3 ${isExpanded ? 'expanded' : 'closed'}`}
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
                                            })
                                        ):null}
                                        <br/>
                                        {(certification.contenido_certificacion && certification.plataforma_certificacion.nombre != 'MasterClass')?(
                                            certification.modulos_certificacion.map((modulo, index) => {
                                                const isExpanded = expandedIndex === index;
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`course-accrodain space-y-6 mb-3 module-card ${isExpanded ? 'expanded' : 'closed'}`} // La clase `expanded` se aplica aquí al contenedor principal de la tarjeta
                                                    >
                                                        <div className="first-row">
                                                            <div className="wrapper-info">
                                                                <h2 className="text-size-32 md:text-2xl font-bold">{modulo.titulo}</h2>
                                                                <span>{modulo.duracion}</span>
                                                                <span><b>Incluye:</b> {modulo.incluye.join(" + ")}</span>
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
                                            })
                                        ):null}
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-start-9 lg:col-span-4 br-15 border-1 border-[#ECECEC] rounded-[15px] z-1" >
                        <div className="cert-img">
                            <img src={getImageUrl(certification.url_imagen_universidad_certificacion)} alt="Logo de la certificación" />
                        </div>
                        <div className="cert-det p-5">
                            <div className="w-full flex justify-center">
                                <button onClick={() => window.open(certification.url_certificacion_original, '_blank')} className="btn btn-col-1 font-bold mt-[-40px] mb-2 py-2 px-4 rounded-full">Ver en la página oficial</button>
                            </div>
                            <ul class="list  ">
                                <li class=" flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                {(certification.instructores_certificacion && certification.instructores_certificacion.length > 0)?(
                                <div class="flex-1 space-x-3 flex">
                                    <img class="w-[30px] h-[30px]" src="/assets/temas/user-te.png" alt=""/>
                                    <div class=" text-blackflex flex-wrap"><b>Instructor/es:</b>
                                    <ul className="list-disc">
                                        {certification.instructores_certificacion.map((instructor, index) => (
                                            <li key={index}>{instructor.name}</li>
                                        ))}
                                    </ul>
                                    </div>
                                </div>):null}
                                <div class="flex-none">
                                    
                                </div>
                                </li>

                                <li class=" flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                <div class="flex-1 space-x-3 flex">
                                    <img src="assets/images/icon/file2.svg" alt=""/>
                                    <div class=" text-black font-semibold">Plataforma</div>
                                </div>
                                <div class="flex-none">
                                    <img class="w-[110px]"  src={`https://${host}/${certification.plataforma_certificacion.plat_img}`} alt=""/>
                                    
                                </div>
                                </li>

                                <li class=" flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                <div class="flex-1 space-x-3 flex">
                                    <img src="assets/images/icon/clock.svg" alt=""/>
                                    <div class=" text-black font-semibold">{(certification.plataforma_certificacion.nombre != 'MasterClass')?"Tema:":"Habilidad:"}</div>
                                </div>
                                <div class="flex-none">
                                    <div className={`tag-category ${certification.tema_certificacion?.tem_col || 'tag-verde'} mt-[15px]`}>{certification.tema_certificacion.nombre}</div>
                                </div>
                                </li>

                                {/*<li class=" flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                <div class="flex-1 space-x-3 flex">
                                    <img src="assets/images/icon/star.svg" alt=""/>
                                    <div class=" text-black font-semibold">Enrolled</div>
                                </div>
                                <div class="flex-none">
                                    2k Students
                                </div>
                                </li>

                                <li class=" flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                <div class="flex-1 space-x-3 flex">
                                    <img src="assets/images/icon/target.svg" alt=""/>
                                    <div class=" text-black font-semibold">Nivel</div>
                                </div>
                                <div class="flex-none">
                                    {certification.nivel_certificacion}
                                </div>
                                </li>*/}

                                <li class=" flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                <div class="flex-1 space-x-3 flex">
                                    <img src="assets/images/icon/web.svg" alt=""/>
                                    <div class=" text-black font-semibold">Idioma:</div>
                                </div>
                                <div class="flex-none">
                                    {(certification.lenguaje_certificacion ==='NONE')?'Ingles (subtitulado)':certification.lenguaje_certificacion}
                                </div>
                                </li>
                            </ul>
                        </div>
                    {visibleContainerPopUp && (
                        positionPopUp ? (
                            // Posición dentro del contenedor responsive
                            <div className="container-pop-up-responsive">
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
                        <div className="contenedor-promotion">
                            <div className="promotion-img">
                                <img src="/assets/banners/promotion-banner.jpg" />
                            </div>
                            <div className="promotion-text p-8">
                                <h2 className="text-size-24 md:text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate">Con Top Education, ahorras dinero y tienes más contenidos</h2>
                                <p className="text-center">Imagina tener acceso ilimitado al catalogo de edX, Masterclass, y Coursera, todo en una sola plataforma y por menos de la mitad del precio que pagarias por las tres plataformas.</p>
                                <button className="btn btn-col-2 font-bold py-2 px-4 rounded-full">¡Únete ahora!</button>
                            </div>
                        </div>
                        <div className="px-8 pb-8 w-full">
                            <h2 className="text-size-20 md:text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate">Explora áreas del conocimiento</h2>
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
                    </div>
                    <div className="lg:col-start-1 lg:col-span-12 border-1 border-[#ECECEC] rounded-[15px] bg-[#F6F4EF] p-8 z-1">
                        <h2 className="text-size-2xl md:text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-8 md:leading-8 aos-init aos-animate">Clases recomendadas para ti</h2>
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
                </div>
            </div>
            </div>
        </>
    );
};

export default CertificationPage;