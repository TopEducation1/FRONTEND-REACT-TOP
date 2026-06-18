import endpoints from "../config/api";

const fetchConfig = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
  mode: "cors",
  credentials: "include",
};

const normalizeResults = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const suggestedCertificationsFetcher = {
  async getSuggestedCertifications(amount = 9) {
    const url = `${endpoints.suggestedCertificationsGrid}?amount=${amount}`;

    const response = await fetch(url, fetchConfig);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return normalizeResults(data);
  },
};

export default suggestedCertificationsFetcher;