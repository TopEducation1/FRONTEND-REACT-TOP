import React, {

  useState,

  useEffect,

  useCallback,

  useMemo,

  useRef,

} from "react";

import { useLocation, useNavigate } from "react-router-dom";

import CertificationsList from "../components/layoutCertifications";

import IndexCategories from "../components/IndexCategories";

import SearchBar from "../components/searchBar";



import {KNOWLEDGE_DOMAINS,} from "../constants/knowledgeDomains";

import Seo from "../components/Seo";

import {

  FaChevronLeft,

  FaChevronRight,

  FaAnglesLeft,

  FaAnglesRight,

  FaChevronDown,

} from "react-icons/fa6";

import axios from "axios";

import endpoints from "../config/api";



const DEFAULT_SELECTED_TAGS = {};



const LOADING_STATUS_MESSAGES = [

  {

    title: "Buscando el mejor contenido para ti",

    description:

      "Estamos revisando certificaciones relacionadas con los filtros seleccionados.",

  },

  {

    title: "Afinando tu búsqueda",

    description:

      "Combinamos temas, habilidades, idioma y proveedores para obtener resultados más relevantes.",

  },

  {

    title: "Encontrando las mejores coincidencias",

    description:

      "Estamos priorizando contenido que se ajuste mejor a lo que quieres aprender.",

  },

  {

    title: "Preparando tus resultados",

    description:

      "Organizamos las certificaciones para mostrarte primero las opciones más útiles.",

  },

];



const normalizeNumericIds = (values = []) => {
  const source = Array.isArray(values) ? values : [values];

  return [
    ...new Set(
      source
        .flatMap((value) => {
          if (value && typeof value === "object") {
            if (Array.isArray(value.ids)) {
              return value.ids;
            }

            return [value.id];
          }

          return [value];
        })
        .map((value) => Number(value))
        .filter(
          (value) =>
            Number.isInteger(value) &&
            value > 0
        )
    ),
  ];
};

const EMPTY_EXPLORE_FILTER_CATALOGS = {
  version: 1,
  languages: [],
  types: [],
  levels: [],
  defaults: {},
  groups: {
    levels: {},
    types: {},
  },
};

const normalizeFilterCode = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const TYPE_GROUP_ALIASES = {
  certification: "certification",
  certificacion: "certification",
  certificate: "certification",
  course: "certification",
  curso: "certification",
  playlist: "certification",
  session: "certification",
  sesion: "certification",
  specialization: "specialization",
  specialisation: "specialization",
  especializacion: "specialization",
};

const LEVEL_GROUP_ALIASES = {
  introductory: "beginner",
  introductorio: "beginner",
  beginner: "beginner",
  principiante: "beginner",
  intermediate: "intermediate",
  intermedio: "intermediate",
  advanced: "advanced",
  avanzado: "advanced",
};

const normalizeExploreFilterCatalogs = (data) => {
  if (!data || typeof data !== "object") {
    return EMPTY_EXPLORE_FILTER_CATALOGS;
  }

  return {
    ...EMPTY_EXPLORE_FILTER_CATALOGS,
    ...data,
    languages: Array.isArray(data.languages) ? data.languages : [],
    types: Array.isArray(data.types) ? data.types : [],
    levels: Array.isArray(data.levels) ? data.levels : [],
    defaults:
      data.defaults && typeof data.defaults === "object"
        ? data.defaults
        : {},
    groups: {
      levels:
        data.groups?.levels && typeof data.groups.levels === "object"
          ? data.groups.levels
          : {},
      types:
        data.groups?.types && typeof data.groups.types === "object"
          ? data.groups.types
          : {},
    },
  };
};

let exploreFilterCatalogCache = null;
let exploreFilterCatalogPromise = null;

const getExploreFilterCatalogs = async () => {
  if (exploreFilterCatalogCache) {
    return exploreFilterCatalogCache;
  }

  if (exploreFilterCatalogPromise) {
    return exploreFilterCatalogPromise;
  }

  const url = endpoints.exploreFilterCatalogs;

  if (!url) {
    console.error(
      "Falta configurar endpoints.explore_filter_catalogs en src/config/api.js"
    );

    return EMPTY_EXPLORE_FILTER_CATALOGS;
  }

  exploreFilterCatalogPromise = axios
    .get(url)
    .then((response) => {
      exploreFilterCatalogCache =
        normalizeExploreFilterCatalogs(response?.data);

      return exploreFilterCatalogCache;
    })
    .catch((error) => {
      console.error(
        "Error cargando catálogo normalizado de Explora:",
        error
      );

      return EMPTY_EXPLORE_FILTER_CATALOGS;
    })
    .finally(() => {
      exploreFilterCatalogPromise = null;
    });

  return exploreFilterCatalogPromise;
};

const appendUniqueNumericParams = (
  params,
  targetKey,
  values
) => {
  const ids = normalizeNumericIds(values);

  params.delete(targetKey);

  ids.forEach((id) => {
    params.append(targetKey, String(id));
  });
};

const canonicalizeExploreSearchParams = (
  inputParams,
  exploreCatalogs
) => {
  const params = new URLSearchParams(inputParams);
  const original = params.toString();
  const catalogs = normalizeExploreFilterCatalogs(exploreCatalogs);

  // ---------------------------------------------------------
  // Normalizar aliases de parámetros ID.
  // ---------------------------------------------------------
  const idAliases = {
    idioma_id: ["idioma_id", "Idioma_id", "language_id"],
    tipo_id: ["tipo_id", "tipo_certificacion_id", "Tipo_id"],
    nivel_id: ["nivel_id", "nivel_certificacion_id", "Nivel_id"],
  };

  Object.entries(idAliases).forEach(([targetKey, aliases]) => {
    const collected = [];

    aliases.forEach((alias) => {
      collected.push(...params.getAll(alias));
      if (alias !== targetKey) params.delete(alias);
    });

    if (collected.length > 0) {
      appendUniqueNumericParams(params, targetKey, collected);
    }
  });

  // ---------------------------------------------------------
  // Migrar URLs antiguas por código -> IDs canónicos.
  // ---------------------------------------------------------
  const languageByCode = new Map(
    catalogs.languages.map((item) => [
      normalizeFilterCode(item?.code),
      Number(item?.id || 0),
    ])
  );

  const legacyLanguages = [
    ...params.getAll("idioma"),
    ...params.getAll("Idioma"),
  ];

  if (legacyLanguages.length > 0) {
    const ids = [
      ...params.getAll("idioma_id"),
      ...legacyLanguages
        .map((code) => languageByCode.get(normalizeFilterCode(code)))
        .filter(Boolean),
    ];

    params.delete("idioma");
    params.delete("Idioma");
    appendUniqueNumericParams(params, "idioma_id", ids);
  }

  const migrateGroupedLegacyFilter = (
    legacyKeys,
    targetKey,
    groups,
    aliases
  ) => {
    const legacyValues = legacyKeys.flatMap((key) => params.getAll(key));

    if (legacyValues.length === 0) return;

    const ids = [...params.getAll(targetKey)];

    legacyValues.forEach((rawValue) => {
      const normalized = normalizeFilterCode(rawValue);
      const groupCode = aliases[normalized] || normalized;

      ids.push(...(groups?.[groupCode] || []));
    });

    legacyKeys.forEach((key) => params.delete(key));
    appendUniqueNumericParams(params, targetKey, ids);
  };

  migrateGroupedLegacyFilter(
    ["tipo_certificacion", "Tipo", "TipoCertificacion"],
    "tipo_id",
    catalogs.groups.types,
    TYPE_GROUP_ALIASES
  );

  migrateGroupedLegacyFilter(
    ["nivel_certificacion", "Nivel", "NivelCertificacion"],
    "nivel_id",
    catalogs.groups.levels,
    LEVEL_GROUP_ALIASES
  );

  // ---------------------------------------------------------
  // Español por defecto: ahora también por ID.
  // ---------------------------------------------------------
  if (params.getAll("idioma_id").length === 0) {
    const defaultLanguageId = Number(
      catalogs.defaults?.language_id ||
        languageByCode.get("es") ||
        0
    );

    if (
      Number.isInteger(defaultLanguageId) &&
      defaultLanguageId > 0
    ) {
      params.append("idioma_id", String(defaultLanguageId));
    }
  }

  if (!params.get("page")) {
    params.set("page", "1");
  }

  if (!params.get("page_size")) {
    params.set("page_size", "16");
  }

  return {
    params,
    changed: params.toString() !== original,
  };
};

