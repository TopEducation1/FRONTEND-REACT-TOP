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
     * Obtiene blogs desde la API con soporte para paginación, búsqueda y múltiples categorías
     * 
     * @param {number} page - Número de página
     * @param {number} pageSize - Tamaño de página
     * @param {string} searchQuery - Texto para buscar por nombre_blog
     * @param {string[] | string} categorias - Lista de categorías o cadena separada por comas
     */
    async getAllBlogs(page = 1, pageSize = 9, searchQuery = '', categorias = []) {
        try {
            const baseUrl = endpoints.blogs;
            let url = `${baseUrl}?page=${page}&page_size=${pageSize}`;

            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }

            // Si viene como string, lo convertimos a array
            if (typeof categorias === 'string') {
                categorias = categorias.split(',').map(c => c.trim());
            }

            // Validamos que sea array y tenga contenido
            if (Array.isArray(categorias) && categorias.length > 0) {
                const categoriasParam = categorias.map(c => encodeURIComponent(c)).join(',');
                url += `&categoria_blog=${categoriasParam}`;
            }

            console.log("Fetching blogs from:", url);

            const response = await fetch(url, fetchConfig);

            if (!response.ok) {
                const errText = await response.text();
                console.error("Backend error response:", errText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw error;
        }
    }
};

export default BlogsFetcher;
