const API_URL = "http://127.0.0.1:8000";
//https://backend-django-top-production.up.railway.app

const BASE_URL = API_URL;

// Endpoints  
export const endpoints = {
  certificaciones: `${BASE_URL}/certificaciones/`,
  
  certificaciones_tags: `${BASE_URL}/certificaciones/filter/`,
  certificaciones_busqueda: `${BASE_URL}/certificaciones/busqueda/`,
  certificaciones_id: (slug) => `${BASE_URL}/certificacion/${slug}/`,
  certificaciones_by_name: (slug) => `${BASE_URL}/certificacion/${slug}/`,
  habilidades: `${BASE_URL}/certificaciones/skills/`,
  temas: `${BASE_URL}/certificaciones/topics/`,
  universidades: `${BASE_URL}/certificaciones/universities/`,
  certificacionesCafam: `${BASE_URL}/certificacionesInterest/`,
  ultimas_certificaciones: `${BASE_URL}/ultimasCertificaciones/`,
  blogs : `${BASE_URL}/blogs/`,
  blog_detail: (slug) => `${BASE_URL}/blog/${slug}/`
};


export default endpoints;