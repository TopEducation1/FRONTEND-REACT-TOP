const API_URL = "https://app.top.education/";
//const API_URL = "http://127.0.0.1:8000";

// LOCAL HOST API URL FOR TESTING http://127.0.0.1:8000

const BASE_URL = API_URL;

// Endpoints  
export const endpoints = {
    certificaciones: `${BASE_URL}/certificaciones/`,
    certificaciones_sitemap: `${BASE_URL}/sitemap/certificaciones/`,
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
    blog_detail: (slug) => `${BASE_URL}/blog/${slug}/`,
    masterclassGrid: `${BASE_URL}/masterclass-certificaciones-grid/`,
    empresas: `${BASE_URL}/api/companies/`,
    topics: `${BASE_URL}/api/topics/`,
    platforms: `${BASE_URL}/api/platforms/`,
    universities_region: `${BASE_URL}/api/universities-by-region/`,
    universities: `${BASE_URL}/api/universities/`,
    latest_certifications: `${BASE_URL}/api/latest-certifications/`,
    original_detail: (slug) => `${BASE_URL}/originals/${slug}/`,
  };


export default endpoints;