// services/RankingsFetcher.js
import endpoints from '../config/api';

const RankingsFetcher = {
  async getAllRankings(page = 1, pageSize = 16, search = '', signal) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(pageSize));
    if (search) params.set('search', search);

    const url = `${endpoints.rankings}?${params.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (Array.isArray(data)) {
      return { count: data.length, results: data };
    }
    return { count: data.count ?? data.results?.length ?? 0, results: data.results ?? [] };
  },
};

export default RankingsFetcher;
