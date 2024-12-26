import { endpoints } from "../../config/api";

const fetchConfig = {
  method: 'GET', 
  headers: {
    'Accept': 'application/json',
  },
  mode: 'cors',
  credentials: 'include',
};

const InterestCertificationsFetcher = {
  async getCertifications(amount = 7) {
    try {
      const baseUrl = endpoints.certificacionesCafam; 
      const url = `${baseUrl}?amount=${amount}`; 

      console.log('Requesting URL:', url);

      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched certifications data:', data);

      return data;
      
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }
  }
};

export default InterestCertificationsFetcher;
