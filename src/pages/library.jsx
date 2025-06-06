import React, { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
//import Universities from "../services/universitiesService";
import tagFilterService from "../services/filterByTagsTesting";
import CertificationsList from "../components/layoutCertifications";
import SearchBar from "../components/searchBar";
import CertificationsFetcher from "../services/certificationsFetcher";
import LatestInTopFetcher from "../services/LatestInTopFetcher";
import RoutesComponent from "../components/RoutesComponent";
import { useDebounce } from "use-debounce";
import IndexCategories from "../components/IndexCategories";
import SlidingMenuIndex from "../components/SlidingMenuIndex";
import { Helmet } from "react-helmet";
import HeroSlider from "../components/HeroSlider";


/**
 * Pagina de la biblioteca
 *  */
const authors = [
    {
      name: "Steve Jobs",
      image: "assets/SliderImages/6.png",
      link: "#",
      description: "Empresario, inventor y fundador de Apple."
    },{
      name: "Alexander turing",
      image: "assets/SliderImages/2.png",
      link: "#",
      description: "Metematico, padre de la informatica moderna."
    },{
      name: "Sigmund Freud",
      image: "assets/SliderImages/3.png",
      link: "#",
      description: "Neurólogo, padre del psicoanálisis y una de las figuras más influyentes del siglo XX."
    },{
      name: "Leonardo da Vinci",
      image: "assets/SliderImages/4.png",
      link: "#",
      description: "Pintor, Científico, Ingeniero, Anatomista."
    },{
      name: "Nikola Tesla",
      image: "assets/SliderImages/5.png",
      link: "#",
      description: "Físico, ingeniero, matemático, mecánico e inventor visionario."
    },{
      name: "Marie Curie",
      image: "assets/SliderImages/1.png",
      link: "#",
      description: "Científica, pionera, radioactividad, premio nobel en quimica y fisica."
    }
  ];

function LibraryPage({ showRoutes = true }) {
  const { isMenuOpen, closeIndexResponsiveMenu, openIndexResponsiveMenu } =
    useOutletContext();

  const [width, setWidth] = useState(window.innerWidth); // Tracks window width
  const [openSections, setOpenSections] = useState([]); // Tracks open filter sections
  const [selectedTags, setSelectedTags] = useState({}); // Stores selected filter tags
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1025); // Tracks mobile view state
  const [indexPosition, setIndexPosition] = useState(0); // Tracks index position
  const [filteredResults, setFilteredResults] = useState([]); // Stores filtered certifications
  const [certifications, setCertifications] = useState([]); // Stores all certifications
  const [tempCertifications, setTempCertifications] = useState([]); // Temporaly stores certifications
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Stores error state
  const [isSmallScreen, SetIsSmallScreen] = useState(false); // Tracks small screen state
  //const selectedTags = location.state?.selectedTags || {};
  const location = useLocation();
  const [debouncedSelectedTags] = useDebounce(
    selectedTags,
    100
  );
  //const location = useLocation();
  
  const certificationsRef = useRef(null);

  const NoResultsMessage = () => (
    <div className="no-results-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-face-id-error"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
        <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M9.5 15.05a3.5 3.5 0 0 1 5 0" />
      </svg>
      <h3>No se encontraron certificaciones</h3>
      <p>No hay resultados que coincidan con los filtros seleccionados.</p>
      <button
        onClick={() => setSelectedTags({})}
        className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
      >
        Limpiar filtros
      </button>
    </div>
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.selectedTags) {
      console.log("Incoming selected tags:", location.state.selectedTags);

      setSelectedTags(location.state.selectedTags);

      loadCertifications(1, 15, location.state.selectedTags);

      //window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Estados para la paginación
  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  const updateHistoryState = useCallback((tags) => {
    const queryString = tagFilterService.buildQueryString(tags);
    window.history.pushState({},"",
      tags && Object.keys(tags).length > 0
        ? `/explora/filter/${queryString}`
        : "/explora"
    );
  }, []);

  const loadCertifications = useCallback(
  async (page = 1, pageSize = 16, tags = debouncedSelectedTags) => {
    setLoading(true);
    setTempCertifications([]);
    try {
      let fetchData;
      if (Object.keys(tags).length > 0) {
        fetchData = await tagFilterService.filterByTags(tags, page, pageSize);
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
      setError("Error al cargar las certificaciones");
      setTempCertifications([]);
    } finally {
      setLoading(false);
    }
  },
  []
);


  useEffect(() => {
    updateHistoryState(debouncedSelectedTags);
    loadCertifications(1, 15, debouncedSelectedTags);
  }, [debouncedSelectedTags]);


  useEffect(() => {
    window.scrollTo(0,0);
    if (!loading) {
      setCertifications(tempCertifications);
    }
  }, [loading, tempCertifications]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages && !loading) {
      loadCertifications(newPage);
    }
  };

  const handleNewInTopClick = async () => {
    setLoading(true);

    try {
      const recentCertifications =
        await LatestInTopFetcher.getLatestCertifications();

      if (
        recentCertifications.results &&
        Array.isArray(recentCertifications.results)
      ) {
        setCertifications(recentCertifications.results);
        setPagination({
          count: recentCertifications.count || 0,
          current_page: page,
          total_pages: Math.ceil(recentCertifications.count / pageSize) || 1,
        });
      } else {
        console.log("No se encontraron certificaciones recientes");
        setCertifications([]);
      }
    } catch (error) {
      console.error("Error al cargar recientes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = (category, tag) => {
    console.log(category, tag);

    setSelectedTags((prevTags) => {
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
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
  
      // Si la categoría es "Universidad" o "Empresa", solo permite seleccionar uno
      if (category === "Universidad" || category === "Empresa") {
        if (updatedTags[category]) {
          updatedTags[category] = [];
        }
        // Agregar etiqueta
        updatedTags[category] = [tag];
      } else {
        if (!updatedTags[category]) {
          updatedTags[category] = [];
        }
        if (!updatedTags[category].includes(tag)) {
          updatedTags[category] = [...updatedTags[category], tag];
        }
      }
  
      return updatedTags;
    });
  };


  const removeTag = (category, tagToRemove) => {
    console.log("Removing tag:", category, tagToRemove); // Para debugging

    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };

      if (updatedTags[category]) {
        const filteredTags = updatedTags[category].filter(
          (tag) => tag !== tagToRemove
        );

        if (filteredTags.length === 0) {
          // Si no quedan tags en la categoría, la eliminamos
          delete updatedTags[category];
        } else {
          // Si quedan tags, actualizamos el array
          updatedTags[category] = filteredTags;
        }
      }

      return updatedTags;
    });
  };

  const PaginationControls = () => (
    <div className="container-buttons-pagination">
      <button
        className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
        onClick={() => handlePageChange(pagination.current_page - 1)}
        disabled={pagination.current_page === 1 || loading}
      >
        Anterior
      </button>
      <span style={{ padding: "0.5rem 15px" }}>
        Página {pagination.current_page} de {pagination.total_pages}
      </span>
      <button
        className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
        onClick={() => handlePageChange(pagination.current_page + 1)}
        disabled={pagination.current_page === pagination.total_pages || loading}
      >
        Siguiente
      </button>
    </div>
  );

  return (
    <>
    {/**SEO ELEMENTS WITH REACT -HELMET */}
    <Helmet>
      <title>Certificaciones | Top Education</title>
      <meta
        name="description"
        content="Explora más de 13,000 certificaciones de las mejores universidades y empresas líderes del mundo.   "
      />
      <meta
        property="og:title"
        content="Top Education | Aprende con edX, Coursera y MasterClass"
      />
      <meta name="author" content="Top Education" />
      <meta name="robots" content="index, follow" />
      <meta
        property="og:description"
        content="Explora más de 13,000 certificaciones de las mejores universidades y empresas líderes del mundo."
      />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="preLoad"></div>
    <SearchBar />
      
    <div className="cont-explora px-0 lg:px-10">
      <div className={`wrapper-logo-platforms ${
          isSmallScreen ? "small-screen" : ""
        }`}
      >
        <div className="wrapper-logos">
          <div
            className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "Coursera")}
          >
            <img src="assets/Plataformas/coursera-logo.png" />
          </div>
          <div
            className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "EdX")}
          >
            <img src="assets/Plataformas/edx-logo.png" />
          </div>
          <div
            className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "MasterClass")}
          >
            <img src="assets/Plataformas/masterclass-logo.png" />
          </div>
          <div className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "Nuevo en Top.education")}>Nuevo en<span id="top">top.</span><span id="education">education</span>
          </div>
        </div>
      </div>
      {!isMobileView && (
        <IndexCategories
          onTagSelect={handleTagClick}
          selectedTags={selectedTags}
        />
      )}
      <div className="cont-filter">
        <div className="container-tags">
          {Object.keys(selectedTags).length === 0 ||
          Object.values(selectedTags).every((tags) => tags.length === 0) ? (
            <p>Aún no has seleccionado tags</p>
          ) : (
            Object.entries(selectedTags).map(([category, tags], index) =>
              tags.map((tag, tagIndex) => (
                <div key={`${category}-${tagIndex}`} className="tag">
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(category, tag)}
                    className="remove-tag-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
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
              ))
            )
          )}
        </div>
        <div className="container-buttons-reponsive-index">
          <button id="button-filter" onClick={openIndexResponsiveMenu}>
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
          <SearchBar />
        </div>
        <SlidingMenuIndex onTagSelect={handleTagClick} />
        <div ref={certificationsRef} className="certifications-container">
          {loading ? (
            <div class="grid grid-cols-4 gap-4 p-5">
              <div class="mx-auto w-full rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full max-w-sm rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full max-w-sm rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mx-auto w-full rounded-md border border-gray-300 p-4">
                <div class="flex animate-pulse space-x-4">
                  <div class="size-10 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-gray-200"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div class="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : certifications.length === 0 ? (
            <NoResultsMessage />
          ) : (
            <CertificationsList certifications={certifications} />
          )}
          <PaginationControls />
        </div>
      </div>
    </div>
    {showRoutes && (
      <section className="wrapper ">
        <div className="container m-auto pt-14 pb-14 xl:pt-7 lg:pt-7 xl:pb-20 lg:pb-10 md:pb-10">
          <h2>¿Encontraste lo que estabas buscando?</h2>
          <p>Quizás te interese explorar nuestras Rutas del Conocimiento, donde podrás seguir el camino de grandes figuras históricas y aprender de los mejores en cada campo. ¡Descubre cursos inspirados en Einstein, Da Vinci, Marie Curie y más!</p>
          <HeroSlider authors={authors} />
        </div>
      </section>
    )}
    </>
  );
}

export default LibraryPage;
