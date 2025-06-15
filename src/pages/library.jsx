import React, { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import tagFilterService from "../services/filterByTagsTesting";
import CertificationsList from "../components/layoutCertifications";
import SearchBar from "../components/searchBar";
import CertificationsFetcher from "../services/certificationsFetcher";
import { useDebounce } from "use-debounce";
import IndexCategories from "../components/IndexCategories";
import { Helmet } from "react-helmet";
import HeroSlider from "../components/HeroSlider";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from 'axios';

/**
 * Pagina de la biblioteca
 *  */
const authors = [
    {
      name: "Steve Jobs",
      image: "assets/content/sliders/slider-Steve-Jobs.png",
      link: "#",
      description: "Empresario, inventor y fundador de Apple."
    },{
      name: "Alexander turing",
      image: "assets/content/sliders/slider-Alexander-turing.png",
      link: "#",
      description: "Metematico, padre de la informatica moderna."
    },{
      name: "Sigmund Freud",
      image: "assets/content/sliders/slider-Sigmund-Freud.png",
      link: "#",
      description: "Neurólogo, padre del psicoanálisis y una de las figuras más influyentes del siglo XX."
    },{
      name: "Leonardo da Vinci",
      image: "assets/content/sliders/slider-Leonardo-da-Vinci.png",
      link: "#",
      description: "Pintor, Científico, Ingeniero, Anatomista."
    },{
      name: "Nikola Tesla",
      image: "assets/content/sliders/slider-Nikola-Tesla.png",
      link: "#",
      description: "Físico, ingeniero, matemático, mecánico e inventor visionario."
    },{
      name: "Marie Curie",
      image: "assets/content/sliders/slider-Marie-Curie.png",
      link: "#",
      description: "Científica, pionera, radioactividad, premio nobel en quimica y fisica."
    }
  ];



function LibraryPage({ showRoutes = true }) {  

  const location = useLocation();
  const [certifications, setCertifications] = useState([]);
  const [tempCertifications, setTempCertifications] = useState([]);
  const [selectedTags, setSelectedTags] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1025);
  const [debouncedSelectedTags] = useDebounce(selectedTags, 100);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });
  const certificationsRef = useRef(null);
  // Leer filtros desde la URL
  function parseQueryParams(queryString) {
    const params = new URLSearchParams(queryString);
    const tags = {};

    for (const [key, value] of params.entries()) {
      // Ignorar parámetros que no son filtros reales
      if (key === "page" || key === "page_size") continue;

      if (!tags[key]) tags[key] = [];
      tags[key].push(value);
    }

    return tags;
  }

  const loadLatestCertifications = async () => {
    
    try {
    setLoading(true); // ✅ Activa el estado de carga
      const response = await axios.get('https://backend-django-top-production.up.railway.app/api/latest-certifications/');
      console.log('Certificaciones recibidas:', response.data); // depuración
      setCertifications(response.data);
    } catch (error) {
      console.error('Error al cargar las certificaciones más recientes:', error);
    } finally {
      setLoading(false); // ✅ Desactiva la carga incluso si hay error
    }
  };

  const updateHistoryState = useCallback((tags, page = 1, pageSize = 16) => {
    const searchParams = new URLSearchParams();
    Object.entries(tags).forEach(([key, values]) => {
      values.forEach((val) => searchParams.append(key, val));
    });
    searchParams.set("page", page);
    searchParams.set("page_size", pageSize);
    window.history.pushState({}, "", `${location.pathname}?${searchParams.toString()}`);
  }, [location.pathname]);

  const removeTag = (category, tagToRemove) => {
  setSelectedTags((prevTags) => {
    const updatedTags = { ...prevTags };
      if (updatedTags[category]) {
        const filteredTags = updatedTags[category].filter(
          (tag) => tag !== tagToRemove
        );

        if (filteredTags.length === 0) {
          delete updatedTags[category];
        } else {
          updatedTags[category] = filteredTags;
        }
      }
    return updatedTags;
    });
  };

  const handleBannerClick = (category, tag) => {
    if (tag === "Nuevo en Top.education") {
      loadLatestCertifications();
    }
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };

      // Si la categoría no existe, inicialízala como array
      if (!updatedTags[category]) {
        updatedTags[category] = [];
      }

      // Agrega el tag si no está ya presente
      if (!updatedTags[category].includes(tag)) {
        updatedTags[category] = [...updatedTags[category], tag];
      }

      // Actualiza la URL con los nuevos filtros
      const queryString = tagFilterService.buildQueryString(updatedTags);
      const newUrl = `/explora/filter/${queryString}`;
      window.history.pushState({}, "", newUrl);

      // Carga las certificaciones filtradas desde la página 1
      loadCertifications(1, 16, updatedTags);

      return updatedTags;
    });
  };

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
          setTempCertifications(fetchData.results);
          setPagination({
            count: fetchData.count || 0,
            current_page: page,
            total_pages: Math.ceil(fetchData.count / pageSize) || 1,
          });
        } else {
          setTempCertifications([]);
        }
      } catch (error) {
        setError("Error al cargar certificaciones");
        setTempCertifications([]);
      } finally {
        setLoading(false);
      }
  },
    [debouncedSelectedTags]
  );

  // Carga inicial desde la URL
  useEffect(() => {
    window.scrollTo(0,0);
    const filtersFromURL = parseQueryParams(location.search);
    const pageFromURL = parseInt(new URLSearchParams(location.search).get("page")) || 1;
    const pageSizeFromURL = parseInt(new URLSearchParams(location.search).get("page_size")) || 16;

    setSelectedTags(filtersFromURL); // ← esto garantiza que .container-tags se actualice
    loadCertifications(pageFromURL, pageSizeFromURL, filtersFromURL);
  }, []);

