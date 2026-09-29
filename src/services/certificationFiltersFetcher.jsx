import endpoints from "../config/api";

const normalizePaginationResponse = (data, page, pageSize) => {
  const payload = data && typeof data === "object" ? data : {};

  return {
    results: Array.isArray(payload.results) ? payload.results : [],
    count: payload.count ?? 0,
    current_page: payload.current_page || page,
    page_size: payload.page_size || pageSize,
    total_pages: payload.total_pages || 1,
    has_next: !!payload.has_next,
    has_previous: !!payload.has_previous,
  };
};

const certificationFiltersFetcher = {
  async getFilteredCertifications(
    search = "",
    page = 1,
    pageSize = 16,
    { signal } = {}
  ) {
    const params = new URLSearchParams(search || "");

    // Parámetros de navegación/UI: no forman parte del filtro del backend.
    params.delete("latest");
    params.delete("clear");

    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    const query = params.toString();
    const url =
      `${endpoints.certificaciones_filter}` +
      (query ? `?${query}` : "");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return normalizePaginationResponse(data, page, pageSize);
  },
};

export default certificationFiltersFetcher;
