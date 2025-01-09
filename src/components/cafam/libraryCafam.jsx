import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import SkillsTags from "../../services/skillsService";
//import Universities from "../services/universitiesService";
import Topics from "../../services/topicService";
import tagFilterService from "../../services/filterByTagsTesting";
import CertificationsFetcher from "../../services/certificationsFetcher";
import CertificationsListCafam from "../../components/cafam/layoutCertificationsCafam";
import SearchBarCafam from "../../components/cafam/searchBarCafam";
import RoutesComponent from "../../components/RoutesComponent";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import IndexCategoriesCafam from "./IndexCategoriesCafam";
import IndexCategories from "../IndexCategories";
import Flags from "../Flags";

/**
 * Pagina de la biblioteca
 *  */

function LibraryPageCafam({ showRoutes = true,  }) {

    const [width, setWidth] = useState(window.innerWidth);           // Tracks window width
    const [isMenuOpen, setIsMenuOpen] = useState(false);            // Controls mobile menu visibility
    const [openSections, setOpenSections] = useState([]);           // Tracks open filter sections
    const [selectedTags, setSelectedTags] = useState({});           // Stores selected filter tags
    const [isMobileView, setIsMobileView] = useState(false);        // Tracks mobile view state
    const [indexPosition, setIndexPosition] = useState(0);          // Tracks index position
    const [filteredResults, setFilteredResults] = useState([]);     // Stores filtered certifications
    const [certifications, setCertifications] = useState([]);       // Stores all certifications
    const [tempCertifications, setTempCertifications] = useState([]);// Temporaly stores certifications
    const [loading, setLoading] = useState(true);                   // Tracks loading state
    const [error, setError] = useState(null);                       // Stores error state
    const [isSmallScreen, SetIsSmallScreen] = useState(false);      // Tracks small screen state
    const location = useLocation();
    const [debouncedSelectedTags] = useDebounce(selectedTags, 300);


    useEffect(() => {

        const handleRezise = () => {
            SetIsSmallScreen(window.innerWidth <= 1100);

        }

        window.addEventListener('resize', handleRezise);
        handleRezise(); // Verificar ancho de la pagina

        return () => {
            window.removeEventListener('resize', handleRezise);
        }
    }, []);

    // Estados para la paginación
    const [pagination, setPagination] = useState({
        count: 0,
        current_page: 1,
        total_pages: 1,
    });

    const updateHistoryState = useCallback((tags) => {
        const queryString = tagFilterService.buildQueryString(tags);
        window.history.pushState({}, '', tags && Object.keys(tags).length > 0 ? `/library/filter/${queryString}` : '/library');
    }, []);


    const loadCertifications = useCallback(async (page = 1, pageSize = 16) => {
        setLoading(true);
        setTempCertifications([]); 
        try {
            let fetchData;
            if (Object.keys(selectedTags).length > 0) {
                fetchData = await tagFilterService.filterByTags(debouncedSelectedTags, page, pageSize);
                const queryString = tagFilterService.buildQueryString(selectedTags);
            } else {
                fetchData = await CertificationsFetcher.getAllCertifications(page, pageSize);
            }

            if (fetchData && Array.isArray(fetchData.results)) {
                setTempCertifications(fetchData.results.length > 0 ? fetchData.results : []);
                setPagination({
                    count: fetchData.count || 0,
                    current_page: page,
                    total_pages: Math.ceil(fetchData.count / pageSize) || 1,
                });
            } else {
                setTempCertifications([]); 
            }
        } catch (error) {
            setError('Error al cargar las certificaciones');
            setTempCertifications([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSelectedTags]);

    useEffect(() => {
        updateHistoryState(debouncedSelectedTags);
        loadCertifications();
    }, [debouncedSelectedTags, loadCertifications]);

    useEffect(() => {
        if (!loading) {
            setCertifications(tempCertifications)
        }
    }, [loading, tempCertifications]);



    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages && !loading) {
            loadCertifications(newPage);
        }
    };

    const handleBannerClick = (category, tag) => {
        console.log("BANNER PRESIONADO");

        setSelectedTags(prevTags => {
            const updatedTags = { ...prevTags };
            const tagSet = new Set(updatedTags[category] || []);
            tagSet.add(tag);
            updatedTags[category] = [...tagSet];
            return updatedTags;
        });

        loadCertifications(1);

    };



/**
  * Maneja el clic en una etiqueta de filtro
  * @param {string} category - Categoría de la etiqueta
  * @param {string} tag - Etiqueta seleccionada
  */
    const handleTagClick = (category, tag) => {
        setSelectedTags(prevTags => {


            // Copiar el estado previo de los tags para no mutarlo
            const updatedTags = { ...prevTags };

            // Set a partir de la lista actual o una vacia
            const tagSet = new Set(updatedTags[category] || []);

            tagSet.add(tag);
            updatedTags[category] = [...tagSet];
            return updatedTags;

        });
    };


    const removeTag = (category, tagToRemove) => {
        setSelectedTags(prevTags => {
            const updatedTags = { ...prevTags };


            if (updatedTags[category]) {

                updatedTags[category] = updatedTags[category].filter(tag => tag !== tagToRemove);


                if (updatedTags[category].length === 0) {
                    delete updatedTags[category];  // Eliminamos la categoría si no quedan tags
                }
            }
            return updatedTags;
        })
    };



    const PaginationControls = () => (
        <div className="container-buttons-pagination-cafam">
            <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1 || loading}
            >
                Anterior
            </button>
            <span style={{ padding: '0.5rem 15px' }}>
                Página {pagination.current_page} de {pagination.total_pages}
            </span>
            <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages || loading}
            >
                Siguiente
            </button>
        </div>
    );


    // Ajustar el tamaño del contenedor del indice despues de un segundo
    useEffect(() => {

        const indexContainer = document.querySelector('.index-container');

        if (indexContainer) {
            setTimeout(() => {
                indexContainer.classList.add('moved-index-container');
            }, 1000)
        }
    }, []);



    // Definición del array sections para categorias de filtro
    const sections = [
        {
            title: "Tema",

            subsections: ["Arte y Humanidades", "Negocios", "Ciencias de la Computación", "Ciencias de Datos", "Tecnología de la información", "Salud", "Matemáticas y Logica", "Desarrollo Personal", "Ciencías, Física e Ingenieria", "Ciencias Sociales", "Aprendizaje de un Idioma"]
        },
        {
            title: "Plataforma",
            subsections: ["EdX", "Coursera", "MasterClass"]
        },
        {
            title: "Empresa",
            subsections: ["Capitals Coalition", "DeepLearning.AI", "Big Interview", "UBITS", "HubSpot Academy", "SV Academy", "Pathstream", "Salesforce", "The Museum of Moder Art", "Banco Interamericano de Desarrollo", "Yad Vashem", " Google", "Microsoft"]
        },
        {
            title: "Universidad",
            subsections: [
                {
                    title: "Oceania",
                    subsections: ["Macquarie University"]
                },
                {
                    title: "Europa",
                    subsections: ["IE Business School", "Universidad Autónoma de Barcelona", "Universidad Carlos III de Madrid"]
                },
                {
                    title: "Latinoamérica",
                    subsections: ["Universidad de chile", "Universidad Nacional de Colombia", "Tecnológico de Monterrey", "Pontificia Universidad Católica del Perú", "Universidad Nacional Autónoma de Mexico", "Universidad Anáhuac", "SAE Institute México", "Pontificia Universidad Católica de Chile", "Universidad de Palermo", "Universidad de los Andes", "Universidad Austral"]
                },
                {
                    title: "Norteamérica",
                    subsections: ["University of New Mexico", "Parsons School of Design, The New School", "University of Michigan", "University of Virginia", "University of Illinois Urbana-Champaign", "University of California, Irvine", "The University of North Carolina at Chapel Hill", "Northwestern University", "University of Colorado Boulder", "Wesleyan University", "California Institute of the Arts", "Duke University", "University of Pennsylvania", "Berklee college of music", "Columbia", "Harvard university", "Yale university", "Stanford"]
                }
            ]
        }
    ];

    /**
     * Abre el menu  del index responsive
     */

    const openIndexResponsiveMenu = () => {
        setIsMenuOpen(true);
    };


    /**
     * Cierre el menu index reponsive
     */
    const closeIndexResponsiveMenu = () => {
        setIsMenuOpen(false);
    };


    /**
     * Calcula el margen dinámico de una sección del menú de índice
     * @param {number} index - Índice de la sección
     * @returns {number} - Valor del margen
     */

    const calculateDynamicMargin = (index) => {
        const section = sections[index];
        const numSubsections = section.subsections.length;
        const baseMargin = 120;
        const marginPerItem = 50;
        return baseMargin + numSubsections * marginPerItem;
    };


    /**
     * Alterna la apertura de una sección del menú de índice
     * @param {number} index - Índice de la sección
     */

    const toggleSection = (index) => {
        setOpenSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const renderSubsections = (category, subsections) => {
        return subsections.map((subsection, subIndex) => {
            if (typeof subsection === "string") {
                return (
                    <div key={subIndex} style={{ marginBottom: 30 }}>
                        <Link
                            to="#"
                            className="subsection-link-cafam"
                            style ={{
                                color: '#0750A0'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTagClick(category, subsection);
                            }}
                        >
                            {subsection}
                        </Link>
                    </div>
                );
            } else if (subsection.title && subsection.subsections) {
                return (
                    <div key={subIndex} style={{ marginBottom: 30 }}>
                        <h3>{subsection.title}</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {subsection.subsections.map((subsubsection, subsubIndex) => (
                                <li key={subsubIndex} style={{ marginBottom: 30 }}>
                                    <Link
                                        to="#"
                                        className="subsection-link"
                                        style ={{
                                            color: '#0750A0'
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTagClick(category, subsubsection);
                                        }}
                                    >
                                        {subsubsection}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
            return null;
        });
    };




    return (
        <>
            <div className="title-category-cafam">
                <h2>Biblioteca</h2>
            </div>

            <div id="title-certifications-cafam">
                <h2>Explora Certificaciones</h2>
            </div>


            {!isMobileView && <SearchBarCafam />}
            |

            <div className="container-tags-cafam">
                {Object.keys(selectedTags).length === 0 || Object.values(selectedTags).every(tags => tags.length === 0) ? (
                    <p>Aún no has seleccionado tags.</p>
                ) : (
                    Object.entries(selectedTags).map(([category, tags], index) => (
                        tags.map((tag, tagIndex) => (
                            <div key={`${category}-${tagIndex}`} className="tag-cafam">
                                <span>{tag}</span>
                                <button onClick={() => removeTag(category, tag)} className="remove-tag-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M18 6l-12 12" />
                                        <path d="M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ))
                )}
            </div>


            <div className="container-buttons-reponsive-index">
                <button id="button-filter-cafam" onClick={openIndexResponsiveMenu}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#000000"
                        className="icon icon-tabler icons-tabler-filled icon-tabler-filter"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z" />
                    </svg>
                    <span>Filtrar</span>
                </button>
                {isMobileView && SearchBar}
            </div>

            <div className={`sliding-menu-index ${isMenuOpen ? 'open' : ''}`}>
                <button
                    className="btnclose-index-responsive-menu"
                    onClick={closeIndexResponsiveMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>


                


            </div>

            <IndexCategoriesCafam onTagSelect={handleTagClick} />


            <div
                id="container-logo-platforms-cafam"
                className={`wrapper-logo-platforms ${isSmallScreen ? 'small-screen' : ''
                    }`}
            >
                <div id="wrapper-logos">
                    <div className="container-logo" onClick={() => handleBannerClick("Plataforma", "Coursera")}>
                        <img src="assets/Plataformas/Coursera mini logo.png" />
                    </div>
                    <div className="container-logo" onClick={() => handleBannerClick("Plataforma", "edX")}>
                        <img src="assets/logos/edx-hover.png" />
                    </div>
                    <div className="container-logo" onClick={() => handleBannerClick("Plataforma", "MasterClass")}>
                        <img src="assets/logos/masterclass-hover.png" />
                    </div>
                </div>
                <div id="wrapper-new-courses">
                    <img src="assets/banners/Botón_Nuevo_en_Top_Education.svg" />
                </div>
            </div>

            <div className="certifications-container-cafam">
                {loading ? (
                    <span class="loader"></span>

                ) : (
                    <CertificationsListCafam certifications={certifications} />

                )}
                <PaginationControls />

            </div>

            {showRoutes && (

                <div className="container-routes-section">
                    <RoutesComponent />
                </div>
            )}



<div id="wrapper-industry-cafam">
                <div id="wrapper-title-industry-cafam">
                    <h1>Explora clases con los líderes de la industria</h1>
                </div>
                <Flags onFlagSelect={handleBannerClick}/>
            </div>
        </>
    );
}

export default LibraryPageCafam;