const findSelectedKnowledgeDomains = (

  selectedSkills = []

) => {

  const selectedIds = new Set(

    normalizeNumericIds(selectedSkills)

  );



  return KNOWLEDGE_DOMAINS.filter(

    (domain) =>

      domain.skillIds.every((skillId) =>

        selectedIds.has(Number(skillId))

      )

  );

};



const buildDomainSkillTag = (skillId) => ({

  id: Number(skillId),

  nombre: "",

  translate: "",

  slug: "",

  skill_type: "habilidad",

  parent: null,

});





const normalizeCatalogArray = (data) => {

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.results)) return data.results;

  return [];

};



const flattenUniversitiesCatalog = (data) => {

  if (Array.isArray(data)) return data;

  if (!data || typeof data !== "object") return [];



  return Object.values(data).flatMap((items) =>

    Array.isArray(items) ? items : []

  );

};



const normalizeUniversitiesByRegion = (data) => {

  if (Array.isArray(data)) {

    return {

      Universidades: data,

    };

  }



  if (!data || typeof data !== "object") return {};



  return data;

};



const isActiveSkillCatalogItem = (item) =>

  item?.estado === true ||

  item?.estado === 1 ||

  item?.estado === "1";



let filterCatalogBundleCache = null;

let filterCatalogBundlePromise = null;



const fetchCatalogData = async (url, fallback) => {

  if (!url) return fallback;



  try {

    const response = await axios.get(url);

    return response?.data ?? fallback;

  } catch (error) {

    console.error(

      `Error cargando catálogo ${url}:`,

      error

    );

    return fallback;

  }

};



