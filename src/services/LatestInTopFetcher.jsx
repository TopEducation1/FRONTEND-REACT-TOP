import { endpoints } from "../config/api";

const fetchConfig = {
  method: 'GET', 
  headers: {
    'Accept': 'application/json',
  },
  mode: 'cors',
  credentials: 'include',
};

const LatestInTopFetcher = {
  async getLatestCertifications(page = 1, pageSize = 15) {
    try {
      const baseUrl = endpoints.ultimas_certificaciones;
      const url = `${baseUrl}?page=${page}&page_size=${pageSize}`;
      
      //console.log('Requesting URL:', url);
      
      const response = await fetch(url, fetchConfig);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      return data;
      
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }
  }
};

export default LatestInTopFetcher;