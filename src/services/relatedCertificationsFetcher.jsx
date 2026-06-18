import endpoints from "../config/api";

const relatedCertificationsFetcher = {
  async getRelatedCertifications(slug, amount = 9) {
    const response = await fetch(
      `${endpoints.relatedCertificationsGrid(slug)}?amount=${amount}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;

    return [];
  },
};

export default relatedCertificationsFetcher;