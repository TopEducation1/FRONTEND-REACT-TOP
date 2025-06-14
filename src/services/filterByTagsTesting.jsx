import { endpoints } from "../config/api";


class TagFilterService {
    constructor(baseUrl = endpoints.certificaciones_tags) {
        this.baseUrl = baseUrl;
    }

    buildQueryString(tags, page = 1, pageSize = 16) {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('page_size', pageSize);

        const categoryMap = {
            'Tema': 'temas',
            'Plataforma': 'plataforma',
            'Empresa': 'empresas',
            'Universidad': 'universidades',
            'Habilidad': 'habilidades'
        };

        Object.entries(tags).forEach(([category, tagList]) => {
            const paramName = categoryMap[category];
            if (paramName && Array.isArray(tagList)) {
                tagList.forEach(tag => {
                    params.append(paramName, tag.toLowerCase());
                });
            }
        });

        return `?${params.toString()}`;
    }

    async filterByTags(selectedTags, page = 1, pageSize = 16) {
        try {
            const queryString = this.buildQueryString(selectedTags, page, pageSize);
            const url = `${this.baseUrl}${queryString}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error in TagFilterService:', error);
            throw error;
        }
    }
}

export const tagFilterService = new TagFilterService();
export default tagFilterService;
