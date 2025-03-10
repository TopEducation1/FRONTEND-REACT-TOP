import React, { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
//import Universities from "../services/universitiesService";
import tagFilterService from "../services/filterByTagsTesting";
import CertificationsFetcher from "../services/certificationsFetcher";
import CertificationsList from "../components/layoutCertifications";
import SearchBar from "../components/searchBar";
import LatestInTopFetcher from "../services/LatestInTopFetcher";
import RoutesComponent from "../components/RoutesComponent";
import { useDebounce } from "use-debounce";
import IndexCategories from "../components/IndexCategories";
import IndexCategoriesCafam from "../components/cafam/IndexCategoriesCafam";
import SlidingMenuIndex from "../components/SlidingMenuIndex";
import { Helmet } from "react-helmet";

/**
 * Pagina de la biblioteca
 *  */

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
  const location = useLocation();
  const [debouncedSelectedTags] = useDebounce(
    selectedTags,
    100
  );
  const certificationsRef = useRef(null);



  useEffect(() => {

    window.scrollTo(0,0);
  }, []);

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
        className="clear-filters-button"
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

      loadCertifications(1, 16, location.state.selectedTags);

      window.history.replaceState({}, document.title);
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
    window.history.pushState(
      {},
      "",
      tags && Object.keys(tags).length > 0
        ? `/explora/filter/${queryString}`
        : "/explora"
    );
  }, []);

  const loadCertifications = useCallback(async (page = 1, pageSize = 16) => {
    setLoading(true);
    const abortController = new AbortController();

    try {
      const fetchData = await tagFilterService.filterByTags(debouncedSelectedTags, page, pageSize, {
        signal: abortController.signal,
      });

      if (fetchData && Array.isArray(fetchData.results)) {
        setCertifications(fetchData.results);
      } else {
        setCertifications([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setError("Error loading certifications");
      }
    } finally {
      setLoading(false);
    }

    return () => abortController.abort();
  }, [debouncedSelectedTags]);

  useEffect(() => {
    if (Object.keys(debouncedSelectedTags).length === 0) {
      setCertifications([]);
      setLoading(true);
      loadCertifications(1);
    } else {
      loadCertifications(1);
    }
  
    // Actualizar el estado de la URL
    updateHistoryState(debouncedSelectedTags);
  }, [debouncedSelectedTags]);
  

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
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
  
      // Si la categoría es "Universidad" o "Empresa", solo permite una selección
      if (category === "Universidad" || category === "Empresa") {
        // Si ya hay una etiqueta seleccionada en la categoría, la eliminamos
        if (updatedTags[category]) {
          updatedTags[category] = [];
        }
        // Agregamos la nueva etiqueta
        updatedTags[category] = [tag];
      } else {
        // Para otras categorías, permitimos múltiples selecciones
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
        onClick={() => handlePageChange(pagination.current_page - 1)}
        disabled={pagination.current_page === 1 || loading}
      >
        Anterior
      </button>
      <span style={{ padding: "0.5rem 15px" }}>
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
    const indexContainer = document.querySelector(".index-container");

    if (indexContainer) {
      setTimeout(() => {
        indexContainer.classList.add("moved-index-container");
      }, 1000);
    }
  }, []);



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
      <SearchBar />|
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
      <div
        id="container-logo-platforms"
        className={`wrapper-logo-platforms ${
          isSmallScreen ? "small-screen" : ""
        }`}
      >
        <div id="wrapper-logos">
          <div
            className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "Coursera")}
          >
            <img src="assets/Plataformas/Coursera mini logo.png" />
          </div>
          <div
            className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "EdX")}
          >
            <img src="assets/logos/edx-hover.png" />
          </div>
          <div
            className="container-logo"
            onClick={() => handleBannerClick("Plataforma", "MasterClass")}
          >
            <img src="assets/logos/masterclass-hover.png" />
          </div>
          <div className="container-logo">
            <img
              id="banner-new-on-top"
              onClick={handleNewInTopClick}
              src="assets/banners/Botón_Nuevo_en_Top_Education.svg"
            />
          </div>
        </div>
      </div>
      {!isMobileView && (
        <IndexCategories
          onTagSelect={handleTagClick}
          selectedTags={selectedTags}
        />
      )}
      <SlidingMenuIndex onTagSelect={handleTagClick} />
      <div ref={certificationsRef} className="certifications-container">
        {loading ? (
          <span class="loader"></span>
        ) : certifications.length === 0 ? (
          <NoResultsMessage />
        ) : (
          <CertificationsList certifications={certifications} />
        )}
        <PaginationControls />
      </div>
      {showRoutes && (
        <div className="container-routes-section">
          <RoutesComponent />
        </div>
      )}
    </>
  );
}

export default LibraryPage;
