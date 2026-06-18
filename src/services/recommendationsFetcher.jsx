import endpoints from "../config/api";

const recommendationsFetcher = {
  async getRecommendations(learningRoute = {}) {
    const response = await fetch(endpoints.personalizedRecommendations, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        goal: learningRoute.goal || "",
        topics: learningRoute.topics || [],
        learning_style: learningRoute.preference || "",
        weekly_time: learningRoute.time || "",
        amount: 6,
        }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;

    return [];
  },
};

export default recommendationsFetcher;