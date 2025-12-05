import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import tagFilterService from "../../services/filterByTagsTesting";
import BrandCertificationsList from "../../components/brand/BrandCertificationsList";
import CertificationsFetcher from "../../services/certificationsFetcher";
import { useDebounce } from "use-debounce";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import IndexCategoriesBrand from "./IndexCategoriesBrand";

/**
 * Sección Explora para Marca Blanca
 *
 * Props:
 * - brandSlug?: string (opcional, para filtrar por marca en tus endpoints)
 */
function BrandExploreWhiteLabel({ brandSlug = null }) {
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

  const loadCertifications = useCallback(
    async (page = 1, pageSize = 16, tags = debouncedSelectedTags) => {
      setLoading(true);
      setTempCertifications([]);

      try {
        let fetchData;
        const extraParams = brandSlug ? { brand: brandSlug } : {};

        if (Object.keys(tags).length > 0) {
          // Ajusta tu servicio para aceptar extraParams si aún no lo hace
          fetchData = await tagFilterService.filterByTags(
            tags,
            page,
            pageSize,
            extraParams
          );
        } else {
          // Igual aquí: pásale extraParams a tu fetcher si quieres filtrar por marca
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
      } catch (err) {
        console.error(err);
        setError("Error al cargar certificaciones");
        setTempCertifications([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSelectedTags, brandSlug]
  );

  // Carga inicial
  useEffect(() => {
    loadCertifications(1, 16, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSlug]);

  // Carga cuando cambian los filtros
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

  const removeTag = (category, tagToRemove) => {
    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      if (updatedTags[category]) {
        const filtered = updatedTags[category].filter(
          (tag) => tag !== tagToRemove
        );
        if (!filtered.length) {
          delete updatedTags[category];
        } else {
          updatedTags[category] = filtered;
        }
      }
      return updatedTags;
    });
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
      <div className="container-buttons-pagination gap-1 mt-4">
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
              className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full disabled:opacity-40"
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
              className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full disabled:opacity-40"
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
    <div className="brand-explore-section cont-explora px-0 lg:px-10">
      {/* Menú superior de categorías (vertical dropdowns) */}
      <IndexCategoriesBrand
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

      <div className="cont-filter !mt-0 !w-full ">
        <div className="!flex flex-wrap gap-4 items-start w-full">
          <div className="container-tags !w-full">
            {Object.keys(selectedTags).length === 0 ||
            Object.values(selectedTags).every((tags) => tags.length === 0) ? (
              <p className="text-[16px]">Aún no has seleccionado tags</p>
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
        </div>

        <div ref={certificationsRef} className="certifications-container mt-4">
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
            <BrandCertificationsList certifications={certifications} />
          )}

          <PaginationControls />
        </div>
      </div>
    </div>
  );
}

export default BrandExploreWhiteLabel;
