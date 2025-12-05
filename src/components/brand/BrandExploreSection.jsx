import React, { useState, useEffect, useCallback, useRef } from "react";
import tagFilterService from "../../services/filterByTagsTesting";
import BrandCertificationsList  from "../../components/brand/BrandCertificationsList";
import SearchBar from "../../components/searchBar";
import CertificationsFetcher from "../../services/certificationsFetcher";
import { useDebounce } from "use-debounce";
import IndexCategories from "../../components/IndexCategories";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

import endpoints from "../../config/api";

/**
 * Sección "Explora" reutilizable para Marca Blanca u otras páginas.
 *
 * Props:
 * - brandSlug?: string  (opcional, por si quieres filtrar por marca en tu API)
 * - title?: string      (texto opcional para el título de la sección)
 * - showPlatformBanner?: boolean (si quieres ocultar/mostrar los logos de plataformas)
 */
function BrandExploreSection({
  brandSlug = null,
  title = "Explora certificaciones",
  showPlatformBanner = true,
}) {
  const [certifications, setCertifications] = useState([]);
  const [tempCertifications, setTempCertifications] = useState([]);
  const [selectedTags, setSelectedTags] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [debouncedSelectedTags] = useDebounce(selectedTags, 100);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  const certificationsRef = useRef(null);

  // Cargar últimas certificaciones (cuando hacen click en "Nuevo en Top.education")
  const loadLatestCertifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoints.latest_certifications, {
        params: brandSlug ? { brand: brandSlug } : {},
      });
      setCertifications(response.data);
      setPagination({
        count: response.data.length || 0,
        current_page: 1,
        total_pages: 1,
      });
    } catch (error) {
      console.error("Error al cargar las certificaciones más recientes:", error);
    } finally {
      setLoading(false);
    }
  };

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

      if (!updatedTags[category]) {
        updatedTags[category] = [];
      }
      if (!updatedTags[category].includes(tag)) {
        updatedTags[category] = [...updatedTags[category], tag];
      }

      // Cargamos las certificaciones filtradas (página 1)
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

        // 👇 aquí podrías pasar brandSlug a tu servicio para filtrar por marca
        const extraParams = brandSlug ? { brand: brandSlug } : {};

        if (Object.keys(tags).length > 0) {
          fetchData = await tagFilterService.filterByTags(
            tags,
            page,
            pageSize,
            extraParams
          );
        } else {
          fetchData = await CertificationsFetcher.getAllCertifications(
            page,
            pageSize,
            extraParams
          );
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
          setPagination({
            count: 0,
            current_page: 1,
            total_pages: 1,
          });
        }
      } catch (error) {
        console.error(error);
        setError("Error al cargar certificaciones");
        setTempCertifications([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSelectedTags, brandSlug]
  );

  // Carga inicial (sin leer URL, todo interno al componente)
  useEffect(() => {
    loadCertifications(1, 16, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSlug]);

  // Carga cuando cambian los filtros (resetea a página 1)
  useEffect(() => {
    loadCertifications(1, 16, debouncedSelectedTags);
  }, [debouncedSelectedTags, loadCertifications]);

  // Aplicar resultados temporales
  useEffect(() => {
    if (!loading) {
      setCertifications(tempCertifications);
    }
  }, [loading, tempCertifications]);

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.total_pages &&
      !loading
    ) {
      loadCertifications(newPage, 16, debouncedSelectedTags);
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

            {pages.map((page) => (
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
      <h3 className="text-lg font-semibold text-white mb-0">
        No se encontraron certificaciones en la búsqueda
      </h3>
      <p className="text-neutral-100 mt-[-10px]">
        No hay resultados que coincidan con los filtros seleccionados.
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-face-id-error w-full"
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
      <button
        onClick={() => setSelectedTags({})}
        className="mt-4 bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <div className="brand-explore-section">
      {showPlatformBanner && (
        <div className="wrapper-logo-platforms">
          <div className="wrapper-logos flex justify-between">
            <div className="flex gap-3">
              <div
                className="container-logo"
                onClick={() => handleBannerClick("Plataforma", "Coursera")}
              >
                <img src="/assets/platforms/coursera-logo.png" alt="Coursera" />
              </div>
              <div
                className="container-logo"
                onClick={() => handleBannerClick("Plataforma", "EdX")}
              >
                <img src="/assets/platforms/edx-logo.png" alt="edX" />
              </div>
              <div
                className="container-logo"
                onClick={() =>
                  handleBannerClick("Plataforma", "MasterClass")
                }
              >
                <img
                  src="/assets/platforms/masterclass-logo.png"
                  alt="MasterClass"
                />
              </div>
            </div>
            <div
              className="container-logo"
              onClick={() =>
                handleBannerClick("Plataforma", "Nuevo en Top.education")
              }
            >
              Nuevo en<span id="top">top.</span>
              <span id="education">education</span>
            </div>
          </div>
        </div>
      )}

      <div className="cont-explora px-0 lg:px-10 ">
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

        <div className="!w-full bg-red">
          <div className="flex flex-wrap">
            <div className="container-tags">
              {Object.keys(selectedTags).length === 0 ||
              Object.values(selectedTags).every((tags) => tags.length === 0) ? (
                <p>Aún no has seleccionado tags</p>
              ) : (
                Object.entries(selectedTags).map(([category, tags]) =>
                  tags.map((tag, tagIndex) => (
                    <div key={`${category}-${tagIndex}`} className="tag">
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(category, tag)}
                        className="remove-tag-button"
                      >
                        x
                      </button>
                    </div>
                  ))
                )
              )}
            </div>
            <SearchBar />
          </div>

          <div ref={certificationsRef} className="certifications-container">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-5">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="mx-auto w-full rounded-md border border-gray-300 p-4"
                  >
                    <div className="flex animate-pulse space-x-4">
                      <div className="size-10 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 rounded bg-gray-200" />
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-2 rounded bg-gray-200" />
                            <div className="col-span-1 h-2 rounded bg-gray-200" />
                          </div>
                          <div className="h-2 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : certifications.length === 0 ? (
              <NoResultsMessage />
            ) : (
              <BrandCertificationsList  certifications={certifications} />
            )}

            <PaginationControls />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandExploreSection;