// Carga cuando cambian los filtros (resetea a página 1)
  useEffect(() => {
    updateHistoryState(debouncedSelectedTags, 1); // ⬅ siempre reinicia desde página 1 al aplicar filtros nuevos
    loadCertifications(1, 16, debouncedSelectedTags);
  }, [debouncedSelectedTags]);

  // Aplicar resultados temporales
  useEffect(() => {
    if (!loading) {
      setCertifications(tempCertifications);
    }
  }, [loading, tempCertifications]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages && !loading) {
      updateHistoryState(debouncedSelectedTags, newPage); // ⬅ actualiza la URL con filtros y nueva página
      loadCertifications(newPage, 16, debouncedSelectedTags); // ⬅ recarga resultados manteniendo los filtros
    }
  };

  const PaginationControls = () => {
    const { current_page, total_pages } = pagination;
     const getVisiblePages = () => {
      let start = Math.max(current_page - 2, 1);
      let end = Math.min(start + 4, total_pages);
      if (end - start < 4) {
        start = Math.max(end - 4, 1);
      }
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
       return pages;
    };
    const pages = getVisiblePages();
    const lastPageIncluded = pages.includes(total_pages);
    return (
      <div className="container-buttons-pagination gap-1">
        {loading ? (
          <div className="flex justify-center items-center w-full py-4">
            <svg
              className="animate-spin h-6 w-6 text-neutral-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="ml-2 text-neutral-700">Cargando...</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => handlePageChange(current_page - 1)}
              disabled={current_page === 1}
              className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
            >
              <FaChevronLeft />
            </button>

            {pages.map((page, idx) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${
                  page === current_page
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-200"
                } font-bold py-2 px-4 rounded-full`}
              >
                {page}
              </button>
            ))}

            {!lastPageIncluded && total_pages > 5 && (
              <>
                {pages[pages.length - 1] < total_pages - 1 && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => handlePageChange(total_pages)}
                  className="bg-neutral-50 text-neutral-700 hover:text-neutral-50 hover:bg-neutral-700 font-bold py-2 px-4 rounded-full"
                >
                  {total_pages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(current_page + 1)}
              disabled={current_page === total_pages}
              className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
            >
              <FaChevronRight />
              </button>
          </>
        )}
      </div>
    );
  };
  const NoResultsMessage = () => (
    <div className="no-results-container text-center py-10">
      <h3 className="text-lg font-semibold text-white mb-0 ">No se encontraron certificaciones en la búsqueda</h3>
      <p className="text-neutral-100 mt-[-20px]"> No hay resultados que coincidan con los filtros seleccionados.</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-face-id-error w-full" >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
        <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M9.5 15.05a3.5 3.5 0 0 1 5 0" />
      </svg>
      <button
      onClick={() => setSelectedTags({})}
        className="mt-4 bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
      >
      Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
    <Helmet>
      <title>Certificaciones | Top Education</title>
      <meta
        name="description"
        content="Explora más de 13,000 certificaciones de las mejores universidades y empresas líderes del mundo."
      />
      <meta property="og:title" content="Top Education | Aprende con edX, Coursera y MasterClass" />
    </Helmet>
    <SearchBar />
    <div className="cont-explora px-0 lg:px-10">
      <div className="wrapper-logo-platforms">
        <div className="wrapper-logos">
          <div className="container-logo" onClick={() => handleBannerClick("Plataforma", "Coursera")} >
            <img src="/assets/platforms/coursera-logo.png" />
          </div>
          <div className="container-logo" onClick={() => handleBannerClick("Plataforma", "EdX")} > 
            <img src="/assets/platforms/edx-logo.png" />
          </div>
          <div className="container-logo" onClick={() => handleBannerClick("Plataforma", "MasterClass")} >
            <img src="/assets/platforms/masterclass-logo.png" />
          </div>
          <div className="container-logo" onClick={() => handleBannerClick('Plataforma', 'Nuevo en Top.education')}>
            Nuevo en<span id="top">top.</span><span id="education">education</span>
          </div>
        </div>
      </div>
      {!isMobileView && (
        <IndexCategories 
          onTagSelect={(category, tag) => {
            setSelectedTags((prev) => {
              const updated = { ...prev };
              if (!updated[category]) updated[category] = [];
              if (!updated[category].includes(tag)) {
                updated[category].push(tag);
              }
              return updated;
            });
          }}
          selectedTags={selectedTags}
        />
      )}
      <div className="cont-filter">
        <div className="container-tags">
          {Object.keys(selectedTags).length === 0 || Object.values(selectedTags).every((tags) => tags.length === 0) ? (
            <p>Aún no has seleccionado tags</p>
          ) : (
            Object.entries(selectedTags).map(([category, tags], index) =>
              tags.map((tag, tagIndex) => (
                <div key={`${category}-${tagIndex}`} className="tag">
                  <span>{tag}</span>
                  <button onClick={() => removeTag(category, tag)} className="remove-tag-button" >x</button>
                </div>
              ))
            )
          )}
        </div>
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
      {showRoutes && (
        <section className="wrapper w-full">
          <div className="container m-auto pt-14 pb-2 xl:pt-7 lg:pt-7">
            <h2 className="text-white text-center text-5xl mb-1">¿Encontraste lo que estabas buscando?</h2>
            <p className="text-white text-center text-2xl">Quizás te interese explorar nuestras Rutas del Conocimiento, donde podrás seguir el camino de grandes figuras históricas y aprender de los mejores en cada campo. ¡Descubre cursos inspirados en Einstein, Da Vinci, Marie Curie y más!</p>
            <HeroSlider authors={authors} />
          </div>
        </section>
      )}
    </div>
    </>
  );
}

export default LibraryPage;
