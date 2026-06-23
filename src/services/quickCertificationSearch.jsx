// src/services/quickCertificationSearch.js
import endpoints from "../config/api";

let currentController = null;
const searchCache = new Map();

const QuickCertificationSearch = {
  async getResults(stringQuery, options = {}) {
    const query = String(stringQuery || "").trim();
    const limit = Number(options.limit || 8);

    if (query.length < 3) {
      return { results: [], count: 0 };
    }

    const cacheKey = `${query}-${limit}`;

    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey);
    }

    if (currentController) {
      currentController.abort();
    }

    currentController = new AbortController();

    try {
      const response = await fetch(endpoints.certificaciones_busqueda_rapida, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        signal: currentController.signal,
        body: JSON.stringify({
          data: query,
          limit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { results: [], count: 0 };
      }

      const normalized = {
        results: Array.isArray(data?.results) ? data.results : [],
        count: Number(data?.count || 0),
      };

      searchCache.set(cacheKey, normalized);

      return normalized;
    } catch (error) {
      if (error.name === "AbortError") {
        return { results: [], count: 0 };
      }

      console.error("Error en QuickCertificationSearch:", error);
      return { results: [], count: 0 };
    }
  },

  clearCache() {
    searchCache.clear();
  },
};

export default QuickCertificationSearch;