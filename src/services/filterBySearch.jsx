import { endpoints } from "../config/api";

let currentController = null;
const searchCache = new Map();

const normalizeResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      results: data,
      count: data.length,
    };
  }

  return {
    results: Array.isArray(data?.results) ? data.results : [],
    count: Number(data?.count || 0),
  };
};

const FilterBySearch = {
  async getResults(stringQuery, options = {}) {
    try {
      const query = (stringQuery || "").trim();
      const limit = Number(options.limit || 12);
      const filters = options.filters || {};

      if (query.length < 3) {
        return { results: [], count: 0 };
      }

      const cacheKey = JSON.stringify({
        query,
        limit,
        filters,
      });

      if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
      }

      if (currentController) {
        currentController.abort();
      }

      currentController = new AbortController();

      const response = await fetch(endpoints.certificaciones_busqueda, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        signal: currentController.signal,
        body: JSON.stringify({
          data: query,
          limit,
          filters,
        }),
      });

      if (!response.ok) {
        console.error("Error al consultar búsqueda:", response.status);
        return { results: [], count: 0 };
      }

      const data = await response.json();
      const normalized = normalizeResponse(data);

      searchCache.set(cacheKey, normalized);

      return normalized;
    } catch (error) {
      if (error.name === "AbortError") {
        return { results: [], count: 0 };
      }

      console.error("Error en FilterBySearch.getResults:", error);
      return { results: [], count: 0 };
    }
  },

  clearCache() {
    searchCache.clear();
  },
};

export default FilterBySearch;