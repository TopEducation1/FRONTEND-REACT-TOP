import endpoints from "../config/api";

let currentController = null;
const searchCache = new Map();

const MIN_SEARCH_LENGTH = 2;

const normalizeResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      results: data,
      count: data.length,
    };
  }

  return {
    results: Array.isArray(data?.results)
      ? data.results
      : [],
    count: Number(data?.count || 0),
  };
};

const FilterBySearch = {
  async getResults(stringQuery, options = {}) {
    try {
      const query = String(
        stringQuery || ""
      ).trim();

      const limit = Number(
        options.limit || 12
      );

      const filters =
        options.filters || {};

      // Permite búsquedas como:
      // IA, AI, UX, UI, etc.
      if (
        query.length <
        MIN_SEARCH_LENGTH
      ) {
        return {
          results: [],
          count: 0,
        };
      }

      /*
       * Normalizamos la query para que
       * "IA", "ia", "Ia" compartan caché.
       */
      const cacheKey =
        JSON.stringify({
          query:
            query.toLowerCase(),
          limit,
          filters,
        });

      if (
        searchCache.has(
          cacheKey
        )
      ) {
        return searchCache.get(
          cacheKey
        );
      }

      /*
       * Cancelamos únicamente la petición
       * anterior que todavía esté activa.
       */
      if (currentController) {
        currentController.abort();
      }

      const controller =
        new AbortController();

      currentController =
        controller;

      const response =
        await fetch(
          endpoints.certificaciones_busqueda,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            cache: "no-store",

            signal:
              controller.signal,

            body: JSON.stringify({
              data: query,
              limit,
              filters,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "Error al consultar búsqueda:",
          response.status,
          data
        );

        return {
          results: [],
          count: 0,
        };
      }

      const normalized =
        normalizeResponse(data);

      searchCache.set(
        cacheKey,
        normalized
      );

      return normalized;

    } catch (error) {

      if (
        error.name ===
        "AbortError"
      ) {
        return {
          results: [],
          count: 0,
        };
      }

      console.error(
        "Error en FilterBySearch.getResults:",
        error
      );

      return {
        results: [],
        count: 0,
      };
    }
  },

  clearCache() {
    searchCache.clear();
  },
};

export default FilterBySearch;