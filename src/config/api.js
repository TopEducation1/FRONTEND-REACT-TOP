const API_URL = "https://backend-django-top-production.up.railway.app";
//
console.log('API_URL:', API_URL);

const BASE_URL = API_URL;
console.log('BASE_URL:', BASE_URL);

// Endpoints
export const endpoints = {
  certificaciones: `${BASE_URL}/certificaciones/`,
  certificaciones_tags: `${BASE_URL}/certificaciones/filter/`,
  certificaciones_busqueda: `${BASE_URL}/certificaciones/busqueda/`,
  certificaciones_id: (id) => `${BASE_URL}/certificaciones/${id}/`,
  habilidades: `${BASE_URL}/certificaciones/skills/`,
  temas: `${BASE_URL}/certificaciones/topics`,
  universidades: `${BASE_URL}/certificaciones/universities/`
};

// IMPRIMIR LAS URLS DE LOS ENDPOINTS A LOS CUALES SE ESTA ACCEDIENDO
//console.log('endpoints.certificaciones:', endpoints.certificaciones);



export default BASE_URL;