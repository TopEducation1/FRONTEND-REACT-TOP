import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import tagFilterService from "../services/filterByTagsTesting";
import CertificationsList from "../components/layoutCertifications";
import CertificationsFetcher from "../services/certificationsFetcher";
import { useDebounce } from "use-debounce";
import IndexCategories from "../components/IndexCategories";
import SearchBar from "../components/searchBar";
import { Helmet } from "react-helmet";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import axios from "axios";
import endpoints from "../config/api";

const DEFAULT_SELECTED_TAGS = {
  idioma: ["es", "en"],
};

function LibraryPage({ showRoutes = true }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [selectedTags, setSelectedTags] = useState(DEFAULT_SELECTED_TAGS);
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [debouncedSelectedTags] = useDebounce(selectedTags, 350);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    page_size: 16,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const certificationsRef = useRef(null);
  const isHydratingFromUrlRef = useRef(false);
  const firstLoadDoneRef = useRef(false);
  const requestSeqRef = useRef(0);

  function normalizeCategoryKey(key) {
    const map = {
      Plataforma: "plataforma",
      Empresas: "empresas",
      Empresa: "empresas",
      Universidad: "universidades",
      Universidades: "universidades",
      Temas: "temas",
      Tema: "temas",
      Idioma: "idioma",
      idioma: "idioma",
      plataforma: "plataforma",
      empresas: "empresas",
      universidades: "universidades",
      temas: "temas",
    };

    return map[key] || String(key).toLowerCase();
  }

  const getTagUrlValue = (category, tag) => {
    if (!tag) return "";

    const normalizedCategory = normalizeCategoryKey(category);

    if (normalizedCategory === "temas") {
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

  const getTagLabel = (tag) => {
    if (!tag) return "";
    if (typeof tag === "string" || typeof tag === "number") return String(tag);
    return tag.translate || tag.nombre || tag.slug || "";
  };

  const getQueryKey = (category) => {
    const normalizedCategory = normalizeCategoryKey(category);

    const map = {
      temas: "Tema",
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
      if (["page", "page_size", "latest", "clear"].includes(key)) continue;

      const normalizedKey = normalizeCategoryKey(key);
      if (!tags[normalizedKey]) tags[normalizedKey] = [];

      if (normalizedKey === "temas") {
        tags[normalizedKey].push({
          slug: value,
          nombre: "",
          translate: "",
        });
      } else {
        tags[normalizedKey].push(value);
      }
    }

    if (!params.get("clear") && (!tags.idioma || tags.idioma.length === 0)) {
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

  const loadSkillsCatalog = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.skills);
      const safeData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.results)
        ? response.data.results
        : [];

      const activeSkills = safeData.filter(
        (item) => item?.estado === true || item?.estado === 1 || item?.estado === "1"
      );

      setSkillsCatalog(activeSkills);
      return activeSkills;
    } catch {
      setSkillsCatalog([]);
      return [];
    }
  }, []);

  const hydrateTagsFromCatalog = useCallback((tags, catalog) => {
    if (!tags) return { ...DEFAULT_SELECTED_TAGS };

    const hydrated = {};

    Object.entries(tags).forEach(([category, values]) => {
      const normalizedCategory = normalizeCategoryKey(category);

      hydrated[normalizedCategory] = (values || []).map((tag) => {
        if (normalizedCategory !== "temas") return tag;

        const slug = typeof tag === "object" ? tag.slug : String(tag).trim();

        const matchedSkill = catalog.find((skill) => {
          const skillType = String(skill.skill_type || "").trim().toLowerCase();
          return skillType === "tema" && String(skill.slug || "").trim() === slug;
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

    return hydrated;
  }, []);

  const buildUrlFromTags = useCallback(
    (tags, page = 1, pageSize = 16, pathname = location.pathname) => {
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

      return `${pathname}?${searchParams.toString()}`;
    },
    [location.pathname]
  );

  const loadLatestCertifications = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(endpoints.latest_certifications);
      const rows = Array.isArray(response.data) ? response.data : [];

      setSelectedTags({});
      setCertifications(rows);
      setPagination({
        count: rows.length,
        current_page: 1,
        page_size: rows.length || 16,
        total_pages: 1,
        has_next: false,
        has_previous: false,
      });
    } catch {
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCertifications = useCallback(async (page, pageSize, tags) => {
    const requestId = ++requestSeqRef.current;

    setLoading(true);

    try {
      const fetchData =
        Object.keys(tags || {}).length > 0
          ? await tagFilterService.filterByTags(tags, page, pageSize)
          : await CertificationsFetcher.getAllCertifications(page, pageSize);

      if (requestId !== requestSeqRef.current) return;

      if (fetchData && Array.isArray(fetchData.results)) {
        setCertifications(fetchData.results);
        setPagination({
          count: fetchData.count ?? 0,
          current_page: fetchData.current_page || page,
          page_size: fetchData.page_size || pageSize,
          total_pages: fetchData.total_pages || 1,
          has_next: !!fetchData.has_next,
          has_previous: !!fetchData.has_previous,
        });
      } else {
        setCertifications([]);
        setPagination({
          count: 0,
          current_page: 1,
          page_size: pageSize,
          total_pages: 1,
          has_next: false,
          has_previous: false,
        });
      }
    } catch {
      if (requestId !== requestSeqRef.current) return;
      setCertifications([]);
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const addTag = useCallback((category, tag) => {
    const normalizedCategory = normalizeCategoryKey(category);

    setSelectedTags((prevTags) => {
      const currentTags = prevTags[normalizedCategory] || [];
      const exists = currentTags.some((oldTag) =>
        areTagsEqual(normalizedCategory, oldTag, tag)
      );

      if (exists) return prevTags;

      return {
        ...prevTags,
        [normalizedCategory]: [...currentTags, tag],
      };
    });
  }, []);

  const removeTag = useCallback((category, tagToRemove) => {
    const normalizedCategory = normalizeCategoryKey(category);

    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      const currentTags = updatedTags[normalizedCategory] || [];

      const filtered = currentTags.filter(
        (tag) => !areTagsEqual(normalizedCategory, tag, tagToRemove)
      );

      if (filtered.length === 0) {
        if (normalizedCategory === "idioma") {
          updatedTags[normalizedCategory] = [];
        } else {
          delete updatedTags[normalizedCategory];
        }
      } else {
        updatedTags[normalizedCategory] = filtered;
      }

      return updatedTags;
    });
  }, []);

  const toggleTag = useCallback((category, tag) => {
    const normalizedCategory = normalizeCategoryKey(category);

    setSelectedTags((prevTags) => {
      const currentTags = prevTags[normalizedCategory] || [];
      const exists = currentTags.some((oldTag) =>
        areTagsEqual(normalizedCategory, oldTag, tag)
      );

      const nextValues = exists
        ? currentTags.filter((oldTag) => !areTagsEqual(normalizedCategory, oldTag, tag))
        : [...currentTags, tag];

      const updatedTags = { ...prevTags };

      if (nextValues.length === 0) {
        if (normalizedCategory === "idioma") {
          updatedTags[normalizedCategory] = [];
        } else {
          delete updatedTags[normalizedCategory];
        }
      } else {
        updatedTags[normalizedCategory] = nextValues;
      }

      return updatedTags;
    });
  }, []);

  const clearAllTags = useCallback(() => {
    if (!isReady) return;

    navigate("/explora/filter?clear=1&page=1&page_size=16", {
      replace: false,
    });
  }, [isReady, navigate]);

  const handleLatestClick = useCallback(() => {
    if (!isReady) return;

    navigate("/explora/filter?latest=1&page=1&page_size=16", {
      replace: false,
    });
  }, [isReady, navigate]);

  const handleBannerClick = (category, tag) => {
    if (!isReady) return;

    if (tag === "Nuevo en Top.education") {
      handleLatestClick();
      return;
    }

    addTag(category, tag);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("latest") === "1" || params.get("clear") === "1") return;

    if (params.getAll("idioma").length === 0) {
      params.append("idioma", "es");
      params.append("idioma", "en");
      if (!params.get("page")) params.set("page", "1");
      if (!params.get("page_size")) params.set("page_size", "16");

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search);

      isHydratingFromUrlRef.current = true;
      setIsReady(false);

      if (params.get("latest") === "1") {
        await loadLatestCertifications();
        isHydratingFromUrlRef.current = false;
        firstLoadDoneRef.current = true;
        setIsReady(true);
        return;
      }

      if (params.get("clear") === "1") {
        const pageFromURL = parseInt(params.get("page"), 10) || 1;
        const pageSizeFromURL = parseInt(params.get("page_size"), 10) || 16;

        setSelectedTags({});
        await loadCertifications(pageFromURL, pageSizeFromURL, {});

        isHydratingFromUrlRef.current = false;
        firstLoadDoneRef.current = true;
        setIsReady(true);
        return;
      }

      if (params.getAll("idioma").length === 0) return;

      const filtersFromURL = parseQueryParams(location.search);
      const pageFromURL = parseInt(params.get("page"), 10) || 1;
      const pageSizeFromURL = parseInt(params.get("page_size"), 10) || 16;

      const hasSkillFilters =
        Array.isArray(filtersFromURL.temas) && filtersFromURL.temas.length > 0;

      let hydratedFilters = filtersFromURL;

      if (hasSkillFilters) {
        const catalog =
          skillsCatalog.length > 0 ? skillsCatalog : await loadSkillsCatalog();

        hydratedFilters = hydrateTagsFromCatalog(filtersFromURL, catalog);
      }

      setSelectedTags(hydratedFilters);
      await loadCertifications(pageFromURL, pageSizeFromURL, hydratedFilters);

      if (!hasSkillFilters && skillsCatalog.length === 0) {
        loadSkillsCatalog();
      }

      isHydratingFromUrlRef.current = false;
      firstLoadDoneRef.current = true;
      setIsReady(true);
    };

    run();
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!firstLoadDoneRef.current) return;
    if (isHydratingFromUrlRef.current) return;
    if (!isReady) return;

    const params = new URLSearchParams(location.search);
    if (params.get("latest") === "1" || params.get("clear") === "1") return;

    const tagsFromUrl = parseQueryParams(location.search);

    if (areTagMapsEqualByUrlValues(debouncedSelectedTags, tagsFromUrl)) {
      return;
    }

    const nextUrl = buildUrlFromTags(debouncedSelectedTags, 1, 16, location.pathname);
    const currentUrl = `${location.pathname}${location.search}`;

    if (nextUrl !== currentUrl) {
      navigate(nextUrl, { replace: false });
    }
  }, [
    debouncedSelectedTags,
    isReady,
    location.pathname,
    location.search,
    areTagMapsEqualByUrlValues,
    buildUrlFromTags,
    navigate,
  ]);

  const handlePageChange = (newPage) => {
    if (!isReady || loading) return;

    const nextUrl = buildUrlFromTags(debouncedSelectedTags, newPage, 16, location.pathname);
    navigate(nextUrl, { replace: false });

    certificationsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const PaginationControls = () => {
    const { current_page, total_pages } = pagination;

    const getVisiblePages = () => {
      const pages = [];
      let start = Math.max(current_page - 2, 1);
      let end = Math.min(current_page + 2, total_pages || 1);

      if (current_page <= 3) end = Math.min(5, total_pages || 1);
      if (current_page >= (total_pages || 1) - 2) {
        start = Math.max((total_pages || 1) - 4, 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    };

    if (loading) {
      return (
        <div className="container-buttons-pagination gap-1">
          <span className="ml-2 text-neutral-700">Cargando...</span>
        </div>
      );
    }

    const pages = getVisiblePages();

    return (
      <div className="container-buttons-pagination gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={current_page === 1 || !isReady}
          className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaAnglesLeft />
        </button>

        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1 || !isReady}
          className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>

        {pages[0] > 1 && <span className="px-2">...</span>}

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

        {pages[pages.length - 1] < total_pages && <span className="px-2">...</span>}

        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === total_pages || !isReady}
          className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>

        <button
          onClick={() => handlePageChange(total_pages)}
          disabled={current_page === total_pages || !isReady}
          className="bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-bold py-2 px-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaAnglesRight />
        </button>
      </div>
    );
  };

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
            <div className="flex flex-wrap justify-between items-center gap-2 relative">
              <div className="container-tags !w-[68%]">
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

              <button
                type="button"
                onClick={clearAllTags}
                disabled={!isReady || loading}
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-2 px-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Limpiar filtros
              </button>

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