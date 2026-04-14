import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import tagFilterService from "../services/filterByTagsTesting";
import CertificationsList from "../components/layoutCertifications";
import SearchBar from "../components/searchBar";
import CertificationsFetcher from "../services/certificationsFetcher";
import { useDebounce } from "use-debounce";
import IndexCategories from "../components/IndexCategories";
import { Helmet } from "react-helmet";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import endpoints from "../config/api";

const DEFAULT_SELECTED_TAGS = {
  idioma: ["es", "en"],
};

function LibraryPage({ showRoutes = true }) {
  const location = useLocation();

  const [certifications, setCertifications] = useState([]);
  const [tempCertifications, setTempCertifications] = useState([]);
  const [selectedTags, setSelectedTags] = useState(DEFAULT_SELECTED_TAGS);
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [debouncedSelectedTags] = useDebounce(selectedTags, 100);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
  });

  const certificationsRef = useRef(null);
  const initialLoadRef = useRef(false);
  const isHydratingFromUrlRef = useRef(false);

  function normalizeCategoryKey(key) {
    const map = {
      Plataforma: "plataforma",
      Empresas: "empresas",
      Empresa: "empresas",
      Universidad: "universidades",
      Universidades: "universidades",
      Temas: "temas",
      Tema: "temas",
      Habilidades: "habilidades",
      Habilidad: "habilidades",
      Idioma: "idioma",
      idioma: "idioma",
      plataforma: "plataforma",
      empresas: "empresas",
      universidades: "universidades",
      temas: "temas",
      habilidades: "habilidades",
    };

    return map[key] || String(key).toLowerCase();
  }

  const normalizeSkillType = (value) => {
    const v = (value || "").toString().trim().toLowerCase();

    if (["tema", "category", "principal"].includes(v)) return "tema";
    if (["habilidad", "skill", "subskill", "secondary"].includes(v)) {
      return "habilidad";
    }

    return "";
  };

  const isSkillCategory = (category) => {
    const normalized = normalizeCategoryKey(category);
    return normalized === "temas" || normalized === "habilidades";
  };

  const isSkillActive = (item) => {
    return item?.estado === true || item?.estado === 1 || item?.estado === "1";
  };

  const getTagLabel = (tag) => {
    if (!tag) return "";
    if (typeof tag === "string" || typeof tag === "number") return String(tag);
    return tag.translate || tag.nombre || tag.slug || "";
  };

  const getTagUrlValue = (category, tag) => {
    if (!tag) return "";

    const normalizedCategory = normalizeCategoryKey(category);

    if (normalizedCategory === "temas" || normalizedCategory === "habilidades") {
      if (typeof tag === "object") return tag.slug || "";
      return String(tag).trim();
    }

    if (normalizedCategory === "idioma") {
      return typeof tag === "string" ? tag.trim() : "";
    }

    if (typeof tag === "object") {
      return tag.slug || tag.nombre || "";
    }

    return String(tag).trim();
  };

  const getQueryKey = (category) => {
    const normalizedCategory = normalizeCategoryKey(category);

    const map = {
      temas: "Tema",
      habilidades: "Habilidad",
      universidades: "Universidad",
      empresas: "Empresa",
      plataforma: "Plataforma",
      idioma: "idioma",
    };

    return map[normalizedCategory] || category;
  };

  const areTagsEqual = (category, a, b) => {
    const normalizedCategory = normalizeCategoryKey(category);

    if (normalizedCategory === "idioma") {
      return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
    }

    if (typeof a === "object" && typeof b === "object") {
      if (a?.slug && b?.slug) return a.slug === b.slug;
      if (a?.id && b?.id) return String(a.id) === String(b.id);
      return JSON.stringify(a) === JSON.stringify(b);
    }

    return a === b;
  };

  function parseQueryParams(queryString) {
    const params = new URLSearchParams(queryString);
    const tags = {};

    for (const [key, value] of params.entries()) {
      if (key === "page" || key === "page_size") continue;

      const normalizedKey = normalizeCategoryKey(key);
      if (!tags[normalizedKey]) tags[normalizedKey] = [];

      if (normalizedKey === "temas" || normalizedKey === "habilidades") {
        tags[normalizedKey].push({
          slug: value,
          nombre: "",
          translate: "",
        });
      } else {
        tags[normalizedKey].push(value);
      }
    }

    if (!tags.idioma || tags.idioma.length === 0) {
      tags.idioma = [...DEFAULT_SELECTED_TAGS.idioma];
    }

    return tags;
  }

  const normalizeTagsForCompare = useCallback((tags) => {
    const result = {};

    Object.entries(tags || {}).forEach(([category, values]) => {
      const normalizedCategory = normalizeCategoryKey(category);
      const normalizedValues = (values || [])
        .map((tag) => getTagUrlValue(normalizedCategory, tag))
        .filter(Boolean)
        .map((val) => String(val).trim())
        .sort();

      if (normalizedValues.length > 0) {
        result[normalizedCategory] = normalizedValues;
      }
    });

    return result;
  }, []);

  const areTagMapsEqualByUrlValues = useCallback(
    (a, b) => {
      const normA = normalizeTagsForCompare(a);
      const normB = normalizeTagsForCompare(b);

      const keysA = Object.keys(normA).sort();
      const keysB = Object.keys(normB).sort();

      if (keysA.length !== keysB.length) return false;

      for (let i = 0; i < keysA.length; i++) {
        if (keysA[i] !== keysB[i]) return false;

        const arrA = normA[keysA[i]] || [];
        const arrB = normB[keysA[i]] || [];

        if (arrA.length !== arrB.length) return false;

        for (let j = 0; j < arrA.length; j++) {
          if (arrA[j] !== arrB[j]) return false;
        }
      }

      return true;
    },
    [normalizeTagsForCompare]
  );

  const hydrateTagsFromCatalog = useCallback((tags, catalog) => {
    if (!tags) return { ...DEFAULT_SELECTED_TAGS };

    const hydrated = {};

    Object.entries(tags).forEach(([category, values]) => {
      const normalizedCategory = normalizeCategoryKey(category);

      hydrated[normalizedCategory] = (values || []).map((tag) => {
        if (!isSkillCategory(normalizedCategory)) return tag;

        const slug = typeof tag === "object" ? tag.slug : String(tag).trim();

        const matchedSkill = catalog.find((skill) => {
          const skillType = normalizeSkillType(skill.skill_type);

          if (normalizedCategory === "temas" && skillType !== "tema") {
            return false;
          }

          if (
            normalizedCategory === "habilidades" &&
            skillType !== "habilidad"
          ) {
            return false;
          }

          return String(skill.slug || "").trim() === slug;
        });

        if (!matchedSkill) {
          return typeof tag === "object"
            ? tag
            : { slug, nombre: "", translate: "" };
        }

        return {
          id: matchedSkill.id,
          nombre: matchedSkill.nombre,
          translate: matchedSkill.translate,
          slug: matchedSkill.slug,
          skill_type: matchedSkill.skill_type,
          parent: matchedSkill.parent ?? null,
        };
      });
    });

    if (!hydrated.idioma || hydrated.idioma.length === 0) {
      hydrated.idioma = [...DEFAULT_SELECTED_TAGS.idioma];
    }

    return hydrated;
  }, []);

  const loadSkillsCatalog = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.skills);
      const safeData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.results)
        ? response.data.results
        : [];

      const activeSkills = safeData.filter((item) => isSkillActive(item));
      setSkillsCatalog(activeSkills);
      return activeSkills;
    } catch (err) {
      console.error("Error cargando catálogo de skills:", err);
      setSkillsCatalog([]);
      return [];
    }
  }, []);

  const loadLatestCertifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(endpoints.latest_certifications);
      const rows = Array.isArray(response.data) ? response.data : [];

      setCertifications(rows);
      setTempCertifications(rows);
      setPagination({
        count: rows.length,
        current_page: 1,
        total_pages: 1,
      });
    } catch (err) {
      console.error("Error al cargar las certificaciones más recientes:", err);
      setError("Error al cargar las certificaciones más recientes");
    } finally {
      setLoading(false);
    }
  };

  const loadCertifications = useCallback(
    async (page = 1, pageSize = 16, tags = debouncedSelectedTags) => {
      setLoading(true);
      setError(null);
      setTempCertifications([]);

      try {
        let fetchData;

        if (Object.keys(tags || {}).length > 0) {
          fetchData = await tagFilterService.filterByTags(tags, page, pageSize);
        } else {
          fetchData = await CertificationsFetcher.getAllCertifications(
            page,
            pageSize
          );
        }

        if (fetchData && Array.isArray(fetchData.results)) {
          setTempCertifications(fetchData.results);
          setPagination({
            count: fetchData.count || 0,
            current_page: page,
            total_pages: Math.ceil((fetchData.count || 0) / pageSize) || 1,
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
        console.error("Error cargando certificaciones:", err);
        setError("Error al cargar certificaciones");
        setTempCertifications([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSelectedTags]
  );

  const updateHistoryState = useCallback(
    (tags, page = 1, pageSize = 16) => {
      const searchParams = new URLSearchParams();

      Object.entries(tags || {}).forEach(([key, values]) => {
        if (!Array.isArray(values)) return;

        values.forEach((val) => {
          const queryKey = getQueryKey(key);
          const queryValue = getTagUrlValue(key, val);

          if (queryValue) {
            searchParams.append(queryKey, queryValue);
          }
        });
      });

      searchParams.set("page", String(page));
      searchParams.set("page_size", String(pageSize));

      const query = searchParams.toString();
      const nextUrl = `${location.pathname}${query ? `?${query}` : ""}`;
      const currentUrl = `${location.pathname}${location.search || ""}`;

      if (nextUrl === currentUrl) return;

      window.history.pushState({}, "", nextUrl);
    },
    [location.pathname, location.search]
  );

  const applySelectedTags = useCallback((updater) => {
    setSelectedTags((prevTags) => {
      const nextTags =
        typeof updater === "function" ? updater(prevTags) : updater;

      return nextTags;
    });
  }, []);

  const addTag = useCallback(
    (category, tag) => {
      const normalizedCategory = normalizeCategoryKey(category);

      applySelectedTags((prevTags) => {
        const currentTags = prevTags[normalizedCategory] || [];

        const alreadyExists = currentTags.some((existingTag) =>
          areTagsEqual(normalizedCategory, existingTag, tag)
        );

        if (alreadyExists) return prevTags;

        return {
          ...prevTags,
          [normalizedCategory]: [...currentTags, tag],
        };
      });
    },
    [applySelectedTags]
  );

  const removeTag = useCallback(
    (category, tagToRemove) => {
      const normalizedCategory = normalizeCategoryKey(category);

      applySelectedTags((prevTags) => {
        const updatedTags = { ...prevTags };

        if (updatedTags[normalizedCategory]) {
          const filteredTags = updatedTags[normalizedCategory].filter(
            (tag) => !areTagsEqual(normalizedCategory, tag, tagToRemove)
          );

          if (filteredTags.length === 0) {
            if (normalizedCategory === "idioma") {
              updatedTags[normalizedCategory] = [];
            } else {
              delete updatedTags[normalizedCategory];
            }
          } else {
            updatedTags[normalizedCategory] = filteredTags;
          }
        }

        return updatedTags;
      });
    },
    [applySelectedTags]
  );

  const toggleTag = useCallback(
    (category, tag) => {
      const normalizedCategory = normalizeCategoryKey(category);

      applySelectedTags((prevTags) => {
        const currentTags = prevTags[normalizedCategory] || [];
        const alreadyExists = currentTags.some((existingTag) =>
          areTagsEqual(normalizedCategory, existingTag, tag)
        );

        let nextCategoryValues;
        if (alreadyExists) {
          nextCategoryValues = currentTags.filter(
            (existingTag) => !areTagsEqual(normalizedCategory, existingTag, tag)
          );
        } else {
          nextCategoryValues = [...currentTags, tag];
        }

        const updatedTags = { ...prevTags };

        if (nextCategoryValues.length === 0) {
          if (normalizedCategory === "idioma") {
            updatedTags[normalizedCategory] = [];
          } else {
            delete updatedTags[normalizedCategory];
          }
        } else {
          updatedTags[normalizedCategory] = nextCategoryValues;
        }

        return updatedTags;
      });
    },
    [applySelectedTags]
  );

  const clearAllTags = useCallback(() => {
    if (!isReady) return;
    setSelectedTags({ ...DEFAULT_SELECTED_TAGS });
  }, [isReady]);

  const handleBannerClick = (category, tag) => {
    if (!isReady) return;

    if (tag === "Nuevo en Top.education") {
      loadLatestCertifications();
      return;
    }

    addTag(category, tag);
  };

  useEffect(() => {
    const init = async () => {
      window.scrollTo(0, 0);
      isHydratingFromUrlRef.current = true;
      setIsReady(false);

      const params = new URLSearchParams(location.search);
      const filtersFromURL = parseQueryParams(location.search);
      const pageFromURL = parseInt(params.get("page"), 10) || 1;
      const pageSizeFromURL = parseInt(params.get("page_size"), 10) || 16;

      const catalog =
        skillsCatalog.length > 0 ? skillsCatalog : await loadSkillsCatalog();

      const hydratedFilters = hydrateTagsFromCatalog(filtersFromURL, catalog);

      setSelectedTags(hydratedFilters);
      await loadCertifications(pageFromURL, pageSizeFromURL, hydratedFilters);

      initialLoadRef.current = true;
      isHydratingFromUrlRef.current = false;
      setIsReady(true);
    };

    init();
  }, [location.search]);

  useEffect(() => {
    if (!initialLoadRef.current) return;
    if (isHydratingFromUrlRef.current) return;
    if (!isReady) return;

    const tagsFromCurrentUrl = parseQueryParams(location.search);

    if (areTagMapsEqualByUrlValues(debouncedSelectedTags, tagsFromCurrentUrl)) {
      return;
    }

    updateHistoryState(debouncedSelectedTags, 1, 16);
    loadCertifications(1, 16, debouncedSelectedTags);
  }, [
    debouncedSelectedTags,
    location.search,
    isReady,
    areTagMapsEqualByUrlValues,
    updateHistoryState,
    loadCertifications,
  ]);

  useEffect(() => {
    if (!loading) {
      setCertifications(tempCertifications);
    }
  }, [loading, tempCertifications]);

  const handlePageChange = (newPage) => {
    if (!isReady) return;

    if (newPage >= 1 && newPage <= pagination.total_pages && !loading) {
      updateHistoryState(debouncedSelectedTags, newPage, 16);
      loadCertifications(newPage, 16, debouncedSelectedTags);

      if (certificationsRef.current) {
        certificationsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
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
      for (let i = start; i <= end; i++) pages.push(i);
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="ml-2 text-neutral-700">Cargando...</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => handlePageChange(current_page - 1)}
              disabled={current_page === 1 || !isReady}
              className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full"
            >
              <FaChevronLeft />
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={!isReady}
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
                  disabled={!isReady}
                  className="bg-neutral-50 text-neutral-700 hover:text-neutral-50 hover:bg-neutral-700 font-bold py-2 px-4 rounded-full"
                >
                  {total_pages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(current_page + 1)}
              disabled={current_page === total_pages || !isReady}
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
      <h3 className="text-lg font-semibold text-black mb-0">
        No se encontraron certificaciones en la búsqueda
      </h3>
      <p className="text-neutral-900 mt-[-10px]">
        No hay resultados que coincidan con los filtros seleccionados.
      </p>
      <button
        onClick={clearAllTags}
        className="mt-4 bg-neutral-950 hover:bg-neutral-900 text-white font-bold py-2 px-4 rounded-full"
        disabled={!isReady}
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Certificaciones | Top Education</title>
      </Helmet>

      <div className="w-full">
        <div className="wrapper-logo-platforms">
          <div className="wrapper-logos flex justify-between">
            <div className="flex gap-3">
              <div
                className="container-logo !bg-[#e3e1dce6]"
                onClick={() => handleBannerClick("plataforma", "Coursera")}
                style={{
                  opacity: !isReady ? 0.5 : 1,
                  cursor: !isReady ? "not-allowed" : "pointer",
                  pointerEvents: !isReady ? "none" : "auto",
                }}
              >
                <img src="/assets/platforms/coursera-logo.png" alt="Coursera" />
              </div>
              <div
                className="container-logo !bg-[#e3e1dce6]"
                onClick={() => handleBannerClick("plataforma", "EdX")}
                style={{
                  opacity: !isReady ? 0.5 : 1,
                  cursor: !isReady ? "not-allowed" : "pointer",
                  pointerEvents: !isReady ? "none" : "auto",
                }}
              >
                <img src="/assets/platforms/edx-logo.png" alt="EdX" />
              </div>
              <div
                className="container-logo !bg-[#e3e1dce6]"
                onClick={() => handleBannerClick("plataforma", "MasterClass")}
                style={{
                  opacity: !isReady ? 0.5 : 1,
                  cursor: !isReady ? "not-allowed" : "pointer",
                  pointerEvents: !isReady ? "none" : "auto",
                }}
              >
                <img
                  src="/assets/platforms/masterclass-logo.png"
                  alt="MasterClass"
                />
              </div>
            </div>

            <div
              className="container-logo !bg-[#e3e1dce6]"
              onClick={() =>
                handleBannerClick("plataforma", "Nuevo en Top.education")
              }
              style={{
                opacity: !isReady ? 0.5 : 1,
                cursor: !isReady ? "not-allowed" : "pointer",
                pointerEvents: !isReady ? "none" : "auto",
              }}
            >
              Nuevo en<span id="top">top.</span>
              <span id="education">education</span>
            </div>
          </div>
        </div>

        <div className="cont-explora px-0 lg:px-10">
          <IndexCategories
            onTagSelect={(category, tag) => {
              if (!isReady) return;
              toggleTag(category, tag);
            }}
            selectedTags={selectedTags}
            disabled={!isReady}
          />

          <div className="cont-filter">
            <div className="flex flex-wrap">
              <div className="container-tags">
                {Object.keys(selectedTags).length === 0 ||
                Object.values(selectedTags).every(
                  (tags) => !tags || tags.length === 0
                ) ? (
                  <p>Aún no has seleccionado tags</p>
                ) : (
                  Object.entries(selectedTags).map(([category, tags]) =>
                    tags.map((tag, tagIndex) => (
                      <div
                        key={`${category}-${tagIndex}-${getTagUrlValue(
                          category,
                          tag
                        )}`}
                        className="tag"
                      >
                        <span>{getTagLabel(tag)}</span>
                        <button
                          onClick={() => {
                            if (!isReady) return;
                            removeTag(category, tag);
                          }}
                          className="remove-tag-button"
                          disabled={!isReady}
                          style={{
                            opacity: !isReady ? 0.5 : 1,
                            cursor: !isReady ? "not-allowed" : "pointer",
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))
                  )
                )}
              </div>

              <SearchBar selectedTags={selectedTags} />
            </div>

            <div ref={certificationsRef} className="certifications-container">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 p-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full overflow-hidden rounded-[15px] bg-[#F6F4EF] border border-[#ECE7DE] animate-pulse"
                    >
                      <div className="relative h-[200px] w-full rounded-xl bg-[linear-gradient(135deg,#d6d0c8_0%,#f0ece6_45%,#cfc7bc_100%)]">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.5),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.35),transparent_25%)]"></div>
                        <div className="absolute top-1 right-0 h-5 w-24 rounded-[25px_0px_0px_25px] bg-white shadow-sm"></div>
                      </div>

                      <div className="relative px-4 pb-4 pt-4">
                        <div className="absolute -top-2 left-1/2 h-5 w-[150px] -translate-x-1/2 rounded-full bg-[#C4C4C4]"></div>

                        <div className="mt-4 flex flex-col items-center gap-1">
                          <div className="h-4 w-[85%] rounded bg-neutral-300"></div>
                          <div className="h-4 w-[78%] rounded bg-neutral-300"></div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="h-6 w-20 rounded bg-neutral-300"></div>
                          <div className="h-6 w-28 rounded-full bg-neutral-300"></div>
                        </div>
                      </div>
                    </div>
                  ))}
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
      </div>
    </>
  );
}

export default LibraryPage;