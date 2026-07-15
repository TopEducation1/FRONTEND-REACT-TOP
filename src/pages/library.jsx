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
  FaChevronDown,
} from "react-icons/fa6";
import axios from "axios";
import endpoints from "../config/api";

const DEFAULT_SELECTED_TAGS = {
  idioma: ["es"],
};

function LibraryPage({ showRoutes = true }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [selectedTags, setSelectedTags] = useState(DEFAULT_SELECTED_TAGS);
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [filterCatalogs, setFilterCatalogs] = useState({
    universidades: [],
    empresas: [],
    plataforma: [],
    aliados: [],
  });

  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [debouncedSelectedTags] = useDebounce(selectedTags, 350);

  const certificationsRef = useRef(null);
  const isHydratingFromUrlRef = useRef(false);
  const firstLoadDoneRef = useRef(false);
  const requestSeqRef = useRef(0);

  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    page_size: 16,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const flattenUniversitiesByRegion = (data) => {
    if (Array.isArray(data)) return data;

    if (!data || typeof data !== "object") return [];

    return Object.values(data).flatMap((items) =>
      Array.isArray(items) ? items : []
    );
  };

  function normalizeCategoryKey(key) {
    const map = {
      Plataforma: "plataforma",
      plataforma: "plataforma",
      plataforma_id: "plataforma",

      Empresas: "empresas",
      Empresa: "empresas",
      empresas: "empresas",
      empresa_id: "empresas",

      Universidad: "universidades",
      Universidades: "universidades",
      universidades: "universidades",
      universidad_id: "universidades",

      Aliado: "aliados",
      Aliados: "aliados",
      aliados: "aliados",
      aliado_id: "aliados",

      Temas: "temas",
      Tema: "temas",
      temas: "temas",
      tema_id: "temas",

      Habilidad: "habilidades",
      Habilidades: "habilidades",
      habilidades: "habilidades",
      habilidad_id: "habilidades",

      Idioma: "idioma",
      idioma: "idioma",

      Tipo: "tipo_certificacion",
      "Tipo de certificación": "tipo_certificacion",
      tipo_certificacion: "tipo_certificacion",

      Nivel: "nivel_certificacion",
      "Nivel de certificación": "nivel_certificacion",
      nivel_certificacion: "nivel_certificacion",
    };

    return map[key] || String(key).toLowerCase();
  }

  const getTagUrlValue = (category, tag) => {
    if (!tag) return "";

    const normalizedCategory =
      normalizeCategoryKey(category);

    if (
      normalizedCategory === "idioma" ||
      normalizedCategory === "tipo_certificacion" ||
      normalizedCategory === "nivel_certificacion"
    ) {
      return typeof tag === "string"
        ? tag.trim()
        : "";
    }

    if (typeof tag === "object") {
      return (
        tag.id ||
        tag.slug ||
        tag.nombre ||
        tag.name ||
        ""
      );
    }

    return String(tag).trim();
  };

  const getQueryKey = (category, tag = null) => {
    const normalizedCategory = normalizeCategoryKey(category);
    const hasId = tag && typeof tag === "object" && tag.id;

    if (hasId) {
      const idMap = {
        temas: "tema_id",
        habilidades: "habilidad_id",
        universidades: "universidad_id",
        empresas: "empresa_id",
        aliados: "aliado_id",
        plataforma: "plataforma_id",
      };

      if (idMap[normalizedCategory]) return idMap[normalizedCategory];
    }

    const map = {
      temas: "Tema",
      habilidades: "Habilidad",
      universidades: "Universidad",
      empresas: "Empresa",
      aliados: "Aliado",
      plataforma: "Plataforma",
      idioma: "idioma",

      tipo_certificacion: "tipo_certificacion",
      nivel_certificacion: "nivel_certificacion",
    };

    return map[normalizedCategory] || category;
  };

  const languageLabel = (code) => {
    const value = String(code || "").trim();

    const manualMap = {
      es: "Español",
      en: "Inglés",
      ar: "Árabe",
      ca: "Catalán",
      de: "Alemán",
      ms: "Malayo",
      fr: "Francés",
      he: "Hebreo",
      hi: "Hindi",
      it: "Italiano",
      pt: "Portugués",
      zh: "Chino",
      ja: "Japonés",
      ko: "Coreano",
      ru: "Ruso",
      nl: "Neerlandés",
      tr: "Turco",
      pl: "Polaco",
      sv: "Sueco",
      da: "Danés",
      no: "Noruego",
      fi: "Finés",
      id: "Indonesio",
      th: "Tailandés",
      vi: "Vietnamita",
      el: "Griego",
      uk: "Ucraniano",
      cs: "Checo",
      ro: "Rumano",
      hu: "Húngaro",
    };

    if (manualMap[value]) return manualMap[value];

    try {
      const displayNames = new Intl.DisplayNames(["es"], {
        type: "language",
      });

      return displayNames.of(value) || value;
    } catch {
      return value;
    }
  };

  const getObjectLabel = (tag) => {
    if (!tag || typeof tag !== "object") return "";

    return (
      tag.translate ||
      tag.nombre ||
      tag.name ||
      tag.titulo ||
      tag.title ||
      tag.slug ||
      tag.id ||
      ""
    );
  };
  const areTagsEqual = (category, a, b) => {
    const normalizedCategory = normalizeCategoryKey(category);

    const simpleCategories = [
      "idioma",
      "tipo_certificacion",
      "nivel_certificacion",
    ];

    if (simpleCategories.includes(normalizedCategory)) {
      return (
        String(a ?? "").trim().toLowerCase() ===
        String(b ?? "").trim().toLowerCase()
      );
    }

    if (
      typeof a === "object" &&
      a !== null &&
      typeof b === "object" &&
      b !== null
    ) {
      if (a?.id && b?.id) {
        return String(a.id) === String(b.id);
      }

      if (a?.slug && b?.slug) {
        return (
          String(a.slug).trim().toLowerCase() ===
          String(b.slug).trim().toLowerCase()
        );
      }

      return JSON.stringify(a) === JSON.stringify(b);
    }

    if (typeof a === "object" && a !== null) {
      const objectValue =
        a.id ||
        a.slug ||
        a.nombre ||
        a.name ||
        "";

      return (
        String(objectValue).trim().toLowerCase() ===
        String(b ?? "").trim().toLowerCase()
      );
    }

    if (typeof b === "object" && b !== null) {
      const objectValue =
        b.id ||
        b.slug ||
        b.nombre ||
        b.name ||
        "";

      return (
        String(a ?? "").trim().toLowerCase() ===
        String(objectValue).trim().toLowerCase()
      );
    }

    return (
      String(a ?? "").trim().toLowerCase() ===
      String(b ?? "").trim().toLowerCase()
    );
  };

  const getTagLabel = (category, tag) => {
    if (!tag) return "";

    const normalizedCategory =
      normalizeCategoryKey(category);

    if (normalizedCategory === "idioma") {
      return languageLabel(tag);
    }

    if (typeof tag === "object") {
      return getObjectLabel(tag);
    }

    const value = String(tag).trim();

    const readableMaps = {
      plataforma: {
        "1": "edX",
        "2": "Coursera",
        "3": "MasterClass",
        Coursera: "Coursera",
        EDX: "edX",
        EdX: "edX",
        edX: "edX",
        MASTERCLASS: "MasterClass",
        MasterClass: "MasterClass",
      },

      tipo_certificacion: {
        CERTIFICATION: "Certificación",
        CERTIFICACION: "Certificación",
        SPECIALIZATION: "Especialización",
        ESPECIALIZACION: "Especialización",
      },

      nivel_certificacion: {
        BEGINNER: "Principiante",
        PRINCIPIANTE: "Principiante",
        INTERMEDIATE: "Intermedio",
        INTERMEDIO: "Intermedio",
        ADVANCED: "Avanzado",
        AVANZADO: "Avanzado",
      },
    };

    const normalizedValue = value.toUpperCase();

    return (
      readableMaps[normalizedCategory]?.[value] ||
      readableMaps[normalizedCategory]?.[
        normalizedValue
      ] ||
      value
    );
  };



  function parseQueryParams(queryString) {
    const params = new URLSearchParams(queryString);
    const tags = {};

    for (const [key, value] of params.entries()) {
      if (["page", "page_size", "latest", "clear"].includes(key)) continue;

      const normalizedKey = normalizeCategoryKey(key);

      if (!tags[normalizedKey]) tags[normalizedKey] = [];

      if (key.endsWith("_id")) {
        tags[normalizedKey].push({
          id: value,
          nombre: "",
          translate: "",
        });
      } else if (
        normalizedKey === "temas" ||
        normalizedKey === "habilidades"
      ) {
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

  const loadSkillsCatalog = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.filterSkills);

      const safeData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.results)
        ? response.data.results
        : [];

      const activeSkills = safeData.filter(
        (item) =>
          item?.estado === true ||
          item?.estado === 1 ||
          item?.estado === "1"
      );

      setSkillsCatalog(activeSkills);
      return activeSkills;
    } catch {
      setSkillsCatalog([]);
      return [];
    }
  }, []);

  const fetchOptionalCatalog = async (possibleEndpoints = []) => {
    const url = possibleEndpoints.find(Boolean);

    if (!url) return [];

    try {
      const response = await axios.get(url);
      return response.data;
    } catch {
      return [];
    }
  };

  const loadFilterCatalogs = useCallback(
    async () => {
      const [
        universidadesRaw,
        empresas,
        plataforma,
      ] = await Promise.all([
        fetchOptionalCatalog([
          endpoints.filterUniversitiesRegion,
        ]),
        fetchOptionalCatalog([
          endpoints.filterCompanies,
        ]),
        fetchOptionalCatalog([
          endpoints.filterPlatforms,
        ]),
      ]);

      const catalogs = {
        universidades:
          flattenUniversitiesByRegion(
            universidadesRaw
          ),
        empresas: Array.isArray(empresas)
          ? empresas
          : [],
        plataforma: Array.isArray(plataforma)
          ? plataforma
          : [],
        aliados: Array.isArray(plataforma)
          ? plataforma
          : [],
      };

      setFilterCatalogs(catalogs);

      return catalogs;
    },
    []
  );

  const findCatalogMatch = (catalog, rawTag) => {
    if (!Array.isArray(catalog) || catalog.length === 0) return null;

    const value =
      typeof rawTag === "object"
        ? String(rawTag.id || rawTag.slug || rawTag.nombre || "").trim()
        : String(rawTag).trim();

    if (!value) return null;

    return catalog.find((item) => {
      const itemId = String(item.id || item.pk || "").trim();
      const itemSlug = String(item.slug || "").trim();
      const itemName = String(
        item.nombre ||
          item.name ||
          item.univ_nombre ||
          item.empr_nombre ||
          item.plataforma_nombre ||
          ""
      ).trim();

      return itemId === value || itemSlug === value || itemName === value;
    });
  };

  const normalizeCatalogItem = (item, fallback = {}) => {
    if (!item) return fallback;

    const label =
      item.nombre ||
      item.name ||
      item.titulo ||
      item.title ||
      item.univ_nombre ||
      item.empr_nombre ||
      item.plataforma_nombre ||
      item.nombre_universidad ||
      item.nombre_empresa ||
      fallback.nombre ||
      fallback.name ||
      "";

    return {
      ...item,
      id: item.id || item.pk || fallback.id,
      nombre: label,
      translate: item.translate || fallback.translate || "",
      slug: item.slug || fallback.slug || "",
    };
  };

  const hydrateTagsFromCatalogs = useCallback(
    async (tags) => {
      if (!tags) return { ...DEFAULT_SELECTED_TAGS };

      const needsSkills =
      (Array.isArray(tags.temas) && tags.temas.length > 0) ||
      (Array.isArray(tags.habilidades) &&
        tags.habilidades.length > 0);

      const needsExtraCatalogs = [
        "universidades",
        "empresas",
        "plataforma",
        "aliados",
      ].some((key) => Array.isArray(tags[key]) && tags[key].length > 0);

      const skills =
        needsSkills && skillsCatalog.length === 0
          ? await loadSkillsCatalog()
          : skillsCatalog;

      const catalogs =
        needsExtraCatalogs &&
        Object.values(filterCatalogs).every((list) => list.length === 0)
          ? await loadFilterCatalogs()
          : filterCatalogs;

      const hydrated = {};

      Object.entries(tags).forEach(([category, values]) => {
        const normalizedCategory = normalizeCategoryKey(category);

        hydrated[normalizedCategory] = (values || []).map((tag) => {
          if (
            normalizedCategory === "idioma" ||
            normalizedCategory === "tipo_certificacion" ||
            normalizedCategory === "nivel_certificacion"
          ) {
            return tag;
          }

          if (
            normalizedCategory === "temas" ||
            normalizedCategory === "habilidades"
          ) {
            const id = typeof tag === "object" ? tag.id : "";
            const slug =
              typeof tag === "object"
                ? tag.slug
                : String(tag).trim();

            const expectedType =
              normalizedCategory === "habilidades"
                ? "habilidad"
                : "tema";

            const matchedSkill = skills.find((skill) => {
              const skillType = String(skill.skill_type || "")
                .trim()
                .toLowerCase();

              const matchType =
                skillType === expectedType ||
                skillType === "";

              const matchId =
                id &&
                String(skill.id || "").trim() ===
                  String(id).trim();

              const matchSlug =
                slug &&
                String(skill.slug || "").trim() ===
                  String(slug).trim();

              return matchType && (matchId || matchSlug);
            });

            if (!matchedSkill) return tag;

            return {
              id: matchedSkill.id,
              nombre: matchedSkill.nombre,
              translate: matchedSkill.translate,
              slug: matchedSkill.slug,
              skill_type: matchedSkill.skill_type,
              parent: matchedSkill.parent ?? null,
            };
          }

          const matched = findCatalogMatch(catalogs[normalizedCategory], tag);

          if (!matched) return tag;

          return normalizeCatalogItem(matched, tag);
        });
      });

      return hydrated;
    },
    [skillsCatalog, filterCatalogs, loadSkillsCatalog, loadFilterCatalogs]
  );

  const buildUrlFromTags = useCallback(
    (tags, page = 1, pageSize = 16, pathname = location.pathname) => {
      const searchParams = new URLSearchParams();

      Object.entries(tags || {}).forEach(([key, values]) => {
        if (!Array.isArray(values)) return;

        values.forEach((val) => {
          const queryKey = getQueryKey(key, val);
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

  const addTagAndNavigate = useCallback(
    (category, tag) => {
      const normalizedCategory = normalizeCategoryKey(category);

      setSelectedTags((prevTags) => {
        const currentTags = prevTags[normalizedCategory] || [];

        const exists = currentTags.some((oldTag) =>
          areTagsEqual(normalizedCategory, oldTag, tag)
        );

        const updatedTags = exists
          ? prevTags
          : {
              ...prevTags,
              [normalizedCategory]: [...currentTags, tag],
            };

        const nextUrl = buildUrlFromTags(
          updatedTags,
          1,
          16,
          location.pathname
        );

        navigate(nextUrl, { replace: false });

        return updatedTags;
      });
    },
    [buildUrlFromTags, location.pathname, navigate]
  );

  const clearAllTags = useCallback(() => {
    if (!isReady) return;

    navigate(
      "/explora?idioma=es&page=1&page_size=16",
      {
        replace: false,
      }
    );
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

    addTagAndNavigate(category, tag);
  };

  const handleTagSelect = (category, tag) => {
    if (!isReady) return;

    const normalizedCategory = normalizeCategoryKey(category);

    setSelectedTags((prevTags) => {
      const currentTags = prevTags[normalizedCategory] || [];

      const exists = currentTags.some((oldTag) =>
        areTagsEqual(normalizedCategory, oldTag, tag)
      );

      const nextValues = exists
        ? currentTags.filter(
            (oldTag) => !areTagsEqual(normalizedCategory, oldTag, tag)
          )
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

      const nextUrl = buildUrlFromTags(
        updatedTags,
        1,
        16,
        location.pathname
      );

      navigate(nextUrl, { replace: false });

      return updatedTags;
    });
  };

  const removeSelectedTag = (category, tag) => {
    if (!isReady) return;

    const normalizedCategory = normalizeCategoryKey(category);

    setSelectedTags((prevTags) => {
      const updatedTags = { ...prevTags };
      const currentTags = updatedTags[normalizedCategory] || [];

      const filtered = currentTags.filter(
        (oldTag) => !areTagsEqual(normalizedCategory, oldTag, tag)
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

      const nextUrl = buildUrlFromTags(
        updatedTags,
        1,
        16,
        location.pathname
      );

      navigate(nextUrl, { replace: false });

      return updatedTags;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("latest") === "1") return;

    let changed = false;

    if (params.getAll("idioma").length === 0) {
      params.append("idioma", "es");
      //params.append("idioma", "en");
      changed = true;
    }

    if (!params.get("page")) {
      params.set("page", "1");
      changed = true;
    }

    if (!params.get("page_size")) {
      params.set("page_size", "16");
      changed = true;
    }

    if (changed) {
      navigate(`${location.pathname}?${params.toString()}`, {
        replace: true,
      });
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

      if (params.getAll("idioma").length === 0) return;

      const filtersFromURL = parseQueryParams(location.search);
      const pageFromURL = parseInt(params.get("page"), 10) || 1;
      const pageSizeFromURL = parseInt(params.get("page_size"), 10) || 16;

      const hydratedFilters = await hydrateTagsFromCatalogs(filtersFromURL);

      setSelectedTags(hydratedFilters);

      await loadCertifications(pageFromURL, pageSizeFromURL, hydratedFilters);

      isHydratingFromUrlRef.current = false;
      firstLoadDoneRef.current = true;
      setIsReady(true);
    };

    run();
  }, [location.pathname, location.search]);

  const handlePageChange = (newPage) => {
    if (!isReady || loading) return;
    if (newPage < 1 || newPage > pagination.total_pages) return;

    const nextUrl = buildUrlFromTags(
      debouncedSelectedTags,
      newPage,
      16,
      location.pathname
    );

    navigate(nextUrl, { replace: false });

    certificationsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const PaginationControls = () => {
    const { current_page, total_pages } = pagination;

    const getVisiblePages = () => {
      const maxVisible = 5;

      let start = Math.max(1, current_page - 2);
      let end = Math.min(total_pages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    if (total_pages <= 1) return null;

    const pages = getVisiblePages();

    return (
      <div className="flex justify-center py-10">
        <div className="flex items-center justify-center gap-1 rounded-full border border-black/10 bg-white px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={current_page === 1 || !isReady || loading}
            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaAnglesLeft />
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1 || !isReady || loading}
            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>

          {pages[0] > 1 && (
            <span className="px-2 text-neutral-400">...</span>
          )}

          {pages.map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={!isReady || loading}
              className={`flex h-10 w-8 md:w-10 items-center justify-center rounded-full px-3 text-sm font-bold transition ${
                page === current_page
                  ? "bg-[#111111] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  : "bg-neutral-50 text-neutral-700 hover:bg-neutral-200"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {page}
            </button>
          ))}

          {pages[pages.length - 1] < total_pages && (
            <span className="px-2 text-neutral-400">...</span>
          )}

          <button
            type="button"
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page === total_pages || !isReady || loading}
            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronRight />
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(total_pages)}
            disabled={current_page === total_pages || !isReady || loading}
            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Certificaciones | Top Education</title>
      </Helmet>

      <div className="w-full pt-18 bg-[#FFFFFF]">
        <div className="border-b border-black/10 bg-white">
          <div className="container mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-2 md:px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              {[
                {
                  name: "Coursera",
                  img: "/assets/platforms/coursera-logo.png",
                },
                {
                  name: "EdX",
                  img: "/assets/platforms/edx-logo.png",
                },
                {
                  name: "MasterClass",
                  img: "/assets/platforms/masterclass-logo.png",
                },
              ].map((platform) => (
                <button
                  type="button"
                  key={platform.name}
                  onClick={() =>
                    handleBannerClick("plataforma", platform.name)
                  }
                  disabled={!isReady}
                  className="flex h-8 py-1 items-center rounded-[25px] bg-[#F5F3EE] px-4 md:px-4 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <img
                    src={platform.img}
                    alt={platform.name}
                    className="max-h-[20px] max-w-[120px] md:max-w-[150px] object-contain"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                handleBannerClick("plataforma", "Nuevo en Top.education")
              }
              disabled={!isReady}
              className="hidden rounded-full bg-[#2563EB] px-5 py-2 text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(25,65,207,0.28)] disabled:cursor-not-allowed disabled:opacity-50 md:block"
            >
              Nuevo en top.education
            </button>
          </div>
        </div>

        <div className="border-b border-black/10 bg-[#F5F3EE]">
          <div className="container mx-auto max-w-[1200px] px-4 py-4">
            <div className="rounded-[25px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <SearchBar selectedTags={selectedTags} />
            </div>
          </div>
        </div>

        <div className="container mx-auto py-4 min-h-[70vh]">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[220px_1fr]">
            <aside className="relative z-20 rounded-[15px] lg:sticky lg:top-24 lg:h-fit">
              <div className="max-h-[calc(100vh-190px)]  pr-2">
                <IndexCategories
                  onTagSelect={handleTagSelect}
                  selectedTags={selectedTags}
                  disabled={!isReady}
                />
              </div>

             
            </aside>

            <main className="min-w-0 px-2 md:px-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-h-[30px] flex-wrap gap-2">
                  {Object.keys(selectedTags).length === 0 ||
                  Object.values(selectedTags).every(
                    (tags) => !tags || tags.length === 0
                  ) ? (
                    <p className="text-sm text-neutral-500">
                      Aún no has seleccionado filtros
                    </p>
                  ) : (
                    Object.entries(selectedTags).map(([category, tags]) =>
                      tags.map((tag, tagIndex) => (
                        <div
                          key={`${category}-${tagIndex}-${getTagUrlValue(
                            category,
                            tag
                          )}`}
                          className="flex items-center gap-2 rounded-full border border-black/10 bg-[#F5F3EE] pl-4 pr-2 py-1 text-sm font-medium text-neutral-800 shadow-sm"
                        >
                          <span>{getTagLabel(category, tag)}</span>

                          <button
                            type="button"
                            onClick={() => removeSelectedTag(category, tag)}
                            disabled={!isReady}
                            className="flex h-5 w-5 items-center justify-center leading-[.8em] rounded-full bg-neutral-100 text-xs text-neutral-500 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ×
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
                  className="rounded-full bg-[#111111] px-5 py-2 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Limpiar filtros
                </button>
              </div>

              <div ref={certificationsRef}>
                {loading ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full animate-pulse rounded-[18px] border border-black/10 bg-white"
                      >
                        <div className="h-[140px] rounded-t-[18px] bg-neutral-200" />

                        <div className="space-y-2 px-4 py-3">
                          <div className="h-4 w-[45%] rounded-full bg-neutral-200" />
                          <div className="h-4 w-[90%] rounded bg-neutral-200" />
                          <div className="h-3 w-[70%] rounded bg-neutral-200" />
                          <div className="h-4 w-[45%] rounded-full bg-neutral-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : certifications.length === 0 ? (
                  <div className="rounded-[24px] bg-white px-6 py-14 text-center shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
                    <h3 className="text-lg font-semibold text-black">
                      No se encontraron certificaciones
                    </h3>

                    <p className="text-neutral-500">
                      No hay resultados que coincidan con los filtros
                      seleccionados.
                    </p>

                    <button
                      type="button"
                      onClick={clearAllTags}
                      className="mt-6 rounded-full bg-neutral-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-neutral-800"
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
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default LibraryPage;