const getFilterCatalogBundle = async () => {
  if (filterCatalogBundleCache) {
    return filterCatalogBundleCache;
  }

  if (filterCatalogBundlePromise) {
    return filterCatalogBundlePromise;
  }

  /*
   * El endpoint normalizado reemplaza la petición antigua exclusiva
   * de idiomas. Seguimos haciendo la misma cantidad de requests de
   * catálogo y todos corren en paralelo.
   */
  filterCatalogBundlePromise = Promise.all([
    fetchCatalogData(endpoints.filterSkills, []),
    fetchCatalogData(endpoints.filterCompanies, []),
    fetchCatalogData(endpoints.filterPlatforms, []),
    fetchCatalogData(endpoints.filterUniversitiesRegion, {}),
    getExploreFilterCatalogs(),
  ])
    .then(
      ([
        skillsRaw,
        companiesRaw,
        platformsRaw,
        universitiesRaw,
        exploreFiltersRaw,
      ]) => {
        const skills = normalizeCatalogArray(
          skillsRaw
        ).filter(isActiveSkillCatalogItem);

        const companies =
          normalizeCatalogArray(companiesRaw);

        const platforms =
          normalizeCatalogArray(platformsRaw);

        const universitiesByRegion =
          normalizeUniversitiesByRegion(
            universitiesRaw
          );

        const universities =
          flattenUniversitiesCatalog(
            universitiesByRegion
          );

        const exploreFilterCatalogs =
          normalizeExploreFilterCatalogs(
            exploreFiltersRaw
          );

        const languages =
          exploreFilterCatalogs.languages;

        filterCatalogBundleCache = {
          skills,
          companies,
          platforms,
          universities,
          universitiesByRegion,
          languages,
          exploreFilterCatalogs,
        };

        return filterCatalogBundleCache;
      }
    )
    .finally(() => {
      filterCatalogBundlePromise = null;
    });

  return filterCatalogBundlePromise;
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

  const [

    universitiesByRegion,

    setUniversitiesByRegion,

  ] = useState({});

  const [

    languagesCatalog,

    setLanguagesCatalog,

  ] = useState([]);

  const [

    exploreFilterCatalogs,

    setExploreFilterCatalogs,

  ] = useState(EMPTY_EXPLORE_FILTER_CATALOGS);



  const [loading, setLoading] = useState(true);

  const [isReady, setIsReady] = useState(false);

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);



  const certificationsRef = useRef(null);

  const isHydratingFromUrlRef = useRef(false);

  const firstLoadDoneRef = useRef(false);

  const requestSeqRef = useRef(0);
  const activeRequestControllerRef = useRef(null);

  const hydrationSeqRef = useRef(0);

  const catalogBundleRef = useRef(null);



  const [pagination, setPagination] = useState({

    count: 0,

    current_page: 1,

    page_size: 16,

    total_pages: 1,

    has_next: false,

    has_previous: false,

  });



  function normalizeCategoryKey(key) {
    const map = {
      Dominio: "dominio",
      dominio: "dominio",

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
      skill_id: "habilidades",

      Idioma: "idioma",
      idioma: "idioma",
      idioma_id: "idioma",
      Idioma_id: "idioma",
      language_id: "idioma",

      Tipo: "tipo_certificacion",
      "Tipo de certificación": "tipo_certificacion",
      tipo_certificacion: "tipo_certificacion",
      tipo_id: "tipo_certificacion",
      tipo_certificacion_id: "tipo_certificacion",
      Tipo_id: "tipo_certificacion",

      Nivel: "nivel_certificacion",
      "Nivel de certificación": "nivel_certificacion",
      nivel_certificacion: "nivel_certificacion",
      nivel_id: "nivel_certificacion",
      nivel_certificacion_id: "nivel_certificacion",
      Nivel_id: "nivel_certificacion",
    };

    return map[key] || String(key).toLowerCase();
  }

  const getFilterTagIds = (tag) =>
    normalizeNumericIds([tag]);

  const getTagUrlValue = (category, tag) => {
    if (!tag) return "";

    const normalizedCategory =
      normalizeCategoryKey(category);

    if (
      normalizedCategory === "idioma" ||
      normalizedCategory === "tipo_certificacion" ||
      normalizedCategory === "nivel_certificacion"
    ) {
      if (typeof tag === "object") {
        return (
          tag.value ||
          tag.code ||
          tag.key ||
          getFilterTagIds(tag).join("-")
        );
      }

      return String(tag).trim().toLowerCase();
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

    const normalizedFilterIdMap = {
      idioma: "idioma_id",
      tipo_certificacion: "tipo_id",
      nivel_certificacion: "nivel_id",
    };

    if (normalizedFilterIdMap[normalizedCategory]) {
      return normalizedFilterIdMap[normalizedCategory];
    }

    const hasId =
      tag &&
      typeof tag === "object" &&
      tag.id;

    if (hasId) {
      const idMap = {
        temas: "tema_id",
        habilidades: "habilidad_id",
        universidades: "universidad_id",
        empresas: "empresa_id",
        aliados: "aliado_id",
        plataforma: "plataforma_id",
      };

      if (idMap[normalizedCategory]) {
        return idMap[normalizedCategory];
      }
    }

    const map = {
      temas: "Tema",
      habilidades: "Habilidad",
      universidades: "Universidad",
      empresas: "Empresa",
      aliados: "Aliado",
      plataforma: "Plataforma",
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
      tag.label ||
      tag.translate ||
      tag.nombre ||
      tag.name ||
      tag.titulo ||
      tag.title ||
      tag.slug ||
      tag.code ||
      tag.value ||
      tag.id ||
      ""
    );
  };

  const areTagsEqual = (category, a, b) => {
    const normalizedCategory = normalizeCategoryKey(category);

    if (normalizedCategory === "idioma") {
      const aIds = getFilterTagIds(a);
      const bIds = getFilterTagIds(b);

      if (aIds.length > 0 && bIds.length > 0) {
        return aIds[0] === bIds[0];
      }
    }

    if (
      normalizedCategory === "tipo_certificacion" ||
      normalizedCategory === "nivel_certificacion"
    ) {
      const aKey =
        a && typeof a === "object"
          ? normalizeFilterCode(
              a.value || a.code || a.key
            )
          : normalizeFilterCode(a);

      const bKey =
        b && typeof b === "object"
          ? normalizeFilterCode(
              b.value || b.code || b.key
            )
          : normalizeFilterCode(b);

      if (aKey && bKey) {
        return aKey === bKey;
      }

      const aIds = getFilterTagIds(a).sort((x, y) => x - y);
      const bIds = getFilterTagIds(b).sort((x, y) => x - y);

      if (aIds.length > 0 && bIds.length > 0) {
        return (
          aIds.length === bIds.length &&
          aIds.every((id, index) => id === bIds[index])
        );
      }
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

    if (typeof tag === "object") {
      return getObjectLabel(tag);
    }

    if (normalizedCategory === "idioma") {
      return languageLabel(tag);
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
        INTRODUCTORY: "Principiante",
        INTRODUCTORIO: "Principiante",
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
      readableMaps[normalizedCategory]?.[normalizedValue] ||
      value
    );
  };


  function parseQueryParams(queryString) {
    const params = new URLSearchParams(queryString);
    const tags = {};

    for (const [key, value] of params.entries()) {
      if (["page", "page_size", "latest", "clear"].includes(key)) {
        continue;
      }

      const normalizedKey = normalizeCategoryKey(key);

      if (!tags[normalizedKey]) {
        tags[normalizedKey] = [];
      }

      const numericId = Number(value);

      if (
        [
          "idioma_id",
          "Idioma_id",
          "language_id",
          "tipo_id",
          "tipo_certificacion_id",
          "Tipo_id",
          "nivel_id",
          "nivel_certificacion_id",
          "Nivel_id",
        ].includes(key) &&
        Number.isInteger(numericId) &&
        numericId > 0
      ) {
        tags[normalizedKey].push({
          id: numericId,
          ids: [numericId],
          nombre: "",
          label: "",
          filterType:
            normalizedKey === "idioma"
              ? "language"
              : normalizedKey === "nivel_certificacion"
                ? "level"
                : "type",
        });
      } else if (key.endsWith("_id")) {
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
        // Compatibilidad temporal con URLs antiguas.
        tags[normalizedKey].push(value);
      }
    }

    return tags;
  }

  const applyCatalogBundle = useCallback(

    (bundle) => {

      if (!bundle) return null;



      catalogBundleRef.current = bundle;



      setSkillsCatalog(

        Array.isArray(bundle.skills)

          ? bundle.skills

          : []

      );



      setFilterCatalogs({

        universidades: Array.isArray(

          bundle.universities

        )

          ? bundle.universities

          : [],

        empresas: Array.isArray(

          bundle.companies

        )

          ? bundle.companies

          : [],

        plataforma: Array.isArray(

          bundle.platforms

        )

          ? bundle.platforms

          : [],

        aliados: Array.isArray(

          bundle.platforms

        )

          ? bundle.platforms

          : [],

      });



      setUniversitiesByRegion(

        bundle.universitiesByRegion &&

          typeof bundle.universitiesByRegion ===

            "object"

          ? bundle.universitiesByRegion

          : {}

      );



      setLanguagesCatalog(

        Array.isArray(bundle.languages)

          ? bundle.languages

          : []

      );


      setExploreFilterCatalogs(
        normalizeExploreFilterCatalogs(
          bundle.exploreFilterCatalogs
        )
      );



      return bundle;

    },

    []

  );



  const ensureCatalogsLoaded = useCallback(

    async () => {

      if (catalogBundleRef.current) {

        return catalogBundleRef.current;

      }



      const bundle =

        await getFilterCatalogBundle();



      return (

        applyCatalogBundle(bundle) ||

        bundle

      );

    },

    [applyCatalogBundle]

  );



  /*

   * Los catálogos se cargan una sola vez desde LibraryPage.

   * getFilterCatalogBundle mantiene una caché/promesa a nivel de módulo,

   * por lo que React StrictMode tampoco duplica las peticiones.

   *

   * Esta carga NO bloquea la consulta de certificaciones.

   */

  useEffect(() => {

    let cancelled = false;



    getFilterCatalogBundle().then(

      (bundle) => {

        if (cancelled) return;

        applyCatalogBundle(bundle);

      }

    );



    return () => {

      cancelled = true;

    };

  }, [applyCatalogBundle]);



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
      if (!tags) {
        return { ...DEFAULT_SELECTED_TAGS };
      }

      const bundle =
        catalogBundleRef.current ||
        (await ensureCatalogsLoaded());

      const skills = Array.isArray(bundle?.skills)
        ? bundle.skills
        : [];

      const exploreCatalogs =
        normalizeExploreFilterCatalogs(
          bundle?.exploreFilterCatalogs
        );

      const catalogs = {
        universidades: Array.isArray(bundle?.universities)
          ? bundle.universities
          : [],
        empresas: Array.isArray(bundle?.companies)
          ? bundle.companies
          : [],
        plataforma: Array.isArray(bundle?.platforms)
          ? bundle.platforms
          : [],
        aliados: Array.isArray(bundle?.platforms)
          ? bundle.platforms
          : [],
      };

      const hydrateLanguageValues = (values = []) => {
        const byId = new Map(
          exploreCatalogs.languages.map((item) => [
            Number(item?.id || 0),
            item,
          ])
        );

        const byCode = new Map(
          exploreCatalogs.languages.map((item) => [
            normalizeFilterCode(item?.code),
            item,
          ])
        );

        return values
          .map((tag) => {
            const ids = getFilterTagIds(tag);
            const rawCode =
              typeof tag === "string"
                ? normalizeFilterCode(tag)
                : normalizeFilterCode(
                    tag?.code || tag?.value
                  );

            const item =
              (ids[0] ? byId.get(ids[0]) : null) ||
              (rawCode ? byCode.get(rawCode) : null);

            if (!item) return tag;

            const id = Number(item.id);
            const code = normalizeFilterCode(item.code);
            const label =
              item.nombre ||
              item.label ||
              languageLabel(code);

            return {
              ...item,
              id,
              ids: [id],
              code,
              value: code,
              nombre: label,
              label,
              filterType: "language",
            };
          })
          .filter(Boolean);
      };

      const hydrateGroupedValues = (
        category,
        values = []
      ) => {
        const isLevel =
          category === "nivel_certificacion";

        const groups = isLevel
          ? exploreCatalogs.groups.levels
          : exploreCatalogs.groups.types;

        const sourceCatalog = isLevel
          ? exploreCatalogs.levels
          : exploreCatalogs.types;

        const aliasMap = isLevel
          ? LEVEL_GROUP_ALIASES
          : TYPE_GROUP_ALIASES;

        const preferredCodes = isLevel
          ? ["beginner", "intermediate", "advanced"]
          : ["certification", "specialization"];

        const labelMap = isLevel
          ? {
              beginner: "Principiante",
              intermediate: "Intermedio",
              advanced: "Avanzado",
            }
          : {
              certification: "Certificación",
              specialization: "Especialización",
            };

        const requestedIds = new Set(
          normalizeNumericIds(values)
        );

        const requestedCodes = new Set(
          values
            .map((tag) => {
              const raw =
                tag && typeof tag === "object"
                  ? tag.value || tag.code || tag.key
                  : tag;

              const normalized = normalizeFilterCode(raw);
              return aliasMap[normalized] || normalized;
            })
            .filter(Boolean)
        );

        const consumedIds = new Set();
        const hydrated = [];

        preferredCodes.forEach((code) => {
          const ids = normalizeNumericIds(groups?.[code] || []);

          if (ids.length === 0) return;

          const selectedByCode = requestedCodes.has(code);
          const selectedByIds = ids.every((id) =>
            requestedIds.has(id)
          );

          if (!selectedByCode && !selectedByIds) {
            return;
          }

          ids.forEach((id) => consumedIds.add(id));

          const catalogItem = sourceCatalog.find(
            (item) =>
              normalizeFilterCode(item?.code) === code
          );

          hydrated.push({
            value: code,
            code,
            key: code,
            label:
              catalogItem?.nombre ||
              labelMap[code] ||
              code,
            nombre:
              catalogItem?.nombre ||
              labelMap[code] ||
              code,
            ids,
            filterType: isLevel ? "level" : "type",
          });
        });

        // Si llega una URL externa con un ID individual que no representa
        // un grupo visual completo, lo conservamos sin alterar su semántica.
        requestedIds.forEach((id) => {
          if (consumedIds.has(id)) return;

          const item = sourceCatalog.find(
            (catalogItem) => Number(catalogItem?.id) === id
          );

          if (!item) {
            hydrated.push({
              id,
              ids: [id],
              value: String(id),
              label: String(id),
              nombre: String(id),
              filterType: isLevel ? "level" : "type",
            });
            return;
          }

          const itemCode = normalizeFilterCode(item.code);
          const visualCode = aliasMap[itemCode] || itemCode;

          hydrated.push({
            id,
            ids: [id],
            value: visualCode,
            code: visualCode,
            key: visualCode,
            label:
              labelMap[visualCode] ||
              item.nombre ||
              itemCode,
            nombre:
              labelMap[visualCode] ||
              item.nombre ||
              itemCode,
            filterType: isLevel ? "level" : "type",
          });
        });

        return hydrated;
      };

      const hydrated = {};

      Object.entries(tags).forEach(
        ([category, values]) => {
          const normalizedCategory =
            normalizeCategoryKey(category);

          if (normalizedCategory === "idioma") {
            hydrated[normalizedCategory] =
              hydrateLanguageValues(values || []);
            return;
          }

          if (
            normalizedCategory === "tipo_certificacion" ||
            normalizedCategory === "nivel_certificacion"
          ) {
            hydrated[normalizedCategory] =
              hydrateGroupedValues(
                normalizedCategory,
                values || []
              );
            return;
          }

          hydrated[normalizedCategory] = (
            values || []
          ).map((tag) => {
            if (
              normalizedCategory === "temas" ||
              normalizedCategory === "habilidades"
            ) {
              const id =
                typeof tag === "object"
                  ? tag.id
                  : "";

              const slug =
                typeof tag === "object"
                  ? tag.slug
                  : String(tag).trim();

              const expectedType =
                normalizedCategory === "habilidades"
                  ? "habilidad"
                  : "tema";

              const matchedSkill = skills.find((skill) => {
                const skillType = String(
                  skill.skill_type || ""
                )
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

                return (
                  matchType &&
                  (matchId || matchSlug)
                );
              });

              if (!matchedSkill) {
                return tag;
              }

              return {
                id: matchedSkill.id,
                nombre: matchedSkill.nombre,
                translate: matchedSkill.translate,
                slug: matchedSkill.slug,
                skill_type: matchedSkill.skill_type,
                parent: matchedSkill.parent ?? null,
              };
            }

            const matched = findCatalogMatch(
              catalogs[normalizedCategory],
              tag
            );

            if (!matched) return tag;

            return normalizeCatalogItem(
              matched,
              tag
            );
          });
        }
      );

      return hydrated;
    },
    [ensureCatalogsLoaded]
  );

  const buildUrlFromTags = useCallback(
    (
      tags,
      page = 1,
      pageSize = 16,
      pathname = location.pathname
    ) => {
      const searchParams = new URLSearchParams();

      const normalizedFilterQueryKeys = {
        idioma: "idioma_id",
        tipo_certificacion: "tipo_id",
        nivel_certificacion: "nivel_id",
      };

      Object.entries(tags || {}).forEach(([key, values]) => {
        if (!Array.isArray(values)) return;

        const normalizedCategory =
          normalizeCategoryKey(key);

        const normalizedQueryKey =
          normalizedFilterQueryKeys[normalizedCategory];

        if (normalizedQueryKey) {
          normalizeNumericIds(values).forEach((id) => {
            searchParams.append(
              normalizedQueryKey,
              String(id)
            );
          });

          return;
        }

        values.forEach((val) => {
          const queryKey = getQueryKey(key, val);
          const queryValue = getTagUrlValue(key, val);

          if (queryValue) {
            searchParams.append(
              queryKey,
              queryValue
            );
          }
        });
      });

      searchParams.set("page", String(page));
      searchParams.set("page_size", String(pageSize));

      return `${pathname}?${searchParams.toString()}`;
    },
    [location.pathname]
  );


  const loadLatestCertifications =
    useCallback(
      async (
        page = 1,
        pageSize = 16
      ) => {
        const requestId =
          ++requestSeqRef.current;

        activeRequestControllerRef.current?.abort();

        const controller =
          new AbortController();

        activeRequestControllerRef.current =
          controller;

        setLoading(true);

        try {
          const response =
            await axios.get(
              endpoints.latest_certifications,
              {
                params: {
                  page,
                  page_size: pageSize,
                },
                signal: controller.signal,
              }
            );

          if (
            requestId !==
            requestSeqRef.current
          ) {
            return;
          }

          const data =
            response?.data || {};

          const rows =
            Array.isArray(data?.results)
              ? data.results
              : [];

          setSelectedTags({});
          setCertifications(rows);

          setPagination({
            count: data.count ?? 0,
            current_page:
              data.current_page ?? page,
            page_size:
              data.page_size ?? pageSize,
            total_pages:
              data.total_pages ?? 1,
            has_next: !!data.has_next,
            has_previous:
              !!data.has_previous,
          });
        } catch (error) {
          if (
            error?.code === "ERR_CANCELED" ||
            error?.name === "CanceledError" ||
            error?.name === "AbortError"
          ) {
            return;
          }

          if (
            requestId !==
            requestSeqRef.current
          ) {
            return;
          }

          console.error(
            "Error cargando certificaciones recientes:",
            error
          );

          setCertifications([]);

          setPagination({
            count: 0,
            current_page: 1,
            page_size: pageSize,
            total_pages: 1,
            has_next: false,
            has_previous: false,
          });
        } finally {
          if (
            requestId ===
            requestSeqRef.current
          ) {
            setLoading(false);
          }

          if (
            activeRequestControllerRef.current ===
            controller
          ) {
            activeRequestControllerRef.current =
              null;
          }
        }
      },
      []
    );



  const loadCertificationsFromSearch =
    useCallback(
      async (
        search,
        page = 1,
        pageSize = 16
      ) => {
        const requestId =
          ++requestSeqRef.current;

        activeRequestControllerRef.current?.abort();

        const controller =
          new AbortController();

        activeRequestControllerRef.current =
          controller;

        setLoading(true);

        try {
          const params =
            new URLSearchParams(
              search || ""
            );

          params.delete("latest");
          params.delete("clear");

          params.set(
            "page",
            String(page)
          );

          params.set(
            "page_size",
            String(pageSize)
          );

          const query = params.toString();

          const url =
            `${endpoints.certificaciones_filter}` +
            (query ? `?${query}` : "");

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status}`
            );
          }

          const fetchData =
            await response.json();

          if (
            requestId !==
            requestSeqRef.current
          ) {
            return;
          }

          const rows = Array.isArray(
            fetchData?.results
          )
            ? fetchData.results
            : [];

          setCertifications(rows);

          setPagination({
            count: fetchData?.count ?? 0,
            current_page:
              fetchData?.current_page || page,
            page_size:
              fetchData?.page_size || pageSize,
            total_pages:
              fetchData?.total_pages || 1,
            has_next:
              !!fetchData?.has_next,
            has_previous:
              !!fetchData?.has_previous,
          });
        } catch (error) {
          if (error?.name === "AbortError") {
            return;
          }

          if (
            requestId !==
            requestSeqRef.current
          ) {
            return;
          }

          console.error(
            "Error cargando certificaciones filtradas:",
            error
          );

          setCertifications([]);

          setPagination({
            count: 0,
            current_page: 1,
            page_size: pageSize,
            total_pages: 1,
            has_next: false,
            has_previous: false,
          });
        } finally {
          if (
            requestId ===
            requestSeqRef.current
          ) {
            setLoading(false);
          }

          if (
            activeRequestControllerRef.current ===
            controller
          ) {
            activeRequestControllerRef.current = null;
          }
        }
      },
      []
    );


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



  const clearAllTags = useCallback(async () => {
    if (!isReady) return;

    const catalogs =
      await getExploreFilterCatalogs();

    const defaultLanguageId = Number(
      catalogs.defaults?.language_id ||
        catalogs.languages.find(
          (item) =>
            normalizeFilterCode(item?.code) === "es"
        )?.id ||
        0
    );

    const params = new URLSearchParams();

    if (
      Number.isInteger(defaultLanguageId) &&
      defaultLanguageId > 0
    ) {
      params.append(
        "idioma_id",
        String(defaultLanguageId)
      );
    }

    params.set("page", "1");
    params.set("page_size", "16");

    navigate(
      `/explora?${params.toString()}`,
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



  const handleBannerClick = (
    category,
    tag
  ) => {
    if (!isReady) return;

    if (
      tag ===
      "Nuevo en Top.education"
    ) {
      handleLatestClick();
      return;
    }

    /*
    * Compatibilidad:
    *
    * Si alguien llama:
    *
    * handleBannerClick(
    *   "plataforma_id",
    *   2
    * )
    *
    * lo convertimos internamente a:
    *
    * {
    *   id: 2
    * }
    *
    * para que buildUrlFromTags
    * conserve el filtro por ID.
    */
    const rawCategory =
      String(category || "")
        .trim();

    const isIdCategory =
      rawCategory.endsWith(
        "_id"
      );

    if (
      isIdCategory &&
      (
        typeof tag === "string" ||
        typeof tag === "number"
      )
    ) {
      const numericId =
        Number(tag);

      if (
        Number.isInteger(
          numericId
        ) &&
        numericId > 0
      ) {
        addTagAndNavigate(
          category,
          {
            id: numericId,
          }
        );

        return;
      }
    }

    addTagAndNavigate(
      category,
      tag
    );
  };

  const handleDomainSelect = useCallback(

    (domain) => {

      if (!isReady || !domain) return;



      const domainSkillIds =

        normalizeNumericIds(

          domain.skillIds || []

        );



      if (domainSkillIds.length === 0) {

        return;

      }



      setSelectedTags((previousTags) => {

        const currentSkills = Array.isArray(

          previousTags.habilidades

        )

          ? previousTags.habilidades

          : [];



        const existingIds = new Set(

          normalizeNumericIds(currentSkills)

        );



        const missingDomainSkills =

          domainSkillIds

            .filter(

              (skillId) =>

                !existingIds.has(skillId)

            )

            .map(buildDomainSkillTag);



        const updatedTags = {

          ...previousTags,

          habilidades: [

            ...currentSkills,

            ...missingDomainSkills,

          ],

        };



        const nextUrl = buildUrlFromTags(

          updatedTags,

          1,

          16,

          location.pathname

        );



        navigate(nextUrl, {

          replace: false,

        });



        return updatedTags;

      });

    },

    [

      buildUrlFromTags,

      isReady,

      location.pathname,

      navigate,

    ]

  );



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



  const removeKnowledgeDomain = useCallback(

    (domain) => {

      if (!isReady || !domain) return;



      const domainIds = new Set(

        normalizeNumericIds(

          domain.skillIds || []

        )

      );



      setSelectedTags((previousTags) => {

        const updatedTags = {

          ...previousTags,

        };



        const currentSkills = Array.isArray(

          previousTags.habilidades

        )

          ? previousTags.habilidades

          : [];



        const remainingSkills =

          currentSkills.filter((skill) => {

            const skillId = Number(

              typeof skill === "object"

                ? skill?.id

                : skill

            );



            return (

              !Number.isInteger(skillId) ||

              !domainIds.has(skillId)

            );

          });



        if (remainingSkills.length > 0) {

          updatedTags.habilidades =

            remainingSkills;

        } else {

          delete updatedTags.habilidades;

        }



        const nextUrl = buildUrlFromTags(

          updatedTags,

          1,

          16,

          location.pathname

        );



        navigate(nextUrl, {

          replace: false,

        });



        return updatedTags;

      });

    },

    [

      buildUrlFromTags,

      isReady,

      location.pathname,

      navigate,

    ]

  );



  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      let params =
        new URLSearchParams(
          location.search
        );

      isHydratingFromUrlRef.current = true;
      setIsReady(false);

      // -----------------------------------------------------
      // "Nuevo en Top.education" conserva su flujo propio.
      // -----------------------------------------------------
      if (params.get("latest") === "1") {
        ++hydrationSeqRef.current;

        const pageFromURL = Math.max(
          1,
          parseInt(params.get("page"), 10) || 1
        );

        const pageSizeFromURL = Math.max(
          1,
          parseInt(params.get("page_size"), 10) || 16
        );

        await loadLatestCertifications(
          pageFromURL,
          pageSizeFromURL
        );

        if (cancelled) return;

        isHydratingFromUrlRef.current = false;
        firstLoadDoneRef.current = true;
        setIsReady(true);
        return;
      }

      /*
       * Antes de consultar certificaciones normalizamos la URL.
       * getExploreFilterCatalogs usa caché/promesa de módulo, así que
       * esta espera solo afecta el primer acceso y corresponde a un
       * endpoint mínimo/cacheado.
       */
      const exploreCatalogs =
        await getExploreFilterCatalogs();

      if (cancelled) return;

      const canonical =
        canonicalizeExploreSearchParams(
          params,
          exploreCatalogs
        );

      if (canonical.changed) {
        navigate(
          `${location.pathname}?${canonical.params.toString()}`,
          { replace: true }
        );
        return;
      }

      params = canonical.params;

      const filtersFromURL =
        parseQueryParams(
          params.toString()
        );

      const pageFromURL =
        parseInt(
          params.get("page"),
          10
        ) || 1;

      const pageSizeFromURL =
        parseInt(
          params.get("page_size"),
          10
        ) || 16;

      // Pintamos el estado de URL inmediatamente. La hidratación de
      // labels/objetos corre en paralelo con la consulta de resultados.
      setSelectedTags(filtersFromURL);

      const hydrationId =
        ++hydrationSeqRef.current;

      const certificationsPromise =
        loadCertificationsFromSearch(
          `?${params.toString()}`,
          pageFromURL,
          pageSizeFromURL
        );

      hydrateTagsFromCatalogs(
        filtersFromURL
      )
        .then((hydratedFilters) => {
          if (
            cancelled ||
            hydrationId !==
              hydrationSeqRef.current
          ) {
            return;
          }

          setSelectedTags(
            hydratedFilters
          );
        })
        .catch((error) => {
          console.error(
            "Error hidratando filtros desde la URL:",
            error
          );
        });

      await certificationsPromise;

      if (cancelled) return;

      isHydratingFromUrlRef.current = false;
      firstLoadDoneRef.current = true;
      setIsReady(true);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate]);


  useEffect(() => {
    return () => {
      activeRequestControllerRef.current?.abort();
    };
  }, []);



  useEffect(() => {

    if (!loading) {

      setLoadingMessageIndex(0);

      return undefined;

    }



    const intervalId = window.setInterval(() => {

      setLoadingMessageIndex(

        (currentIndex) =>

          (currentIndex + 1) %

          LOADING_STATUS_MESSAGES.length

      );

    }, 1900);



    return () => {

      window.clearInterval(intervalId);

    };

  }, [loading]);



  const activeLoadingMessage =

    LOADING_STATUS_MESSAGES[

      loadingMessageIndex %

        LOADING_STATUS_MESSAGES.length

    ];



  const handlePageChange = (

    newPage

  ) => {

    if (

      !isReady ||

      loading

    ) {

      return;

    }



    if (

      newPage < 1 ||

      newPage >

        pagination.total_pages

    ) {

      return;

    }



    const params =

      new URLSearchParams(

        location.search

      );



    const isLatest =

      params.get("latest") ===

      "1";



    const currentPageSize =

      pagination.page_size || 16;



    let nextUrl;



    if (isLatest) {

      nextUrl =

        `${location.pathname}` +

        `?latest=1` +

        `&page=${newPage}` +

        `&page_size=${currentPageSize}`;

    } else {

      nextUrl =

        buildUrlFromTags(

          selectedTags,

          newPage,

          currentPageSize,

          location.pathname

        );

    }



    navigate(

      nextUrl,

      {

        replace: false,

      }

    );



    certificationsRef.current

      ?.scrollIntoView({

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

            aria-label="Ir a la primera página"

            disabled={current_page === 1 || !isReady || loading}

            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"

          >

            <FaAnglesLeft />

          </button>



          <button

            type="button"

            onClick={() => handlePageChange(current_page - 1)}

            aria-label="Ir a la página anterior"

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

              aria-label={`Ir a la página ${page}`}

              aria-current={page === current_page ? "page" : undefined}

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

            aria-label="Ir a la página siguiente"

            disabled={current_page === total_pages || !isReady || loading}

            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"

          >

            <FaChevronRight />

          </button>



          <button

            type="button"

            onClick={() => handlePageChange(total_pages)}

            aria-label="Ir a la última página"

            disabled={current_page === total_pages || !isReady || loading}

            className="flex h-10 w-8 md:w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"

          >

            <FaAnglesRight />

          </button>

        </div>

      </div>

    );

  };

  const selectedKnowledgeDomains = useMemo(

    () =>

      findSelectedKnowledgeDomains(

        selectedTags.habilidades || []

      ),

    [selectedTags.habilidades]

  );



  const knowledgeDomainSkillIds = useMemo(

    () =>

      new Set(

        selectedKnowledgeDomains.flatMap(

          (domain) =>

            normalizeNumericIds(

              domain.skillIds || []

            )

        )

      ),

    [selectedKnowledgeDomains]

  );



  const visibleSelectedTags = useMemo(() => {

    const result = {};



    Object.entries(selectedTags || {}).forEach(

      ([category, tags]) => {

        if (!Array.isArray(tags)) return;



        if (

          normalizeCategoryKey(category) !==

          "habilidades"

        ) {

          result[category] = tags;

          return;

        }



        const remainingSkills = tags.filter(

          (tag) => {

            const skillId = Number(

              typeof tag === "object"

                ? tag?.id

                : tag

            );



            return (

              !Number.isInteger(skillId) ||

              !knowledgeDomainSkillIds.has(

                skillId

              )

            );

          }

        );



        if (remainingSkills.length > 0) {

          result[category] =

            remainingSkills;

        }

      }

    );



    return result;

  }, [

    selectedTags,

    knowledgeDomainSkillIds,

  ]);

  const seoState = useMemo(() => {

    const params = new URLSearchParams(location.search);



    const currentPage = Math.max(

      1,

      Number.parseInt(params.get("page"), 10) || 1

    );



    const pageSize = Math.max(

      1,

      Number.parseInt(params.get("page_size"), 10) || 16

    );



    const isLatestView =

      params.get("latest") === "1";



    const ignoredParams = new Set([

      "page",

      "page_size",

      "clear",

    ]);



    const defaultLanguageId = Number(
      exploreFilterCatalogs?.defaults?.language_id || 0
    );

    const filterEntries = [...params.entries()].filter(
      ([key, value]) => {
        if (ignoredParams.has(key)) return false;

        // Español es el filtro predeterminado de la biblioteca y no crea
        // una página SEO diferente por sí solo. Ahora se identifica por ID.
        if (
          key === "idioma_id" &&
          defaultLanguageId > 0 &&
          Number(value) === defaultLanguageId
        ) {
          return false;
        }

        return String(value).trim() !== "";
      }
    );



    const hasMeaningfulFilters =

      isLatestView || filterEntries.length > 0;



    const isPaginatedView =

      currentPage > 1 || pageSize !== 16;



    const shouldIndex =

      location.pathname === "/explora" &&

      !hasMeaningfulFilters &&

      !isPaginatedView;



    const filterLabels = [];



    Object.entries(selectedTags || {}).forEach(

      ([category, tags]) => {

        if (!Array.isArray(tags)) return;



        tags.forEach((tag) => {

          const normalizedCategory =

            normalizeCategoryKey(category);



          const isDefaultSpanish =
            normalizedCategory === "idioma" &&
            defaultLanguageId > 0 &&
            getFilterTagIds(tag).includes(defaultLanguageId);

          if (isDefaultSpanish) return;



          const label = getTagLabel(category, tag);



          if (

            label &&

            !filterLabels.includes(String(label))

          ) {

            filterLabels.push(String(label));

          }

        });

      }

    );



    let title =

      "Explora cursos, certificaciones y rutas de aprendizaje";



    let description =

      "Encuentra cursos, certificaciones y rutas de aprendizaje por tema, habilidad, plataforma, universidad, empresa, nivel e idioma.";



    if (isLatestView) {

      title = "Nuevas certificaciones y cursos";

      description =

        "Descubre las certificaciones y cursos más recientes disponibles en Top Education.";

    } else if (filterLabels.length > 0) {

      const selectedLabelText = filterLabels

        .slice(0, 3)

        .join(", ");



      title = `Certificaciones de ${selectedLabelText}`;

      description = `Explora cursos y certificaciones relacionados con ${selectedLabelText} en Top Education.`;

    } else if (currentPage > 1) {

      title = `Explora certificaciones — Página ${currentPage}`;

      description = `Consulta la página ${currentPage} del catálogo de cursos y certificaciones de Top Education.`;

    }



    return {

      title,

      description,

      canonicalPath: "/explora",

      robots: shouldIndex

        ? "index, follow"

        : "noindex, follow",

      shouldIndex,

      currentPage,

      pageSize,

      isLatestView,

      hasMeaningfulFilters,

    };

  }, [

    location.pathname,

    location.search,

    selectedTags,

    exploreFilterCatalogs,

  ]);



  const collectionJsonLd = useMemo(() => {

    const startPosition =

      (seoState.currentPage - 1) * seoState.pageSize;



    const itemListElement = certifications

      .map((certification, index) => {

        const name =

          certification?.nombre ||

          certification?.name ||

          certification?.titulo ||

          "";



        const slugValue =

          certification?.slug ||

          certification?.slug_certificacion ||

          "";



        const platformName =

          certification?.plataforma_certificacion?.nombre ||

          certification?.plataforma?.nombre ||

          certification?.platform_name ||

          "";



        let itemUrl;



        if (slugValue && platformName) {

          const platformSlug = String(platformName)

            .trim()

            .toLowerCase()

            .replace(/\s+/g, "-");



          itemUrl = `https://www.top.education/certificacion/${encodeURIComponent(

            platformSlug

          )}/${encodeURIComponent(slugValue)}`;

        } else if (slugValue) {

          itemUrl = `https://www.top.education/certificacion/${encodeURIComponent(

            slugValue

          )}`;

        }



        if (!name && !itemUrl) return null;



        return {

          "@type": "ListItem",

          position: startPosition + index + 1,

          ...(name ? { name } : {}),

          ...(itemUrl ? { url: itemUrl } : {}),

        };

      })

      .filter(Boolean);



    return {

      "@context": "https://schema.org",

      "@type": "CollectionPage",

      name:

        "Explora cursos, certificaciones y rutas de aprendizaje",

      description:

        "Encuentra cursos, certificaciones y rutas de aprendizaje por tema, habilidad, plataforma, universidad, empresa, nivel e idioma.",

      url: "https://www.top.education/explora",

      ...(itemListElement.length > 0

        ? {

            mainEntity: {

              "@type": "ItemList",

              numberOfItems:

                pagination.count || itemListElement.length,

              itemListElement,

            },

          }

        : {}),

    };

  }, [

    certifications,

    pagination.count,

    seoState.currentPage,

    seoState.pageSize,

  ]);



  return (

    <>

      <Seo

        title={seoState.title}

        description={seoState.description}

        canonicalPath={seoState.canonicalPath}

        robots={seoState.robots}

        jsonLd={collectionJsonLd}

      />



      <div className="w-full pt-18 bg-[#FFFFFF]">

        <div className="border-b border-black/10 bg-white">

          <div className="container mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-2 md:px-4 py-3">

            <div className="flex flex-wrap items-center gap-2 md:gap-4">

              {[

                {

                  id:2,

                  name: "Coursera",

                  img: "/assets/platforms/coursera-logo.png",

                },

                {

                  id:1,

                  name: "EdX",

                  img: "/assets/platforms/edx-logo.png",

                },

                {

                  id:3,

                  name: "MasterClass",

                  img: "/assets/platforms/masterclass-logo.png",

                },

              ].map((platform) => (

                <button

                  type="button"

                  key={platform.name}

                  onClick={() =>
                    handleBannerClick(
                      "plataforma",
                      platform
                    )
                  }

                  disabled={!isReady}

                  className="flex h-8 py-1 items-center rounded-[25px] bg-[#F5F3EE] px-4 md:px-4 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50"

                >

                  <img

                    src={platform.img}

                    alt={`Explorar certificaciones de ${platform.name}`}

                    className="max-h-[20px] max-w-[100px] object-contain md:max-w-[150px]"

                    loading="lazy"

                    decoding="async"

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

          <div className="container mx-auto max-w-[1200px] px-4 py-5">

            <div className="mb-4 max-w-[920px]">

              <span className="!font-['Montserrat'] text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">

                Biblioteca de aprendizaje

              </span>



              <h1 className="mt-1 !font-['Montserrat'] text-[2rem] font-bold leading-[1.08em] text-[#111111] md:text-[2rem]">

                {seoState.isLatestView

                  ? "Nuevas certificaciones"

                  : "Explora certificaciones y rutas de aprendizaje"}

              </h1>



              <p className="mt-2 max-w-[960px] !font-['Montserrat'] text-[14px] leading-[1.3em] text-neutral-600 md:text-[16px]">

                Encuentra oportunidades de aprendizaje por tema, habilidad,

                plataforma, universidad, empresa, nivel e idioma.

              </p>

            </div>



            <div className="rounded-[25px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)]">

              <SearchBar selectedTags={selectedTags} />

            </div>

          </div>

        </div>



        <div className="container mx-auto py-4 min-h-[70vh]">

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[220px_1fr]">

            <aside className="relative z-20 rounded-[15px] lg:sticky lg:top-24 lg:h-fit">

              <div className="overflow-visible pr-2 pb-6">

                <IndexCategories

                  onTagSelect={handleTagSelect}

                  onDomainSelect={handleDomainSelect}

                  selectedTags={selectedTags}

                  disabled={!isReady}

                  skills={skillsCatalog}

                  empresas={filterCatalogs.empresas}

                  plataformas={filterCatalogs.plataforma}

                  idiomas={languagesCatalog}

                  exploreFilterCatalogs={exploreFilterCatalogs}

                  universidadesPorRegion={universitiesByRegion}

                />

              </div>

            </aside>



            <main className="min-w-0 px-2 md:px-0">

              <div className="mb-3">

                {loading ? (

                  <div

                    className="relative overflow-hidden rounded-[20px] border border-[#1941CF]/15 bg-[linear-gradient(135deg,#F6F8FF_0%,#FFFFFF_55%,#F3F8F5_100%)] px-5 py-4 shadow-[0_12px_35px_rgba(25,65,207,0.07)]"

                    role="status"

                    aria-live="polite"

                  >

                    <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#2563EB]/8 blur-2xl" />



                    <div className="relative flex items-center gap-4">

                      <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1941CF]/10">

                        <span className="absolute h-11 w-11 animate-ping rounded-full bg-[#1941CF]/10" />

                        <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-[#1941CF]/20 border-t-[#1941CF]" />

                      </div>



                      <div className="min-w-0 flex-1">

                        <div key={loadingMessageIndex}>

                          <p className="!font-['Montserrat'] text-[14px] font-bold text-[#111111] md:text-[15px]">

                            {activeLoadingMessage.title}

                          </p>



                          <p className="mt-0.5 !font-['Montserrat'] text-[12px] leading-[1.35em] text-neutral-500 md:text-[13px]">

                            {activeLoadingMessage.description}

                          </p>

                        </div>

                      </div>



                      {/*<div className="hidden shrink-0 items-center gap-1.5 sm:flex">

                        {LOADING_STATUS_MESSAGES.map((_, index) => (

                          <span

                            key={index}

                            className={`h-1.5 rounded-full transition-all duration-300 ${

                              index === loadingMessageIndex

                                ? "w-5 bg-[#1941CF]"

                                : "w-1.5 bg-[#1941CF]/20"

                            }`}

                          />

                        ))}

                      </div>*/}

                    </div>

                  </div>

                ) : (

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div className="flex min-h-[30px] flex-wrap gap-2">

                      {selectedKnowledgeDomains.length === 0 &&

                      (

                        Object.keys(visibleSelectedTags).length ===

                          0 ||

                        Object.values(

                          visibleSelectedTags

                        ).every(

                          (tags) =>

                            !Array.isArray(tags) ||

                            tags.length === 0

                        )

                      ) ? (

                        <p className="text-sm text-neutral-500">

                          Aún no has seleccionado filtros

                        </p>

                      ) : (

                        <>

                          {selectedKnowledgeDomains.map(

                            (domain) => (

                              <div

                                key={`domain-${domain.id}`}

                                className="flex items-center gap-2 rounded-full border border-[#1941CF]/20 bg-[#EEF2FF] py-1 pl-4 pr-2 text-sm font-semibold text-[#1941CF] shadow-sm"

                              >

                                <span>{domain.title}</span>



                                <button

                                  type="button"

                                  onClick={() =>

                                    removeKnowledgeDomain(

                                      domain

                                    )

                                  }

                                  disabled={!isReady}

                                  aria-label={`Eliminar dominio ${domain.title}`}

                                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-xs leading-[0.8em] text-[#1941CF] transition hover:bg-[#1941CF] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"

                                >

                                  ×

                                </button>

                              </div>

                            )

                          )}



                          {Object.entries(

                            visibleSelectedTags

                          ).flatMap(([category, tags]) =>

                            (tags || []).map(

                              (tag, tagIndex) => (

                                <div

                                  key={`${category}-${tagIndex}-${getTagUrlValue(

                                    category,

                                    tag

                                  )}`}

                                  className="flex items-center gap-2 rounded-full border border-black/10 bg-[#F5F3EE] py-1 pl-4 pr-2 text-sm font-medium text-neutral-800 shadow-sm"

                                >

                                  <span>

                                    {getTagLabel(

                                      category,

                                      tag

                                    )}

                                  </span>



                                  <button

                                    type="button"

                                    onClick={() =>

                                      removeSelectedTag(

                                        category,

                                        tag

                                      )

                                    }

                                    disabled={!isReady}

                                    aria-label={`Eliminar filtro ${getTagLabel(

                                      category,

                                      tag

                                    )}`}

                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-xs leading-[0.8em] text-neutral-500 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"

                                  >

                                    ×

                                  </button>

                                </div>

                              )

                            )

                          )}

                        </>

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

                )}

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