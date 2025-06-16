import { endpoints } from "../config/api";

const fetchConfig = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include', // si usas cookies/sesión
};

const BlogsFetcher = {
    /**
     * Obtiene blogs desde la API con soporte para paginación y búsqueda
     * 
     * @param {number} page - Número de página
     * @param {number} pageSize - Tamaño de página
     * @param {string} searchQuery - Texto para buscar por nombre_blog
     */
    async getAllBlogs(page = 1, pageSize = 9, searchQuery = '') {
        try {
            const baseUrl = endpoints.blogs;
            const url = `${baseUrl}?page=${page}&page_size=${pageSize}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;

            console.log("Fetching blogs from:", url); // LOG IMPORTANTE

            const response = await fetch(url, fetchConfig);

            if (!response.ok) {
                const errText = await response.text();  // Esto ayuda mucho a ver errores del backend
                console.error("Backend error response:", errText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw error;
        }
    }

};

export default BlogsFetcher;
