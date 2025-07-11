import { endpoints } from "../config/api";


class TagFilterService {
    constructor(baseUrl = endpoints.certificaciones_tags) {
        this.baseUrl = baseUrl;
    }

    buildQueryString(tags, page = 1, pageSize = 16) {
        const queryParts = [];
        queryParts.push(`page=${page}`);
        queryParts.push(`page_size=${pageSize}`);

        const categoryMap = {
            'Tema': 'temas',
            'Plataforma': 'plataforma',
            'Aliados': 'aliados',
            'Empresa': 'empresas',
            'Universidad': 'universidades',
            'Habilidad': 'habilidades'
        };

        Object.entries(tags).forEach(([category, tagList]) => {
            if (Array.isArray(tagList) && tagList.length) {
                tagList = tagList.filter(tag => tag != null && tag.trim() !== '');
                const validTags = tagList.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
                if (validTags.length) {
                    const categoryParam = categoryMap[category];
                    if (categoryParam) {
                        queryParts.push(`${categoryParam}=${encodeURIComponent(validTags.join(','))}`);
                    }
                }
            }
        });


        return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
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